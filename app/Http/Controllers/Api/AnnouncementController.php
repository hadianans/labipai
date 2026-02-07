<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    /**
     * Get active announcements
     * GET /api/announcements
     */
    public function index(Request $request)
    {
        $query = Announcement::query();

        // Only show active for non-admin
        if (!$request->user()?->isAdmin()) {
            $query->active();
        }

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filter popups only
        if ($request->boolean('popup')) {
            $query->popups();
        }

        // Filter sections only
        if ($request->boolean('section')) {
            $query->sections();
        }

        $announcements = $query->orderByDesc('priority')
            ->orderByDesc('created_at')
            ->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $announcements,
        ]);
    }

    /**
     * Get announcement detail
     * GET /api/announcements/{id}
     */
    public function show(Announcement $announcement)
    {
        return response()->json([
            'success' => true,
            'data' => $announcement,
        ]);
    }

    /**
     * Create new announcement (Admin)
     * POST /api/announcements
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'img_url' => 'nullable|string|max:255',
            'action_url' => 'nullable|string|max:255',
            'priority' => 'required|in:0,1,2',
            'type' => 'required|in:0,1',
            'status' => 'required|in:0,1',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $announcement = Announcement::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Pengumuman berhasil dibuat',
            'data' => $announcement,
        ], 201);
    }

    /**
     * Update announcement (Admin)
     * PUT /api/announcements/{id}
     */
    public function update(Request $request, Announcement $announcement)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'nullable|string',
            'img_url' => 'nullable|string|max:255',
            'action_url' => 'nullable|string|max:255',
            'priority' => 'sometimes|in:0,1,2',
            'type' => 'sometimes|in:0,1',
            'status' => 'sometimes|in:0,1',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $announcement->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Pengumuman berhasil diupdate',
            'data' => $announcement,
        ]);
    }

    /**
     * Delete announcement (Admin)
     * DELETE /api/announcements/{id}
     */
    public function destroy(Announcement $announcement)
    {
        $announcement->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pengumuman berhasil dihapus',
        ]);
    }
}
