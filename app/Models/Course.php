<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    use HasFactory;

    protected $table = 'course';

    /**
     * Status constants
     */
    const STATUS_DRAFT = '0';
    const STATUS_PUBLISHED = '1';

    const LEVEL_BEGINNER = '0';
    const LEVEL_INTERMEDIATE = '1';
    const LEVEL_ADVANCED = '2';
    const LEVEL_EXPERT = '3';

    protected $fillable = [
        'title',
        'description',
        'level',
        'status',
    ];

    // ==================== HELPER METHODS ====================

    public function isPublished(): bool
    {
        return $this->status === self::STATUS_PUBLISHED;
    }

    // ==================== RELATIONSHIPS ====================

    public function modules(): HasMany
    {
        return $this->hasMany(CourseModule::class)->orderBy('order');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(CourseEnrollment::class);
    }

    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(CourseReview::class);
    }

    // ==================== SCOPES ====================

    public function scopePublished($query)
    {
        return $query->where('status', self::STATUS_PUBLISHED);
    }
}
