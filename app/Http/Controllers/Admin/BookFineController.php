<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BookFine;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookFineController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $tab = $request->input('tab', 'unpaid'); // 'unpaid' or 'paid'

        $query = BookFine::with(['lend.user', 'lend.book'])
            ->when($search, function ($q, $search) {
                $q->whereHas('lend.user', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('username', 'like', "%{$search}%");
                })->orWhereHas('lend.book', function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%");
                });
            });

        if ($tab === 'unpaid') {
            $query->where('is_paid', false);
        } else {
            $query->where('is_paid', true);
        }

        $fines = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Library/Fines/Index', [
            'fines' => $fines,
            'filters' => [
                'search' => $search,
                'tab' => $tab,
            ]
        ]);
    }

    public function update(Request $request, BookFine $fine)
    {
        // Mark as paid
        if ($request->has('pay')) {
            $fine->update(['is_paid' => true]);
            return redirect()->back()->with('success', 'Fine marked as paid.');
        }

        return redirect()->back();
    }
}
