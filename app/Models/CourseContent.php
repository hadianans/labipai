<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourseContent extends Model
{
    use HasFactory;

    protected $table = 'course_content';

    /**
     * Type constants
     */
    const TYPE_TEXT = '0';
    const TYPE_VIDEO = '1';

    protected $fillable = [
        'module_id',
        'type',
        'title',
        'content_url',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    // ==================== HELPER METHODS ====================

    public function isText(): bool
    {
        return $this->type === self::TYPE_TEXT;
    }

    public function isVideo(): bool
    {
        return $this->type === self::TYPE_VIDEO;
    }

    // ==================== RELATIONSHIPS ====================

    public function module(): BelongsTo
    {
        return $this->belongsTo(CourseModule::class, 'module_id');
    }

    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class, 'content_id');
    }
}
