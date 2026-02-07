<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the user dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('User/Dashboard', [
            'stats' => [
                'books_borrowed' => $user->bookLends()->whereNull('returned_at')->count(),
                'courses_enrolled' => $user->courseEnrollments()->count(),
                'books_favorited' => $user->bookFavorites()->count(),
                // Add more stats as needed
            ],
            // 'recent_activities' => $user->activityLogs()->latest()->take(5)->get(), // If we want to show recent activity
        ]);
    }
}
