<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Book;
use App\Models\BookLend;
use App\Models\CourseEnrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_users' => User::count(),
                'total_books' => Book::count(),
                'active_loans' => BookLend::whereNull('returned_at')->count(),
                'course_enrollments' => CourseEnrollment::count(),
            ],
        ]);
    }
}
