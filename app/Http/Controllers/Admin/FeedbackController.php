<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeedbackController extends Controller
{
    public function index()
    {
        $feedbacks = Feedback::with('user')->latest()->get();
        return Inertia::render('Admin/Utility/Feedbacks/Index', [
            'feedbacks' => $feedbacks
        ]);
    }

    public function destroy(Feedback $feedback)
    {
        $feedback->delete();
        return redirect()->back()->with('success', 'Feedback deleted successfully.');
    }
}
