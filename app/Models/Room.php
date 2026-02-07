<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Room extends Model
{
    use HasFactory;

    protected $table = 'room';

    protected $fillable = [
        'title',
        'description',
        'start_time',
        'end_time',
        'user_id',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    // ==================== HELPER METHODS ====================

    public function isOngoing(): bool
    {
        $now = now();
        return $now->between($this->start_time, $this->end_time);
    }

    public function isUpcoming(): bool
    {
        return now()->lt($this->start_time);
    }

    // ==================== RELATIONSHIPS ====================

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // ==================== SCOPES ====================

    public function scopeUpcoming($query)
    {
        return $query->where('start_time', '>', now())->orderBy('start_time');
    }
}
