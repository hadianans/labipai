<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\BookFavorite;
use Illuminate\Http\Request;

class BookFavoriteController extends Controller
{
    public function store(Request $request, Book $book)
    {
        $user = $request->user();

        // Check if already favorited
        $existing = $user->bookFavorites()->where('book_id', $book->id)->first();

        if ($existing) {
            $existing->delete();
            $message = 'Book removed from favorites.';
        } else {
            $user->bookFavorites()->create([
                'book_id' => $book->id,
            ]);
            $message = 'Book added to favorites.';
        }

        if ($request->wantsJson()) {
            return response()->json([
                'status' => 'success',
                'favorited' => !$existing,
                'message' => $message
            ]);
        }

        return back()->with('success', $message);
    }
}
