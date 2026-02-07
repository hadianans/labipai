<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    /**
     * List all galleries
     * GET /api/galleries
     */
    public function index(Request $request)
    {
        $query = Gallery::with('tags');

        // Search
        if ($request->has('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        // Filter by tag
        if ($request->has('tag_id')) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->where('tag.id', $request->tag_id);
            });
        }

        // Filter hero images only
        if ($request->boolean('hero')) {
            $query->hero();
        }

        $galleries = $query->orderByDesc('created_at')
            ->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $galleries,
        ]);
    }

    /**
     * Get gallery detail
     * GET /api/galleries/{id}
     */
    public function show(Gallery $gallery)
    {
        $gallery->load('tags');

        return response()->json([
            'success' => true,
            'data' => $gallery,
        ]);
    }

    /**
     * Create new gallery (Admin)
     * POST /api/galleries
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'alt_text' => 'nullable|string|max:255',
            'img_url' => 'required|string|max:255',
            'is_hero' => 'boolean',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tag,id',
        ]);

        $gallery = Gallery::create($validated);

        if ($request->has('tag_ids')) {
            $gallery->tags()->attach($request->tag_ids);
        }

        return response()->json([
            'success' => true,
            'message' => 'Gallery berhasil ditambahkan',
            'data' => $gallery->load('tags'),
        ], 201);
    }

    /**
     * Update gallery (Admin)
     * PUT /api/galleries/{id}
     */
    public function update(Request $request, Gallery $gallery)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string|max:500',
            'alt_text' => 'nullable|string|max:255',
            'img_url' => 'sometimes|string|max:255',
            'is_hero' => 'boolean',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tag,id',
        ]);

        $gallery->update($validated);

        if ($request->has('tag_ids')) {
            $gallery->tags()->sync($request->tag_ids);
        }

        return response()->json([
            'success' => true,
            'message' => 'Gallery berhasil diupdate',
            'data' => $gallery->load('tags'),
        ]);
    }

    /**
     * Delete gallery (Admin)
     * DELETE /api/galleries/{id}
     */
    public function destroy(Gallery $gallery)
    {
        $gallery->delete();

        return response()->json([
            'success' => true,
            'message' => 'Gallery berhasil dihapus',
        ]);
    }

    /**
     * Get hero images for slider
     * GET /api/galleries/hero
     */
    public function heroImages()
    {
        $heroes = Gallery::hero()->orderByDesc('created_at')->get();

        return response()->json([
            'success' => true,
            'data' => $heroes,
        ]);
    }
}
