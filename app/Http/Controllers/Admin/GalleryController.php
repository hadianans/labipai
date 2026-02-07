<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $items = Gallery::with('tags')
            ->when($search, function ($q, $search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->latest()
            ->get();

        $tags = Tag::all(); // For filtering or adding in modal
        return Inertia::render('Admin/Content/Gallery/Index', [
            'galleryItems' => $items,
            'tags' => $tags,
            'filters' => ['search' => $search]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'image' => 'required|image|max:2048',
            'is_hero' => 'boolean',
            'tags' => 'array'
        ]);

        if ($request->hasFile('image')) {
            $validated['img_url'] = $request->file('image')->store('gallery', 'public');
        }

        $gallery = Gallery::create($validated);

        if ($request->has('tags')) {
            $gallery->tags()->sync($request->tags);
        }

        return redirect()->back()->with('success', 'Gallery item created successfully.');
    }

    public function update(Request $request, Gallery $gallery)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'is_hero' => 'boolean',
            'tags' => 'array'
        ]);

        if ($request->hasFile('image')) {
            if ($gallery->img_url) {
                Storage::disk('public')->delete($gallery->img_url);
            }
            $validated['img_url'] = $request->file('image')->store('gallery', 'public');
        }

        $gallery->update($validated);

        if ($request->has('tags')) {
            $gallery->tags()->sync($request->tags);
        }

        return redirect()->back()->with('success', 'Gallery item updated successfully.');
    }

    public function destroy(Gallery $gallery)
    {
        if ($gallery->img_url) {
            Storage::disk('public')->delete($gallery->img_url);
        }
        $gallery->delete();
        return redirect()->back()->with('success', 'Gallery item deleted successfully.');
    }
}
