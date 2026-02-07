<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FeedbackController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('User/Feedback/Index');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'is_anonymous' => 'boolean',
        ]);

        $request->user()->feedbacks()->create($request->all());

        return redirect()->back()->with('success', 'Feedback submitted successfully.');
    }
}
