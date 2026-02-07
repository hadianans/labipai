<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\BookFavorite;
use App\Models\BookLend;
use App\Models\BookReview;
use Illuminate\Http\Request;

class BookController extends Controller
{
    /**
     * List all books with pagination and search/filter
     * GET /api/books
     */
    public function index(Request $request)
    {
        $query = Book::with(['genres']);

        // Search by title, author, publisher
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('author', 'like', "%{$search}%")
                    ->orWhere('publisher', 'like', "%{$search}%")
                    ->orWhere('isbn', 'like', "%{$search}%");
            });
        }

        // Filter by genre
        if ($request->has('genre_id')) {
            $query->whereHas('genres', function ($q) use ($request) {
                $q->where('genre.id', $request->genre_id);
            });
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filter available only
        if ($request->boolean('available')) {
            $query->available();
        }

        $books = $query->orderBy('title')->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $books,
        ]);
    }

    /**
     * Get book detail
     * GET /api/books/{id}
     */
    public function show(Book $book)
    {
        $book->load(['genres', 'reviews.user']);
        $book->average_rating = $book->reviews->avg('star');
        $book->review_count = $book->reviews->count();

        return response()->json([
            'success' => true,
            'data' => $book,
        ]);
    }

    /**
     * Create new book (Admin)
     * POST /api/books
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'nullable|string|max:255',
            'editor' => 'nullable|string|max:255',
            'translator' => 'nullable|string|max:255',
            'publisher' => 'nullable|string|max:255',
            'year' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'language' => 'nullable|string|max:50',
            'page' => 'nullable|integer|min:1',
            'volume' => 'nullable|integer|min:1',
            'synopsis' => 'nullable|string',
            'isbn' => 'nullable|string|max:20',
            'type' => 'required|in:0,1',
            'img_url' => 'nullable|string|max:255',
            'genre_ids' => 'nullable|array',
            'genre_ids.*' => 'exists:genre,id',
        ]);

        $book = Book::create($validated);

        // Attach genres
        if ($request->has('genre_ids')) {
            $book->genres()->attach($request->genre_ids);
        }

        return response()->json([
            'success' => true,
            'message' => 'Buku berhasil ditambahkan',
            'data' => $book->load(['genres']),
        ], 201);
    }

    /**
     * Update book (Admin)
     * PUT /api/books/{id}
     */
    public function update(Request $request, Book $book)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'author' => 'nullable|string|max:255',
            'editor' => 'nullable|string|max:255',
            'translator' => 'nullable|string|max:255',
            'publisher' => 'nullable|string|max:255',
            'year' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'language' => 'nullable|string|max:50',
            'page' => 'nullable|integer|min:1',
            'volume' => 'nullable|integer|min:1',
            'synopsis' => 'nullable|string',
            'isbn' => 'nullable|string|max:20',
            'type' => 'sometimes|in:0,1',
            'status' => 'sometimes|in:0,1,2',
            'img_url' => 'nullable|string|max:255',
            'genre_ids' => 'nullable|array',
            'genre_ids.*' => 'exists:genre,id',
        ]);

        $book->update($validated);

        // Sync genres
        if ($request->has('genre_ids')) {
            $book->genres()->sync($request->genre_ids);
        }

        return response()->json([
            'success' => true,
            'message' => 'Buku berhasil diupdate',
            'data' => $book->load(['genres']),
        ]);
    }

    /**
     * Delete book (Admin)
     * DELETE /api/books/{id}
     */
    public function destroy(Book $book)
    {
        $book->delete();

        return response()->json([
            'success' => true,
            'message' => 'Buku berhasil dihapus',
        ]);
    }

    /**
     * Borrow a book
     * POST /api/books/{id}/borrow
     */
    public function borrow(Request $request, Book $book)
    {
        $user = $request->user();

        // Check if book is restricted
        if ($book->isRestricted()) {
            return response()->json([
                'success' => false,
                'message' => 'Buku ini tidak dapat dipinjam (Restricted)',
            ], 400);
        }

        // Check if book is available
        if (!$book->isAvailable()) {
            return response()->json([
                'success' => false,
                'message' => 'Buku sedang tidak tersedia',
            ], 400);
        }

        // Check user's active loans (max 3)
        $activeLends = $user->bookLends()->active()->count();
        if ($activeLends >= 3) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah meminjam 3 buku. Kembalikan buku terlebih dahulu.',
            ], 400);
        }

        // Create lending record
        $lend = BookLend::create([
            'book_id' => $book->id,
            'user_id' => $user->id,
            'due_date' => now()->addDays(BookLend::LENDING_PERIOD_DAYS),
        ]);

        // Update book status
        $book->update(['status' => Book::STATUS_BORROWED]);

        return response()->json([
            'success' => true,
            'message' => 'Buku berhasil dipinjam',
            'data' => [
                'lend' => $lend->load('book'),
                'due_date' => $lend->due_date->format('Y-m-d'),
            ],
        ], 201);
    }

    /**
     * Return a book
     * POST /api/books/{id}/return
     */
    public function returnBook(Request $request, Book $book)
    {
        $user = $request->user();

        $lend = $user->bookLends()
            ->where('book_id', $book->id)
            ->active()
            ->first();

        if (!$lend) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak meminjam buku ini',
            ], 400);
        }

        // Calculate fine if overdue
        $fine = null;
        if ($lend->isOverdue()) {
            $overdueDays = $this->calculateWeekdaysDiff($lend->due_date, now());
            $fineAmount = $overdueDays * 500; // Rp.500/day

            $fine = $lend->fine()->create([
                'amount' => $fineAmount,
                'is_paid' => false,
            ]);
        }

        // Mark as returned
        $lend->update(['returned_at' => now()]);

        // Update book status
        $book->update(['status' => Book::STATUS_AVAILABLE]);

        return response()->json([
            'success' => true,
            'message' => 'Buku berhasil dikembalikan',
            'data' => [
                'lend' => $lend,
                'fine' => $fine,
            ],
        ]);
    }

    /**
     * Extend book lending period
     * POST /api/books/{id}/extend
     */
    public function extend(Request $request, Book $book)
    {
        $user = $request->user();

        $lend = $user->bookLends()
            ->where('book_id', $book->id)
            ->active()
            ->first();

        if (!$lend) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak meminjam buku ini',
            ], 400);
        }

        if (!$lend->canExtend()) {
            return response()->json([
                'success' => false,
                'message' => 'Batas perpanjangan sudah tercapai (maksimal 2x)',
            ], 400);
        }

        // Extend due date
        $lend->update([
            'due_date' => $lend->due_date->addDays(BookLend::LENDING_PERIOD_DAYS),
            'extension_count' => $lend->extension_count + 1,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Peminjaman berhasil diperpanjang',
            'data' => [
                'lend' => $lend,
                'new_due_date' => $lend->due_date->format('Y-m-d'),
                'extensions_remaining' => BookLend::MAX_EXTENSIONS - $lend->extension_count,
            ],
        ]);
    }

    /**
     * Toggle book favorite
     * POST /api/books/{id}/favorite
     */
    public function toggleFavorite(Request $request, Book $book)
    {
        $user = $request->user();

        $favorite = BookFavorite::where('book_id', $book->id)
            ->where('user_id', $user->id)
            ->first();

        if ($favorite) {
            $favorite->delete();
            return response()->json([
                'success' => true,
                'message' => 'Buku dihapus dari favorit',
                'is_favorite' => false,
            ]);
        }

        BookFavorite::create([
            'book_id' => $book->id,
            'user_id' => $user->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Buku ditambahkan ke favorit',
            'is_favorite' => true,
        ]);
    }

    /**
     * Add or update book review
     * POST /api/books/{id}/review
     */
    public function review(Request $request, Book $book)
    {
        $validated = $request->validate([
            'star' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string|max:500',
        ]);

        $user = $request->user();

        $review = BookReview::updateOrCreate(
            ['book_id' => $book->id, 'user_id' => $user->id],
            $validated
        );

        return response()->json([
            'success' => true,
            'message' => 'Review berhasil disimpan',
            'data' => $review,
        ]);
    }

    /**
     * Get user's borrowed books
     * GET /api/books/my-loans
     */
    public function myLoans(Request $request)
    {
        $lends = $request->user()
            ->bookLends()
            ->with(['book.genres', 'fine'])
            ->orderByDesc('created_at')
            ->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $lends,
        ]);
    }

    /**
     * Get user's favorite books
     * GET /api/books/my-favorites
     */
    public function myFavorites(Request $request)
    {
        $favorites = $request->user()
            ->bookFavorites()
            ->with('book.genres')
            ->orderByDesc('created_at')
            ->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $favorites,
        ]);
    }

    /**
     * Calculate weekdays between two dates (excluding weekends)
     */
    private function calculateWeekdaysDiff($startDate, $endDate): int
    {
        $count = 0;
        $current = $startDate->copy();

        while ($current->lt($endDate)) {
            if (!$current->isWeekend()) {
                $count++;
            }
            $current->addDay();
        }

        return $count;
    }
}
