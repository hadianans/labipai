<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\BookCopy;
use App\Models\Genre;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $books = Book::query()
            ->with(['genres'])
            ->when($request->search, function ($query, $search) {
                $query->where('title', 'like', '%' . $search . '%')
                    ->orWhere('author', 'like', '%' . $search . '%')
                    ->orWhere('isbn', 'like', '%' . $search . '%');
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Books/Index', [
            'books' => $books,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Books/Create', [
            'genres' => Genre::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'nullable|string|max:255',
            'editor' => 'nullable|string|max:255',
            'translator' => 'nullable|string|max:255',
            'publisher' => 'nullable|string|max:255',
            'year' => 'nullable|integer|min:1000|max:' . (date('Y') + 1),
            'language' => 'nullable|string|max:255',
            'page' => 'nullable|integer|min:1',
            'volume' => 'nullable|integer|min:1',
            'synopsis' => 'nullable|string',
            'isbn' => 'nullable|string|max:255',
            'type' => 'required|in:0,1',
            'status' => 'required|in:0,1,2',
            'genres' => 'nullable|array',
            'genres.*' => 'exists:genre,id',
            'img_url' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:1024',
            'duplicate_book_ids' => 'nullable|array',
            'duplicate_book_ids.*' => 'exists:book,id',
        ]);

        $bookData = $request->except(['genres', 'img_url', 'duplicate_book_ids']);

        if ($request->hasFile('img_url')) {
            $path = $request->file('img_url')->store('books', 'public');
            $bookData['img_url'] = '/storage/' . $path;
        }

        $book = Book::create($bookData);

        if ($request->has('genres')) {
            $book->genres()->attach($request->genres);
        }

        if ($request->has('duplicate_book_ids')) {
            $this->syncDuplicates($book, $request->duplicate_book_ids);
        }

        return redirect()->route('admin.books.index')->with('success', 'Book created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Book $book): Response
    {
        $book->load(['genres', 'copies']);
        $duplicates = [];

        $copy = $book->copies->first();
        if ($copy) {
            $duplicates = Book::whereHas('copies', function ($q) use ($copy) {
                $q->where('duplicate_code', $copy->duplicate_code);
            })->where('id', '!=', $book->id)->get();
        }

        return Inertia::render('Admin/Books/Edit', [
            'book' => $book,
            'genres' => Genre::all(),
            'relatedBooks' => $duplicates,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Book $book): RedirectResponse
    {
        // For update, sometimes we send FormData which turns everything to strings.
        // We use _method: 'PATCH' (or PUT) in client side.

        $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'nullable|string|max:255',
            'editor' => 'nullable|string|max:255',
            'translator' => 'nullable|string|max:255',
            'publisher' => 'nullable|string|max:255',
            'year' => 'nullable|integer|min:1000|max:' . (date('Y') + 1),
            'language' => 'nullable|string|max:255',
            'page' => 'nullable|integer|min:1',
            'volume' => 'nullable|integer|min:1',
            'synopsis' => 'nullable|string',
            'isbn' => 'nullable|string|max:255',
            'type' => 'required|in:0,1',
            'status' => 'required|in:0,1,2',
            'genres' => 'nullable|array',
            'genres.*' => 'exists:genre,id',
            'img_url' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:1024',
            'duplicate_book_ids' => 'nullable|array',
            'duplicate_book_ids.*' => 'exists:book,id',
        ]);

        $bookData = $request->except(['genres', 'img_url', '_method', 'duplicate_book_ids']);

        if ($request->hasFile('img_url')) {
            // Delete old image if exists
            if ($book->img_url) {
                $oldPath = str_replace('/storage/', '', $book->img_url);
                Storage::disk('public')->delete($oldPath);
            }
            // Store new image
            $path = $request->file('img_url')->store('books', 'public');
            $bookData['img_url'] = '/storage/' . $path;
        }

        $book->update($bookData);

        if ($request->has('genres')) {
            $book->genres()->sync($request->genres);
        }

        // Handle duplicates
        if ($request->has('duplicate_book_ids')) {
            $this->syncDuplicates($book, $request->duplicate_book_ids);
        }

        return redirect()->route('admin.books.index')->with('success', 'Book updated successfully.');
    }

    /**
     * Check if book exists for duplicate linking
     */
    public function checkDuplicate(Request $request)
    {
        $request->validate([
            'id' => 'required|numeric',
        ]);

        $book = Book::find($request->id);

        if (!$book) {
            return response()->json(['message' => 'Book not found'], 404);
        }

        return response()->json([
            'id' => $book->id,
            'title' => $book->title,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Book $book): RedirectResponse
    {
        if ($book->img_url) {
            $oldPath = str_replace('/storage/', '', $book->img_url);
            Storage::disk('public')->delete($oldPath);
        }

        // Check if book has a copy code to cleanup later
        $copyCode = null;
        $bookCopy = BookCopy::where('book_id', $book->id)->first();
        if ($bookCopy) {
            $copyCode = $bookCopy->duplicate_code;
            // The row will be deleted via cascade, but we need to check if we need to dissolve the group
        }

        $book->genres()->detach();
        $book->delete();

        if ($copyCode) {
            $this->cleanupDuplicate($copyCode);
        }

        return redirect()->route('admin.books.index')->with('success', 'Book deleted successfully.');
    }

    /**
     * Sync duplicate book logic
     * 
     * Rules:
     * 1. When adding duplicates, join the existing group if one exists
     * 2. Error if trying to merge books from different existing groups
     * 3. When removing a book from a group, reset its is_show to true
     * 4. Randomly select one book per group to have is_show = true
     */
    private function syncDuplicates(Book $book, array $duplicateIds)
    {
        // Filter out empty values and convert to integers
        $duplicateIds = array_filter(array_map('intval', $duplicateIds));

        // If no duplicates provided, remove current book from any group
        if (empty($duplicateIds)) {
            $currentCopy = BookCopy::where('book_id', $book->id)->first();
            if ($currentCopy) {
                $oldCode = $currentCopy->duplicate_code;
                $currentCopy->delete();

                // Reset is_show for the book being removed
                $book->update(['is_show' => true]);

                // Cleanup the old group
                $this->cleanupDuplicate($oldCode);
            }
            return;
        }

        // Collect all existing duplicate_codes from provided IDs
        $existingCopies = BookCopy::whereIn('book_id', $duplicateIds)->get();
        $existingCodes = $existingCopies->pluck('duplicate_code')->unique()->filter()->values();

        // Also check current book's code
        $currentCopy = BookCopy::where('book_id', $book->id)->first();
        if ($currentCopy) {
            $existingCodes->push($currentCopy->duplicate_code);
            $existingCodes = $existingCodes->unique()->filter()->values();
        }

        // Error check: Cannot merge books from different existing groups
        if ($existingCodes->count() > 1) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'duplicate_book_ids' => 'Cannot add duplicates from different existing groups. Please remove conflicting books first.'
            ]);
        }

        // Determine the code to use
        $code = $existingCodes->first() ?? uniqid('CPY-');

        // All IDs that should be in this group (current book + provided duplicates)
        $allIds = array_unique(array_merge([$book->id], $duplicateIds));

        // Track old codes for cleanup
        $oldCodesToCleanup = [];

        // Update/Create copies for all books
        foreach ($allIds as $id) {
            if (!Book::where('id', $id)->exists()) {
                continue;
            }

            // Track if this book was in a different group
            $existingBookCopy = BookCopy::where('book_id', $id)->first();
            if ($existingBookCopy && $existingBookCopy->duplicate_code !== $code) {
                $oldCodesToCleanup[] = $existingBookCopy->duplicate_code;
            }

            BookCopy::updateOrCreate(
                ['book_id' => $id],
                ['duplicate_code' => $code]
            );
        }

        // Remove books that were in this group but are NOT in our new list
        $removedBooks = BookCopy::where('duplicate_code', $code)
            ->whereNotIn('book_id', $allIds)
            ->pluck('book_id');

        if ($removedBooks->isNotEmpty()) {
            Book::whereIn('id', $removedBooks)->update(['is_show' => true]);
            BookCopy::where('duplicate_code', $code)
                ->whereNotIn('book_id', $allIds)
                ->delete();
        }

        // Cleanup old groups that may now have < 2 members
        foreach (array_unique($oldCodesToCleanup) as $oldCode) {
            $this->cleanupDuplicate($oldCode);
        }

        // Cleanup current group if < 2 members
        $this->cleanupDuplicate($code);

        // Update is_show for current group members
        $currentMembers = BookCopy::where('duplicate_code', $code)->pluck('book_id')->toArray();
        if (count($currentMembers) >= 2) {
            // Reset all to false first
            Book::whereIn('id', $currentMembers)->update(['is_show' => false]);

            // Randomly select one to be true
            $randomId = $currentMembers[array_rand($currentMembers)];
            Book::where('id', $randomId)->update(['is_show' => true]);
        }
    }

    /**
     * Cleanup duplicate group if < 2 items
     */
    private function cleanupDuplicate($code)
    {
        $copies = BookCopy::where('duplicate_code', $code)->get();
        if ($copies->count() < 2) {
            // Reset is_show to true for any remaining book (should be just 1)
            $bookIds = $copies->pluck('book_id');
            if ($bookIds->isNotEmpty()) {
                Book::whereIn('id', $bookIds)->update(['is_show' => true]);
            }

            BookCopy::where('duplicate_code', $code)->delete();
        }
    }
}
