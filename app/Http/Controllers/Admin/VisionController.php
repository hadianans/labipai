<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vision;
use App\Models\Mission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VisionController extends Controller
{
    public function index()
    {
        $visions = Vision::with('missions')->latest()->get();
        return Inertia::render('Admin/Organization/Visions/Index', [
            'visions' => $visions
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vision_point' => 'required|string',
            'year' => 'required|integer|unique:vision,year',
            'is_active' => 'boolean',
        ]);

        Vision::create($validated);

        return redirect()->back()->with('success', 'Vision created successfully.');
    }

    public function update(Request $request, Vision $vision)
    {
        $validated = $request->validate([
            'vision_point' => 'required|string',
            'year' => 'required|integer|unique:vision,year,' . $vision->id,
            'is_active' => 'boolean',
        ]);

        $vision->update($validated);

        return redirect()->back()->with('success', 'Vision updated successfully.');
    }

    public function destroy(Vision $vision)
    {
        $vision->delete();

        return redirect()->back()->with('success', 'Vision deleted successfully.');
    }

    // Mission methods
    public function storeMission(Request $request, Vision $vision)
    {
        $validated = $request->validate([
            'mission_point' => 'required|string|max:255',
        ]);

        $vision->missions()->create($validated);

        return redirect()->back()->with('success', 'Mission added successfully.');
    }

    public function updateMission(Request $request, Mission $mission)
    {
        $validated = $request->validate([
            'mission_point' => 'required|string|max:255',
        ]);

        $mission->update($validated);

        return redirect()->back()->with('success', 'Mission updated successfully.');
    }

    public function destroyMission(Mission $mission)
    {
        $mission->delete();

        return redirect()->back()->with('success', 'Mission deleted successfully.');
    }
}
