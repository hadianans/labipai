<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\BookReview;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BookReviewController extends Controller
{
    public function store(Request $request, Book $book)
    {
        $request->validate([
            'star' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string|max:1000',
        ]);

        $book->reviews()->updateOrCreate(
            ['user_id' => $request->user()->id],
            [
                'star' => $request->star,
                'review' => $request->review,
            ]
        );

        return back()->with('success', 'Review submitted successfully.');
    }

    public function destroy(BookReview $review)
    {
        // Ensure user owns the review
        if ($review->user_id !== auth()->id()) {
            abort(403);
        }

        $review->delete();

        return back()->with('success', 'Review deleted.');
    }
}
