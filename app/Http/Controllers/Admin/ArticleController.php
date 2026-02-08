<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $articles = Article::with('categories')
            ->when($search, function ($q, $search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%");
            })
            ->latest()
            ->get();

        $categories = Category::all();
        return Inertia::render('Admin/Content/Articles/Index', [
            'articles' => $articles,
            'categories' => $categories,
            'filters' => ['search' => $search]
        ]);
    }

    public function create()
    {
        $categories = Category::all();
        return Inertia::render('Admin/Content/Articles/Create', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'status' => 'required|in:0,1',
            'image' => 'nullable|image|max:2048', // Cover image
            'categories' => 'array',
        ]);

        $slug = Str::slug($request->title);
        // Ensure unique slug
        $count = Article::where('slug', 'LIKE', "{$slug}%")->count();
        if ($count > 0) {
            $slug .= '-' . ($count + 1);
        }

        $validated['slug'] = $slug;
        $validated['author'] = auth()->user()->username;

        if ($request->hasFile('image')) {
            $validated['img_url'] = $request->file('image')->store('articles/covers', 'public');
        }

        $article = Article::create($validated);

        if ($request->has('categories')) {
            $article->categories()->sync($request->categories);
        }

        return redirect()->route('admin.articles.index')->with('success', 'Article created successfully.');
    }

    public function edit(Article $article)
    {
        $article->load('categories');
        $categories = Category::all();
        return Inertia::render('Admin/Content/Articles/Edit', [
            'article' => $article,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, Article $article)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'status' => 'required|in:0,1',
            'image' => 'nullable|image|max:2048',
            'categories' => 'array',
        ]);

        if ($article->title !== $request->title) {
            $slug = Str::slug($request->title);
            $count = Article::where('slug', 'LIKE', "{$slug}%")->where('id', '!=', $article->id)->count();
            if ($count > 0) {
                $slug .= '-' . ($count + 1);
            }
            $validated['slug'] = $slug;
        }

        if ($request->hasFile('image')) {
            if ($article->img_url) {
                Storage::disk('public')->delete($article->img_url);
            }
            $validated['img_url'] = $request->file('image')->store('articles/covers', 'public');
        }

        // Handle content image cleanup
        if ($article->content !== $request->input('content')) {
            $domOld = new \DOMDocument();
            @$domOld->loadHTML($article->content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
            $imagesOld = $domOld->getElementsByTagName('img');
            $oldSrcs = [];
            foreach ($imagesOld as $img) {
                if ($img instanceof \DOMElement) {
                    $src = $img->getAttribute('src');
                    if (strpos($src, '/storage/articles/content/') !== false) {
                        $oldSrcs[] = $src;
                    }
                }
            }

            $domNew = new \DOMDocument();
            @$domNew->loadHTML($request->input('content'), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
            $imagesNew = $domNew->getElementsByTagName('img');
            $newSrcs = [];
            foreach ($imagesNew as $img) {
                if ($img instanceof \DOMElement) {
                    $src = $img->getAttribute('src');
                    if (strpos($src, '/storage/articles/content/') !== false) {
                        $newSrcs[] = $src;
                    }
                }
            }

            $diff = array_diff($oldSrcs, $newSrcs);
            foreach ($diff as $src) {
                try {
                    $path = str_replace('/storage/', '', parse_url($src, PHP_URL_PATH));
                    if (Storage::disk('public')->exists($path)) {
                        Storage::disk('public')->delete($path);
                    }
                } catch (\Exception $e) {
                    // Ignore parsing errors
                }
            }
        }

        $article->update($validated);

        if ($request->has('categories')) {
            $article->categories()->sync($request->categories);
        }

        return redirect()->route('admin.articles.index')->with('success', 'Article updated successfully.');
    }

    public function destroy(Article $article)
    {
        // Delete cover image
        if ($article->img_url) {
            Storage::disk('public')->delete($article->img_url);
        }

        // Delete content images
        $dom = new \DOMDocument();
        // Suppress errors for invalid HTML
        libxml_use_internal_errors(true);
        $dom->loadHTML($article->content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        libxml_clear_errors();

        $images = $dom->getElementsByTagName('img');
        foreach ($images as $img) {
            if ($img instanceof \DOMElement) {
                $src = $img->getAttribute('src');
                // Check if image is stored locally in 'articles/content'
                if (strpos($src, '/storage/articles/content/') !== false) {
                    // Convert URL to storage path: /storage/path -> path
                    try {
                        $parsedPath = parse_url($src, PHP_URL_PATH);
                        if ($parsedPath) {
                            $path = str_replace('/storage/', '', $parsedPath);
                            if (Storage::disk('public')->exists($path)) {
                                Storage::disk('public')->delete($path);
                            }
                        }
                    } catch (\Exception $e) {
                        // Ignore parsing errors
                    }
                }
            }
        }

        $article->delete();
        return redirect()->back()->with('success', 'Article deleted successfully.');
    }

    public function checkDuplicate(Request $request)
    {
        // Placeholder or specific check if needed
        return response()->json(['exists' => false]);
    }

    public function uploadImage(Request $request)
    {
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('articles/content', 'public');
            return response()->json(['url' => Storage::url($path)]);
        }
        return response()->json(['error' => 'No image uploaded'], 400);
    }
}
