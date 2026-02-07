<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MyBookController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $search = $request->input('search');

        $borrowedLends = $user->bookLends()
            ->with('book')
            ->when($search, function ($q, $search) {
                $q->whereHas('book', function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->get();

        $borrowRequests = $user->borrowRequests()
            ->where('status', 'pending')
            ->with('book')
            ->when($search, function ($q, $search) {
                $q->whereHas('book', function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->get();

        $mergedBorrowed = $borrowedLends->concat($borrowRequests)->sortByDesc('created_at')->values();

        return Inertia::render('User/MyBooks/Index', [
            'borrowed' => $mergedBorrowed,
            'favorites' => $user->bookFavorites()->with('book')->latest()->get(),
            'reviews' => $user->bookReviews()->with('book')->latest()->get(),
            'filters' => ['search' => $search],
        ]);
    }
}
