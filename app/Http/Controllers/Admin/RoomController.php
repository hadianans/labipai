<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoomController extends Controller
{
    public function index()
    {
        $bookings = Room::with('user')->latest('start_time')->get();
        // We might want to pass users for the create/edit modal if admin assigns booking
        $users = User::all();
        return Inertia::render('Admin/Utility/Rooms/Index', [
            'bookings' => $bookings,
            'users' => $users
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'user_id' => 'nullable|exists:user,id', // Optional: assign to user
        ]);

        // Basic conflict check
        $conflicts = Room::where(function ($query) use ($request) {
            $query->whereBetween('start_time', [$request->start_time, $request->end_time])
                ->orWhereBetween('end_time', [$request->start_time, $request->end_time])
                ->orWhere(function ($q) use ($request) {
                    $q->where('start_time', '<', $request->start_time)
                        ->where('end_time', '>', $request->end_time);
                });
        })->count();

        if ($conflicts > 0) {
            return redirect()->back()->withErrors(['start_time' => 'Room is already booked for this time period.']);
        }

        Room::create($validated);

        return redirect()->back()->with('success', 'Room booking created successfully.');
    }

    public function update(Request $request, Room $room)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'user_id' => 'nullable|exists:user,id',
        ]);

        // Basic conflict check excluding self
        $conflicts = Room::where('id', '!=', $room->id)
            ->where(function ($query) use ($request) {
                $query->whereBetween('start_time', [$request->start_time, $request->end_time])
                    ->orWhereBetween('end_time', [$request->start_time, $request->end_time])
                    ->orWhere(function ($q) use ($request) {
                        $q->where('start_time', '<', $request->start_time)
                            ->where('end_time', '>', $request->end_time);
                    });
            })->count();

        if ($conflicts > 0) {
            return redirect()->back()->withErrors(['start_time' => 'Room is already booked for this time period.']);
        }

        $room->update($validated);

        return redirect()->back()->with('success', 'Room booking updated successfully.');
    }

    public function destroy(Room $room)
    {
        $room->delete();
        return redirect()->back()->with('success', 'Room booking deleted successfully.');
    }
}
