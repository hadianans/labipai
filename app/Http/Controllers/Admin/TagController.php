<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TagController extends Controller
{
    public function index()
    {
        $tags = Tag::latest()->get();
        return Inertia::render('Admin/Content/Tags/Index', [
            'tags' => $tags
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:tag,name',
        ]);

        Tag::create($validated);

        return redirect()->back()->with('success', 'Tag created successfully.');
    }

    public function update(Request $request, Tag $tag)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:tag,name,' . $tag->id,
        ]);

        $tag->update($validated);

        return redirect()->back()->with('success', 'Tag updated successfully.');
    }

    public function destroy(Tag $tag)
    {
        $tag->delete();
        return redirect()->back()->with('success', 'Tag deleted successfully.');
    }
}
