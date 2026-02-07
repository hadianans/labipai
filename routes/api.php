<?php

use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\CategoryTagController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\GenreController;
use App\Http\Controllers\Api\OrganizationController;
use App\Http\Controllers\Api\UtilityController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group.
|
*/

// ========================================================================
// PUBLIC ROUTES (No Authentication Required)
// ========================================================================

// Authentication
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Books (Public)
Route::get('/books', [BookController::class, 'index']);
Route::get('/books/{book}', [BookController::class, 'show']);
Route::get('/genres', [GenreController::class, 'index']);

// Courses (Public)
Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{course}', [CourseController::class, 'show']);

// Content (Public)
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{slug}', [ArticleController::class, 'show']);
Route::get('/galleries', [GalleryController::class, 'index']);
Route::get('/galleries/hero', [GalleryController::class, 'heroImages']);
Route::get('/galleries/{gallery}', [GalleryController::class, 'show']);
Route::get('/announcements', [AnnouncementController::class, 'index']);
Route::get('/announcements/{announcement}', [AnnouncementController::class, 'show']);

// Categories & Tags (Public)
Route::get('/categories', [CategoryTagController::class, 'categories']);
Route::get('/tags', [CategoryTagController::class, 'tags']);

// Organization (Public)
Route::prefix('organization')->group(function () {
    Route::get('/vision', [OrganizationController::class, 'vision']);
    Route::get('/structure', [OrganizationController::class, 'structure']);
    Route::get('/departments', [OrganizationController::class, 'departments']);
    Route::get('/programs', [OrganizationController::class, 'programs']);
});

// Utility (Public)
Route::get('/calendar', [UtilityController::class, 'calendar']);
Route::get('/rooms', [UtilityController::class, 'rooms']);
Route::get('/contacts', [UtilityController::class, 'contacts']);

// Feedback (Public - can be anonymous)
Route::post('/feedback', [UtilityController::class, 'submitFeedback']);

// ========================================================================
// AUTHENTICATED USER ROUTES
// ========================================================================

Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
        Route::put('/password', [AuthController::class, 'changePassword']);
    });

    // Books - User Actions
    Route::prefix('books')->group(function () {
        Route::get('/my-loans', [BookController::class, 'myLoans']);
        Route::get('/my-favorites', [BookController::class, 'myFavorites']);
        Route::post('/{book}/borrow', [BookController::class, 'borrow']);
        Route::post('/{book}/return', [BookController::class, 'returnBook']);
        Route::post('/{book}/extend', [BookController::class, 'extend']);
        Route::post('/{book}/favorite', [BookController::class, 'toggleFavorite']);
        Route::post('/{book}/review', [BookController::class, 'review']);
    });

    // Courses - User Actions
    Route::prefix('courses')->group(function () {
        Route::get('/my-courses', [CourseController::class, 'myCourses']);
        Route::post('/{course}/enroll', [CourseController::class, 'enroll']);
        Route::post('/content/{contentId}/complete', [CourseController::class, 'completeContent']);
        Route::post('/{course}/review', [CourseController::class, 'review']);
    });

    // Room Booking
    Route::post('/rooms', [UtilityController::class, 'bookRoom']);
    Route::delete('/rooms/{room}', [UtilityController::class, 'cancelBooking']);

    // ========================================================================
    // ADMIN ROUTES (Admin & Super Admin Only)
    // ========================================================================

    Route::middleware('admin')->group(function () {
        // Books CRUD
        Route::post('/books', [BookController::class, 'store']);
        Route::put('/books/{book}', [BookController::class, 'update']);
        Route::delete('/books/{book}', [BookController::class, 'destroy']);

        // Genres CRUD
        Route::post('/genres', [GenreController::class, 'store']);
        Route::put('/genres/{genre}', [GenreController::class, 'update']);
        Route::delete('/genres/{genre}', [GenreController::class, 'destroy']);

        // Courses CRUD
        Route::post('/courses', [CourseController::class, 'store']);
        Route::put('/courses/{course}', [CourseController::class, 'update']);
        Route::delete('/courses/{course}', [CourseController::class, 'destroy']);

        // Articles CRUD
        Route::post('/articles', [ArticleController::class, 'store']);
        Route::put('/articles/{article}', [ArticleController::class, 'update']);
        Route::delete('/articles/{article}', [ArticleController::class, 'destroy']);

        // Galleries CRUD
        Route::post('/galleries', [GalleryController::class, 'store']);
        Route::put('/galleries/{gallery}', [GalleryController::class, 'update']);
        Route::delete('/galleries/{gallery}', [GalleryController::class, 'destroy']);

        // Announcements CRUD
        Route::post('/announcements', [AnnouncementController::class, 'store']);
        Route::put('/announcements/{announcement}', [AnnouncementController::class, 'update']);
        Route::delete('/announcements/{announcement}', [AnnouncementController::class, 'destroy']);

        // Categories CRUD
        Route::post('/categories', [CategoryTagController::class, 'storeCategory']);
        Route::put('/categories/{category}', [CategoryTagController::class, 'updateCategory']);
        Route::delete('/categories/{category}', [CategoryTagController::class, 'destroyCategory']);

        // Tags CRUD
        Route::post('/tags', [CategoryTagController::class, 'storeTag']);
        Route::put('/tags/{tag}', [CategoryTagController::class, 'updateTag']);
        Route::delete('/tags/{tag}', [CategoryTagController::class, 'destroyTag']);

        // Organization Management
        Route::prefix('organization')->group(function () {
            Route::post('/vision', [OrganizationController::class, 'storeVision']);

            Route::post('/administrators', [OrganizationController::class, 'storeAdministrator']);
            Route::put('/administrators/{administrator}', [OrganizationController::class, 'updateAdministrator']);
            Route::delete('/administrators/{administrator}', [OrganizationController::class, 'destroyAdministrator']);

            Route::post('/departments', [OrganizationController::class, 'storeDepartment']);
            Route::put('/departments/{department}', [OrganizationController::class, 'updateDepartment']);
            Route::delete('/departments/{department}', [OrganizationController::class, 'destroyDepartment']);

            Route::post('/programs', [OrganizationController::class, 'storeProgram']);
            Route::put('/programs/{program}', [OrganizationController::class, 'updateProgram']);
            Route::delete('/programs/{program}', [OrganizationController::class, 'destroyProgram']);
        });

        // Calendar CRUD
        Route::post('/calendar', [UtilityController::class, 'storeCalendarEvent']);
        Route::put('/calendar/{calendar}', [UtilityController::class, 'updateCalendarEvent']);
        Route::delete('/calendar/{calendar}', [UtilityController::class, 'destroyCalendarEvent']);

        // Contacts CRUD
        Route::post('/contacts', [UtilityController::class, 'storeContact']);
        Route::put('/contacts/{contact}', [UtilityController::class, 'updateContact']);
        Route::delete('/contacts/{contact}', [UtilityController::class, 'destroyContact']);

        // Feedback List (Admin can view all)
        Route::get('/feedback', [UtilityController::class, 'feedbackList']);
    });
});
