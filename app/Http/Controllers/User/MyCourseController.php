<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MyCourseController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('User/MyCourses/Index', [
            'enrolled_courses' => $user->courseEnrollments()->with('course')->latest()->get(),
        ]);
    }

    public function show(Request $request, Course $course): Response
    {
        // Ensure user is enrolled
        // if (!$request->user()->courseEnrollments()->where('course_id', $course->id)->exists()) {
        //    abort(403);
        // }

        $course->load(['modules.contents']);

        return Inertia::render('User/MyCourses/Show', [
            'course' => $course,
            'progress' => $request->user()->courseEnrollments()->where('course_id', $course->id)->first()?->progress ?? 0,
        ]);
    }
}
