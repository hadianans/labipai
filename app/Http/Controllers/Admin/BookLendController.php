<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\BookLend;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BookLendController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $tab = $request->input('tab', 'active'); // 'active' or 'history'

        $query = BookLend::with(['book', 'user'])
            ->when($search, function ($q, $search) {
                $q->whereHas('user', function ($q) use ($search) {
                    $q->where('username', 'like', "%{$search}%");
                })->orWhereHas('book', function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%");
                });
            });

        if ($tab === 'active') {
            $query->whereNull('returned_at');
        } else {
            $query->whereNotNull('returned_at');
        }

        $lends = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Library/Lends/Index', [
            'lends' => $lends,
            'filters' => [
                'search' => $search,
                'tab' => $tab,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'book_id' => 'required|exists:book,id',
            'user_id' => 'required|exists:user,id',
            'due_date' => 'required|date|after:today',
        ]);

        $book = Book::find($validated['book_id']);
        if ($book->status != '0') {
            return redirect()->back()->withErrors(['book_id' => 'This book is currently unavailable (Borrowed or Missing).']);
        }

        DB::transaction(function () use ($validated) {
            BookLend::create([
                'book_id' => $validated['book_id'],
                'user_id' => $validated['user_id'],
                'due_date' => $validated['due_date'],
            ]);

            // Update book status to borrowed
            Book::where('id', $validated['book_id'])->update(['status' => '1']);
        });

        return redirect()->back()->with('success', 'Book lent successfully.');
    }

    public function update(Request $request, BookLend $lend)
    {
        // Handle Return
        if ($request->has('return')) {
            DB::transaction(function () use ($lend) {
                $lend->update(['returned_at' => now()]);
                $lend->book->update(['status' => '0']); // Make book available

                // Check for fines (simple calculation: 500 per day overdue)
                if ($lend->due_date < now()) {
                    $diff = now()->diffInDays($lend->due_date, false); // Negative if overdue (past due date)
                    // Carbon diffInDays returns positive if just difference, but we want to check if PAST due.
                    // Actually $lend->due_date->diffInDays(now()) is better.

                    // Simple logic: if now > due_date
                    if (now()->greaterThan($lend->due_date)) {
                        // Exclude weekends if strict, but let's do simple days for now as per migration comment 500/day
                        // "Rp.500/day (excl. weekend)" - Migration says excluding weekends.
                        // For MVP let's implement simple calendar days first or basic loop.

                        $daysOverdue = $lend->due_date->diffInDays(now());
                        // Filter weekends if needed, but for simplicity let's stick to total days first or add TODO.
                        // Migration explicit about weekends.

                        // Start date: due_date + 1 day
                        // End date: now
                        $start = $lend->due_date->copy()->addDay();
                        $end = now();
                        $daysCount = 0;

                        while ($start->lte($end)) {
                            if (!$start->isWeekend()) {
                                $daysCount++;
                            }
                            $start->addDay();
                        }

                        if ($daysCount > 0) {
                            $lend->fine()->create([
                                'amount' => $daysCount * 500,
                                'is_paid' => false
                            ]);
                        }
                    }
                }
            });

            return redirect()->back()->with('success', 'Book returned successfully.');
        }

        // Handle Extension
        if ($request->has('extend')) {
            if (!$lend->canExtend()) {
                return redirect()->back()->with('error', 'Cannot extend this loan.');
            }

            $lend->update([
                'due_date' => $lend->due_date->addDays(BookLend::LENDING_PERIOD_DAYS),
                'extension_count' => $lend->extension_count + 1
            ]);

            return redirect()->back()->with('success', 'Loan extended successfully.');
        }

        return redirect()->back();
    }

    public function destroy(BookLend $lend)
    {
        // Restore book status if deleting an active loan
        if (!$lend->isReturned()) {
            $lend->book->update(['status' => '0']);
        }
        $lend->delete();
        return redirect()->back()->with('success', 'Loan record deleted.');
    }
}
