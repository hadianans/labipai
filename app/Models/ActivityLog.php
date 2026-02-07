<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    use HasFactory;

    protected $table = 'activity_log';

    /**
     * Status constants
     */
    const STATUS_UNDONE = '0';
    const STATUS_DONE = '1';

    protected $fillable = [
        'user_id',
        'course_id',
        'content_id',
        'status',
        'accessed_at',
    ];

    protected $casts = [
        'accessed_at' => 'datetime',
    ];

    // ==================== HELPER METHODS ====================

    public function isDone(): bool
    {
        return $this->status === self::STATUS_DONE;
    }

    // ==================== RELATIONSHIPS ====================

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function content(): BelongsTo
    {
        return $this->belongsTo(CourseContent::class, 'content_id');
    }

    // ==================== SCOPES ====================

    public function scopeDone($query)
    {
        return $query->where('status', self::STATUS_DONE);
    }
}
