<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/


// Public Routes
Route::controller(App\Http\Controllers\PublicController::class)->group(function () {
    Route::get('/', 'index')->name('home');
    Route::get('/books', 'books')->name('public.books.index');
    Route::get('/books/{id}', 'show')->name('public.books.show');
    Route::get('/articles', 'articles')->name('public.articles.index');
    Route::get('/articles/{slug}', 'showArticle')->name('public.articles.show');
    Route::get('/gallery', 'gallery')->name('public.gallery.index');
    Route::get('/about', 'about')->name('public.about');
    Route::get('/contact', 'contact')->name('public.contact');
    Route::get('/courses', 'courses')->name('public.courses.index');
});


// Guest Routes
Route::middleware('guest')->group(function () {
    Route::get('register', [App\Http\Controllers\Auth\RegisteredUserController::class, 'create'])
        ->name('register');

    Route::post('register', [App\Http\Controllers\Auth\RegisteredUserController::class, 'store']);

    Route::get('login', [App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::post('login', [App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'store']);
});

// Authenticated User Routes
Route::middleware('auth')->group(function () {
    Route::post('logout', [App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');

    // Dashboard
    Route::get('/dashboard', [App\Http\Controllers\User\DashboardController::class, 'index'])->name('dashboard');

    // Profile
    Route::get('/profile', [App\Http\Controllers\User\ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [App\Http\Controllers\User\ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [App\Http\Controllers\User\ProfileController::class, 'destroy'])->name('profile.destroy');

    // My Books
    Route::get('/my-books', [App\Http\Controllers\User\MyBookController::class, 'index'])->name('my-books.index');

    // My Courses
    Route::get('/my-courses', [App\Http\Controllers\User\MyCourseController::class, 'index'])->name('my-courses.index');
    Route::get('/my-courses/{course}', [App\Http\Controllers\User\MyCourseController::class, 'show'])->name('my-courses.show');

    // Feedback
    Route::get('/feedback', [App\Http\Controllers\User\FeedbackController::class, 'index'])->name('feedback.index');
    Route::post('/feedback', [App\Http\Controllers\User\FeedbackController::class, 'store'])->name('feedback.store');

    // Book Actions
    Route::post('/books/{book}/favorite', [App\Http\Controllers\BookFavoriteController::class, 'store'])->name('books.favorite');
    Route::post('/books/{book}/review', [App\Http\Controllers\BookReviewController::class, 'store'])->name('books.review');
    Route::delete('/reviews/{review}', [App\Http\Controllers\BookReviewController::class, 'destroy'])->name('reviews.destroy');
    Route::post('/books/{book}/borrow', [App\Http\Controllers\BorrowRequestController::class, 'store'])->name('books.borrow');
    Route::post('/borrow-requests/{borrowRequest}/cancel', [App\Http\Controllers\BorrowRequestController::class, 'cancel'])->name('borrow-requests.cancel');
});

// Admin Routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');

    // Placeholders for now
    // Book Management
    Route::post('/books/check-duplicate', [App\Http\Controllers\Admin\BookController::class, 'checkDuplicate'])->name('books.check-duplicate');
    Route::resource('books', App\Http\Controllers\Admin\BookController::class)->except(['show']);
    Route::resource('genres', App\Http\Controllers\Admin\GenreController::class)->only(['store', 'update', 'destroy']);

    // Borrow Requests
    Route::get('/borrow-requests', [App\Http\Controllers\BorrowRequestController::class, 'index'])->name('borrow-requests.index');
    Route::post('/borrow-requests/{borrowRequest}/approve', [App\Http\Controllers\BorrowRequestController::class, 'approve'])->name('borrow-requests.approve');
    Route::post('/borrow-requests/{borrowRequest}/reject', [App\Http\Controllers\BorrowRequestController::class, 'reject'])->name('borrow-requests.reject');

    Route::middleware('superadmin')->group(function () {
        Route::resource('users', App\Http\Controllers\Admin\UserController::class)->except(['show']);
        Route::patch('/users/{user}/status', [App\Http\Controllers\Admin\UserController::class, 'updateStatus'])->name('users.update-status');
        Route::post('/users/{user}/approve', [App\Http\Controllers\Admin\UserController::class, 'approve'])->name('users.approve');
    });

    Route::get('/courses', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('courses.index');
    // Placeholder announcements route removed as resource route is added below
    // Organization Management
    Route::resource('administrators', App\Http\Controllers\Admin\AdministratorController::class)->except(['show', 'create', 'edit']);
    Route::resource('visions', App\Http\Controllers\Admin\VisionController::class)->except(['show', 'create', 'edit']);
    Route::post('/visions/{vision}/missions', [App\Http\Controllers\Admin\VisionController::class, 'storeMission'])->name('visions.missions.store');
    Route::put('/missions/{mission}', [App\Http\Controllers\Admin\VisionController::class, 'updateMission'])->name('missions.update');
    Route::delete('/missions/{mission}', [App\Http\Controllers\Admin\VisionController::class, 'destroyMission'])->name('missions.destroy');
    Route::resource('programs', App\Http\Controllers\Admin\ProgramController::class)->except(['show', 'create', 'edit']);

    // Content Management
    Route::resource('categories', App\Http\Controllers\Admin\CategoryController::class)->except(['show', 'create', 'edit']);
    Route::resource('tags', App\Http\Controllers\Admin\TagController::class)->except(['show', 'create', 'edit']);
    Route::post('articles/upload-image', [App\Http\Controllers\Admin\ArticleController::class, 'uploadImage'])->name('articles.uploadImage');
    Route::resource('articles', App\Http\Controllers\Admin\ArticleController::class); // Full resource for articles
    Route::resource('gallery', App\Http\Controllers\Admin\GalleryController::class)->except(['show', 'create', 'edit']);

    // Library Management
    Route::resource('lends', App\Http\Controllers\Admin\BookLendController::class);
    Route::resource('fines', App\Http\Controllers\Admin\BookFineController::class)->only(['index', 'update']);

    // Utility Management
    Route::resource('contacts', App\Http\Controllers\Admin\ContactController::class)->except(['show', 'create', 'edit']);
    Route::resource('announcements', App\Http\Controllers\Admin\AnnouncementController::class);
    Route::resource('rooms', App\Http\Controllers\Admin\RoomController::class)->except(['show', 'create', 'edit']);
    Route::resource('calendar', App\Http\Controllers\Admin\CalendarController::class)->except(['show', 'create', 'edit']);
    Route::resource('feedbacks', App\Http\Controllers\Admin\FeedbackController::class)->only(['index', 'destroy']);
});


