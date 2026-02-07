<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;

class CategoryTagController extends Controller
{
    // ==================== CATEGORIES ====================

    /**
     * List all categories
     * GET /api/categories
     */
    public function categories()
    {
        $categories = Category::withCount('articles')->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    /**
     * Create category (Admin)
     * POST /api/categories
     */
    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:category,name',
        ]);

        $category = Category::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil ditambahkan',
            'data' => $category,
        ], 201);
    }

    /**
     * Update category (Admin)
     * PUT /api/categories/{id}
     */
    public function updateCategory(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:category,name,' . $category->id,
        ]);

        $category->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil diupdate',
            'data' => $category,
        ]);
    }

    /**
     * Delete category (Admin)
     * DELETE /api/categories/{id}
     */
    public function destroyCategory(Category $category)
    {
        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil dihapus',
        ]);
    }

    // ==================== TAGS ====================

    /**
     * List all tags
     * GET /api/tags
     */
    public function tags()
    {
        $tags = Tag::withCount('galleries')->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data' => $tags,
        ]);
    }

    /**
     * Create tag (Admin)
     * POST /api/tags
     */
    public function storeTag(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:tag,name',
        ]);

        $tag = Tag::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Tag berhasil ditambahkan',
            'data' => $tag,
        ], 201);
    }

    /**
     * Update tag (Admin)
     * PUT /api/tags/{id}
     */
    public function updateTag(Request $request, Tag $tag)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:tag,name,' . $tag->id,
        ]);

        $tag->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Tag berhasil diupdate',
            'data' => $tag,
        ]);
    }

    /**
     * Delete tag (Admin)
     * DELETE /api/tags/{id}
     */
    public function destroyTag(Tag $tag)
    {
        $tag->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tag berhasil dihapus',
        ]);
    }
}
