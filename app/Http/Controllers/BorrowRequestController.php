<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\BorrowRequest;
use App\Models\BookLend;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BorrowRequestController extends Controller
{
    // USER Methods
    public function store(Request $request, Book $book)
    {
        $user = $request->user();

        // 1. Check if book is available
        if (!$book->isAvailable()) {
            // Check if it's because of pending request
            $pending = BorrowRequest::where('book_id', $book->id)
                ->where('status', BorrowRequest::STATUS_PENDING)
                ->where('expires_at', '>', now())
                ->exists();

            if ($pending || !$book->isAvailable()) {
                return back()->with('error', 'Book is currently unavailable.');
            }
        }

        // 2. Check if user already has a pending request for this book
        $existing = $user->borrowRequests()
            ->where('book_id', $book->id)
            ->whereIn('status', [BorrowRequest::STATUS_PENDING, BorrowRequest::STATUS_APPROVED])
            ->exists();

        if ($existing) {
            return back()->with('error', 'You already have a pending or approved request for this book.');
        }

        // 3. Create Request
        $user->borrowRequests()->create([
            'book_id' => $book->id,
            'status' => BorrowRequest::STATUS_PENDING,
            'expires_at' => now()->addHour(),
        ]);

        return back()->with('success', 'Borrow request submitted. Waiting for admin approval.');
    }

    public function cancel(BorrowRequest $borrowRequest)
    {
        if ($borrowRequest->user_id !== auth()->id()) {
            abort(403);
        }

        if ($borrowRequest->status !== BorrowRequest::STATUS_PENDING) {
            return back()->with('error', 'Cannot cancel this request.');
        }

        $borrowRequest->update(['status' => BorrowRequest::STATUS_CANCELLED]);

        return back()->with('success', 'Request cancelled.');
    }

    // ADMIN Methods
    public function index(Request $request)
    {
        $search = $request->input('search');
        $tab = $request->input('tab', 'pending'); // 'pending' or 'history'

        $query = BorrowRequest::with(['user', 'book'])
            ->when($search, function ($q, $search) {
                $q->whereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('username', 'like', "%{$search}%");
                })->orWhereHas('book', function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%");
                });
            });

        if ($tab === 'pending') {
            $query->where('status', BorrowRequest::STATUS_PENDING);
        } else {
            $query->where('status', '!=', BorrowRequest::STATUS_PENDING);
        }

        $requests = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/BorrowRequests/Index', [
            'requests' => $requests,
            'filters' => [
                'search' => $search,
                'tab' => $tab,
            ]
        ]);
    }

    public function approve(Request $request, BorrowRequest $borrowRequest)
    {
        if ($borrowRequest->status !== BorrowRequest::STATUS_PENDING) {
            return back()->with('error', 'Request is not pending.');
        }

        // Start Transaction
        DB::transaction(function () use ($borrowRequest) {
            // 1. Update Request
            $borrowRequest->update([
                'status' => BorrowRequest::STATUS_APPROVED,
                'approved_by' => auth()->id(),
                'approved_at' => now(),
            ]);

            // 2. Update Book Status
            $borrowRequest->book->update(['status' => Book::STATUS_BORROWED]);

            // 3. Create Book Lend Record
            BookLend::create([
                'book_id' => $borrowRequest->book_id,
                'user_id' => $borrowRequest->user_id,
                'due_date' => now()->addDays(BookLend::LENDING_PERIOD_DAYS),
            ]);
        });

        return back()->with('success', 'Request approved. Book is now lent.');
    }

    public function reject(Request $request, BorrowRequest $borrowRequest)
    {
        if ($borrowRequest->status !== BorrowRequest::STATUS_PENDING) {
            return back()->with('error', 'Request is not pending.');
        }

        $request->validate(['admin_notes' => 'nullable|string']);

        $borrowRequest->update([
            'status' => BorrowRequest::STATUS_REJECTED,
            'admin_notes' => $request->admin_notes,
            'approved_by' => auth()->id(), // technically rejected_by, but using same column
        ]);

        return back()->with('success', 'Request rejected.');
    }
}
