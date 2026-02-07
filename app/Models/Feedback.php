<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Feedback extends Model
{
    use HasFactory;

    protected $table = 'feedback';

    protected $fillable = [
        'user_id',
        'subject',
        'message',
        'is_anonymous',
    ];

    protected $casts = [
        'is_anonymous' => 'boolean',
    ];

    // ==================== RELATIONSHIPS ====================

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // ==================== SCOPES ====================

    public function scopeAnonymous($query)
    {
        return $query->where('is_anonymous', true);
    }
}
