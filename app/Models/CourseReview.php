<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseReview extends Model
{
    use HasFactory;

    protected $table = 'course_review';

    /**
     * Maximum star rating
     */
    const MAX_STARS = 5;

    protected $fillable = [
        'course_id',
        'user_id',
        'star',
        'review',
    ];

    protected $casts = [
        'star' => 'integer',
    ];

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
