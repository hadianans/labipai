<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Genre;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class GenreController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:genre,name',
        ]);

        Genre::create([
            'name' => $request->name,
        ]);

        return redirect()->back()->with('success', 'Genre created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Genre $genre): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:genre,name,' . $genre->id,
        ]);

        $genre->update([
            'name' => $request->name,
        ]);

        return redirect()->back()->with('success', 'Genre updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Genre $genre): RedirectResponse
    {
        $genre->delete();

        return redirect()->back()->with('success', 'Genre deleted successfully.');
    }
}
