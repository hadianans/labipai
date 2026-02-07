<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The table associated with the model.
     */
    protected $table = 'user';

    /**
     * Role constants
     */
    const ROLE_SUPER_ADMIN = '0';
    const ROLE_ADMIN = '1';
    const ROLE_USER = '2';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'password',
        'role',
        'status',
        'phone',
        'img_url',
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'password' => 'hashed',
    ];

    // ==================== HELPER METHODS ====================

    public function isSuperAdmin(): bool
    {
        return $this->role === self::ROLE_SUPER_ADMIN;
    }

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN || $this->role === self::ROLE_SUPER_ADMIN;
    }

    public function isUser(): bool
    {
        return $this->role === self::ROLE_USER;
    }

    // ==================== RELATIONSHIPS ====================

    public function bookLends(): HasMany
    {
        return $this->hasMany(BookLend::class);
    }

    public function bookFavorites(): HasMany
    {
        return $this->hasMany(BookFavorite::class);
    }

    public function bookReviews(): HasMany
    {
        return $this->hasMany(BookReview::class);
    }

    public function courseEnrollments(): HasMany
    {
        return $this->hasMany(CourseEnrollment::class);
    }

    public function courseReviews(): HasMany
    {
        return $this->hasMany(CourseReview::class);
    }

    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }

    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class);
    }

    public function feedbacks(): HasMany
    {
        return $this->hasMany(Feedback::class);
    }

    public function borrowRequests(): HasMany
    {
        return $this->hasMany(BorrowRequest::class);
    }
}
