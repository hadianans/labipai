<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Program;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ProgramController extends Controller
{
    public function index()
    {
        $programs = Program::latest()->get();
        return Inertia::render('Admin/Organization/Programs/Index', [
            'programs' => $programs
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'detail_url' => 'nullable|url',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['img_url'] = $request->file('image')->store('programs', 'public');
        }

        Program::create($validated);

        return redirect()->back()->with('success', 'Program created successfully.');
    }

    public function update(Request $request, Program $program)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'detail_url' => 'nullable|url',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($program->img_url) {
                Storage::disk('public')->delete($program->img_url);
            }
            $validated['img_url'] = $request->file('image')->store('programs', 'public');
        }

        $program->update($validated);

        return redirect()->back()->with('success', 'Program updated successfully.');
    }

    public function destroy(Program $program)
    {
        if ($program->img_url) {
            Storage::disk('public')->delete($program->img_url);
        }

        $program->delete();

        return redirect()->back()->with('success', 'Program deleted successfully.');
    }
}
