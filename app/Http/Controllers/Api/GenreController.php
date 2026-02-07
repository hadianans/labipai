<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Genre;
use Illuminate\Http\Request;

class GenreController extends Controller
{
    /**
     * List all genres
     * GET /api/genres
     */
    public function index()
    {
        $genres = Genre::withCount('books')->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data' => $genres,
        ]);
    }

    /**
     * Create new genre (Admin)
     * POST /api/genres
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:genre,name',
        ]);

        $genre = Genre::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Genre berhasil ditambahkan',
            'data' => $genre,
        ], 201);
    }

    /**
     * Update genre (Admin)
     * PUT /api/genres/{id}
     */
    public function update(Request $request, Genre $genre)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:genre,name,' . $genre->id,
        ]);

        $genre->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Genre berhasil diupdate',
            'data' => $genre,
        ]);
    }

    /**
     * Delete genre (Admin)
     * DELETE /api/genres/{id}
     */
    public function destroy(Genre $genre)
    {
        $genre->delete();

        return response()->json([
            'success' => true,
            'message' => 'Genre berhasil dihapus',
        ]);
    }
}
