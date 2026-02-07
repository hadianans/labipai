<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\CourseReview;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    /**
     * List all published courses
     * GET /api/courses
     */
    public function index(Request $request)
    {
        $query = Course::with(['modules.contents'])
            ->withCount(['enrollments', 'reviews'])
            ->withAvg('reviews', 'star');

        // Only show published for non-admin
        if (!$request->user()?->isAdmin()) {
            $query->published();
        }

        // Search
        if ($request->has('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        $courses = $query->orderBy('title')->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $courses,
        ]);
    }

    /**
     * Get course detail with modules and contents
     * GET /api/courses/{id}
     */
    public function show(Request $request, Course $course)
    {
        $course->load(['modules.contents', 'reviews.user']);
        $course->loadCount(['enrollments', 'reviews']);
        $course->loadAvg('reviews', 'star');

        // Check if user is enrolled
        $enrollment = null;
        if ($request->user()) {
            $enrollment = CourseEnrollment::where('course_id', $course->id)
                ->where('user_id', $request->user()->id)
                ->first();
        }

        return response()->json([
            'success' => true,
            'data' => [
                'course' => $course,
                'enrollment' => $enrollment,
            ],
        ]);
    }

    /**
     * Create new course (Admin)
     * POST /api/courses
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:0,1',
        ]);

        $course = Course::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Course berhasil dibuat',
            'data' => $course,
        ], 201);
    }

    /**
     * Update course (Admin)
     * PUT /api/courses/{id}
     */
    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:0,1',
        ]);

        $course->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Course berhasil diupdate',
            'data' => $course,
        ]);
    }

    /**
     * Delete course (Admin)
     * DELETE /api/courses/{id}
     */
    public function destroy(Course $course)
    {
        $course->delete();

        return response()->json([
            'success' => true,
            'message' => 'Course berhasil dihapus',
        ]);
    }

    /**
     * Enroll to a course
     * POST /api/courses/{id}/enroll
     */
    public function enroll(Request $request, Course $course)
    {
        $user = $request->user();

        // Check if already enrolled
        $existing = CourseEnrollment::where('course_id', $course->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah terdaftar di course ini',
            ], 400);
        }

        $enrollment = CourseEnrollment::create([
            'course_id' => $course->id,
            'user_id' => $user->id,
            'enrolled_at' => now(),
            'progress' => 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Berhasil mendaftar course',
            'data' => $enrollment,
        ], 201);
    }

    /**
     * Mark content as complete
     * POST /api/courses/content/{contentId}/complete
     */
    public function completeContent(Request $request, $contentId)
    {
        $user = $request->user();

        // Get or create activity log
        $activityLog = ActivityLog::firstOrCreate(
            [
                'user_id' => $user->id,
                'content_id' => $contentId,
            ],
            [
                'course_id' => $request->course_id,
                'status' => ActivityLog::STATUS_DONE,
                'accessed_at' => now(),
            ]
        );

        // Update if already exists
        if (!$activityLog->wasRecentlyCreated) {
            $activityLog->update([
                'status' => ActivityLog::STATUS_DONE,
                'accessed_at' => now(),
            ]);
        }

        // Update enrollment progress
        $this->updateEnrollmentProgress($user->id, $request->course_id);

        return response()->json([
            'success' => true,
            'message' => 'Konten berhasil diselesaikan',
            'data' => $activityLog,
        ]);
    }

    /**
     * Add or update course review
     * POST /api/courses/{id}/review
     */
    public function review(Request $request, Course $course)
    {
        $validated = $request->validate([
            'star' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string|max:500',
        ]);

        $user = $request->user();

        $review = CourseReview::updateOrCreate(
            ['course_id' => $course->id, 'user_id' => $user->id],
            $validated
        );

        return response()->json([
            'success' => true,
            'message' => 'Review berhasil disimpan',
            'data' => $review,
        ]);
    }

    /**
     * Get user's enrolled courses
     * GET /api/courses/my-courses
     */
    public function myCourses(Request $request)
    {
        $enrollments = $request->user()
            ->courseEnrollments()
            ->with('course.modules')
            ->orderByDesc('enrolled_at')
            ->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $enrollments,
        ]);
    }

    /**
     * Update enrollment progress based on completed contents
     */
    private function updateEnrollmentProgress($userId, $courseId): void
    {
        $course = Course::with('modules.contents')->find($courseId);

        $totalContents = $course->modules->sum(fn($m) => $m->contents->count());
        $completedContents = ActivityLog::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->done()
            ->count();

        $progress = $totalContents > 0
            ? round(($completedContents / $totalContents) * 100)
            : 0;

        CourseEnrollment::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->update(['progress' => $progress]);
    }
}
