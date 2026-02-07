<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory;

    protected $table = 'announcement';

    /**
     * Priority constants
     */
    const PRIORITY_LOW = '0';
    const PRIORITY_STANDARD = '1';
    const PRIORITY_IMPORTANT = '2';

    /**
     * Type constants
     */
    const TYPE_POPUP = '0';
    const TYPE_SECTION = '1';

    /**
     * Status constants
     */
    const STATUS_DRAFT = '0';
    const STATUS_PUBLISH = '1';

    protected $fillable = [
        'title',
        'content',
        'img_url',
        'action_url',
        'priority',
        'type',
        'status',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    // ==================== HELPER METHODS ====================

    public function isPublished(): bool
    {
        return $this->status === self::STATUS_PUBLISH;
    }

    public function isPopup(): bool
    {
        return $this->type === self::TYPE_POPUP;
    }

    public function isActive(): bool
    {
        $now = now();
        return $this->isPublished()
            && ($this->start_date === null || $now->gte($this->start_date))
            && ($this->end_date === null || $now->lte($this->end_date));
    }

    // ==================== SCOPES ====================

    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_PUBLISH)
            ->where(function ($q) {
                $q->whereNull('start_date')
                    ->orWhere('start_date', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('end_date')
                    ->orWhere('end_date', '>=', now());
            });
    }

    public function scopePopups($query)
    {
        return $query->where('type', self::TYPE_POPUP);
    }

    public function scopeSections($query)
    {
        return $query->where('type', self::TYPE_SECTION);
    }

    public function scopeImportant($query)
    {
        return $query->where('priority', self::PRIORITY_IMPORTANT);
    }
}
