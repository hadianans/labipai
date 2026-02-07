<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    /**
     * List all published articles
     * GET /api/articles
     */
    public function index(Request $request)
    {
        $query = Article::with(['categories', 'assets']);

        // Only show published for non-admin
        if (!$request->user()?->isAdmin()) {
            $query->published();
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->has('category_id')) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('category.id', $request->category_id);
            });
        }

        $articles = $query->orderByDesc('created_at')
            ->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $articles,
        ]);
    }

    /**
     * Get article by slug
     * GET /api/articles/{slug}
     */
    public function show($slug)
    {
        $article = Article::with(['categories', 'assets'])
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $article,
        ]);
    }

    /**
     * Create new article (Admin)
     * POST /api/articles
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:article,slug',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'nullable|string',
            'status' => 'required|in:0,1',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:category,id',
        ]);

        $article = Article::create($validated);

        if ($request->has('category_ids')) {
            $article->categories()->attach($request->category_ids);
        }

        return response()->json([
            'success' => true,
            'message' => 'Artikel berhasil dibuat',
            'data' => $article->load('categories'),
        ], 201);
    }

    /**
     * Update article (Admin)
     * PUT /api/articles/{id}
     */
    public function update(Request $request, Article $article)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|max:255|unique:article,slug,' . $article->id,
            'excerpt' => 'nullable|string|max:500',
            'content' => 'nullable|string',
            'status' => 'sometimes|in:0,1',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:category,id',
        ]);

        $article->update($validated);

        if ($request->has('category_ids')) {
            $article->categories()->sync($request->category_ids);
        }

        return response()->json([
            'success' => true,
            'message' => 'Artikel berhasil diupdate',
            'data' => $article->load('categories'),
        ]);
    }

    /**
     * Delete article (Admin)
     * DELETE /api/articles/{id}
     */
    public function destroy(Article $article)
    {
        $article->delete();

        return response()->json([
            'success' => true,
            'message' => 'Artikel berhasil dihapus',
        ]);
    }
}
