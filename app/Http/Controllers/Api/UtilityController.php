<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Calendar;
use App\Models\Contact;
use App\Models\Feedback;
use App\Models\Room;
use Illuminate\Http\Request;

class UtilityController extends Controller
{
    // ==================== CALENDAR ====================

    /**
     * Get calendar events
     * GET /api/calendar
     */
    public function calendar(Request $request)
    {
        $query = Calendar::query();

        // Filter by month/year
        if ($request->has('month') && $request->has('year')) {
            $query->whereMonth('start_time', $request->month)
                ->whereYear('start_time', $request->year);
        } elseif ($request->boolean('upcoming')) {
            $query->upcoming();
        }

        $events = $query->orderBy('start_time')->get();

        return response()->json([
            'success' => true,
            'data' => $events,
        ]);
    }

    /**
     * Create calendar event (Admin)
     * POST /api/calendar
     */
    public function storeCalendarEvent(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after_or_equal:start_time',
        ]);

        $event = Calendar::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Event berhasil ditambahkan',
            'data' => $event,
        ], 201);
    }

    /**
     * Update calendar event (Admin)
     * PUT /api/calendar/{id}
     */
    public function updateCalendarEvent(Request $request, Calendar $calendar)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string|max:500',
            'start_time' => 'sometimes|date',
            'end_time' => 'sometimes|date|after_or_equal:start_time',
        ]);

        $calendar->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Event berhasil diupdate',
            'data' => $calendar,
        ]);
    }

    /**
     * Delete calendar event (Admin)
     * DELETE /api/calendar/{id}
     */
    public function destroyCalendarEvent(Calendar $calendar)
    {
        $calendar->delete();

        return response()->json([
            'success' => true,
            'message' => 'Event berhasil dihapus',
        ]);
    }

    // ==================== ROOMS ====================

    /**
     * Get room bookings
     * GET /api/rooms
     */
    public function rooms(Request $request)
    {
        $query = Room::with('user');

        if ($request->boolean('upcoming')) {
            $query->upcoming();
        }

        // Filter by date
        if ($request->has('date')) {
            $query->whereDate('start_time', $request->date);
        }

        $rooms = $query->orderBy('start_time')->get();

        return response()->json([
            'success' => true,
            'data' => $rooms,
        ]);
    }

    /**
     * Book a room
     * POST /api/rooms
     */
    public function bookRoom(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'start_time' => 'required|date|after:now',
            'end_time' => 'required|date|after:start_time',
        ]);

        // Check for conflicts
        $conflict = Room::where(function ($q) use ($validated) {
            $q->whereBetween('start_time', [$validated['start_time'], $validated['end_time']])
                ->orWhereBetween('end_time', [$validated['start_time'], $validated['end_time']])
                ->orWhere(function ($q2) use ($validated) {
                    $q2->where('start_time', '<=', $validated['start_time'])
                        ->where('end_time', '>=', $validated['end_time']);
                });
        })->exists();

        if ($conflict) {
            return response()->json([
                'success' => false,
                'message' => 'Ruangan sudah dibooking pada waktu tersebut',
            ], 400);
        }

        $validated['user_id'] = $request->user()->id;
        $room = Room::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Ruangan berhasil dibooking',
            'data' => $room,
        ], 201);
    }

    /**
     * Cancel room booking
     * DELETE /api/rooms/{id}
     */
    public function cancelBooking(Request $request, Room $room)
    {
        // Only allow owner or admin to cancel
        if ($room->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk membatalkan booking ini',
            ], 403);
        }

        $room->delete();

        return response()->json([
            'success' => true,
            'message' => 'Booking berhasil dibatalkan',
        ]);
    }

    // ==================== CONTACTS ====================

    /**
     * Get contacts
     * GET /api/contacts
     */
    public function contacts()
    {
        $contacts = Contact::all()->groupBy('type');

        return response()->json([
            'success' => true,
            'data' => $contacts,
        ]);
    }

    /**
     * Create contact (Admin)
     * POST /api/contacts
     */
    public function storeContact(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|max:50',
            'detail' => 'required|string|max:255',
        ]);

        $contact = Contact::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Kontak berhasil ditambahkan',
            'data' => $contact,
        ], 201);
    }

    /**
     * Update contact (Admin)
     * PUT /api/contacts/{id}
     */
    public function updateContact(Request $request, Contact $contact)
    {
        $validated = $request->validate([
            'type' => 'sometimes|string|max:50',
            'detail' => 'sometimes|string|max:255',
        ]);

        $contact->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Kontak berhasil diupdate',
            'data' => $contact,
        ]);
    }

    /**
     * Delete contact (Admin)
     * DELETE /api/contacts/{id}
     */
    public function destroyContact(Contact $contact)
    {
        $contact->delete();

        return response()->json([
            'success' => true,
            'message' => 'Kontak berhasil dihapus',
        ]);
    }

    // ==================== FEEDBACK ====================

    /**
     * Submit feedback
     * POST /api/feedback
     */
    public function submitFeedback(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'is_anonymous' => 'boolean',
        ]);

        $validated['user_id'] = $request->boolean('is_anonymous') ? null : $request->user()?->id;

        $feedback = Feedback::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Feedback berhasil dikirim. Terima kasih!',
            'data' => $feedback,
        ], 201);
    }

    /**
     * Get all feedback (Admin)
     * GET /api/feedback
     */
    public function feedbackList(Request $request)
    {
        $query = Feedback::with('user');

        if ($request->boolean('anonymous')) {
            $query->anonymous();
        }

        $feedbacks = $query->orderByDesc('created_at')
            ->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $feedbacks,
        ]);
    }
}
