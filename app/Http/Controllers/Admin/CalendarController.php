<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Calendar;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CalendarController extends Controller
{
    public function index()
    {
        $events = Calendar::latest('start_time')->get();
        return Inertia::render('Admin/Utility/Calendar/Index', [
            'events' => $events
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
        ]);

        Calendar::create($validated);

        return redirect()->back()->with('success', 'Event created successfully.');
    }

    public function update(Request $request, Calendar $calendar)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
        ]);

        $calendar->update($validated);

        return redirect()->back()->with('success', 'Event updated successfully.');
    }

    public function destroy(Calendar $calendar)
    {
        $calendar->delete();
        return redirect()->back()->with('success', 'Event deleted successfully.');
    }
}
