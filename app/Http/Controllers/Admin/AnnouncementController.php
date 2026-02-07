<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class AnnouncementController extends Controller
{
    public function index()
    {
        $announcements = Announcement::latest()->get();
        return Inertia::render('Admin/Utility/Announcements/Index', [
            'announcements' => $announcements
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Utility/Announcements/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'action_url' => 'nullable|url',
            'priority' => 'required|in:0,1,2',
            'type' => 'required|in:0,1',
            'status' => 'required|in:0,1',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        if ($request->hasFile('image')) {
            $validated['img_url'] = $request->file('image')->store('announcements', 'public');
        }

        Announcement::create($validated);

        return redirect()->route('admin.announcements.index')->with('success', 'Announcement created successfully.');
    }

    public function edit(Announcement $announcement)
    {
        return Inertia::render('Admin/Utility/Announcements/Edit', [
            'announcement' => $announcement
        ]);
    }

    public function update(Request $request, Announcement $announcement)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'action_url' => 'nullable|url',
            'priority' => 'required|in:0,1,2',
            'type' => 'required|in:0,1',
            'status' => 'required|in:0,1',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        if ($request->hasFile('image')) {
            if ($announcement->img_url) {
                Storage::disk('public')->delete($announcement->img_url);
            }
            $validated['img_url'] = $request->file('image')->store('announcements', 'public');
        }

        $announcement->update($validated);

        return redirect()->route('admin.announcements.index')->with('success', 'Announcement updated successfully.');
    }

    public function destroy(Announcement $announcement)
    {
        if ($announcement->img_url) {
            Storage::disk('public')->delete($announcement->img_url);
        }
        $announcement->delete();
        return redirect()->back()->with('success', 'Announcement deleted successfully.');
    }
}
