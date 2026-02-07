<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Calendar extends Model
{
    use HasFactory;

    protected $table = 'calendar';

    protected $fillable = [
        'title',
        'description',
        'start_time',
        'end_time',
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

    // ==================== SCOPES ====================

    public function scopeUpcoming($query)
    {
        return $query->where('start_time', '>', now())->orderBy('start_time');
    }

    public function scopeThisMonth($query)
    {
        return $query->whereMonth('start_time', now()->month)
            ->whereYear('start_time', now()->year);
    }
}
