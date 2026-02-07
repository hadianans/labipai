<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseEnrollment extends Model
{
    use HasFactory;

    protected $table = 'course_enrollment';

    protected $fillable = [
        'course_id',
        'user_id',
        'enrolled_at',
        'progress',
    ];

    protected $casts = [
        'enrolled_at' => 'datetime',
        'progress' => 'integer',
    ];

    // ==================== HELPER METHODS ====================

    public function isCompleted(): bool
    {
        return $this->progress >= 100;
    }

    // ==================== RELATIONSHIPS ====================

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
