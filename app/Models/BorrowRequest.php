<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BorrowRequest extends Model
{
    use HasFactory;

    protected $table = 'borrow_request';

    protected $fillable = [
        'book_id',
        'user_id',
        'status',
        'approved_by',
        'approved_at',
        'expires_at',
        'admin_notes',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    const STATUS_PENDING = 'pending';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';
    const STATUS_CANCELLED = 'cancelled';
    const STATUS_EXPIRED = 'expired';

    // ==================== RELATIONSHIPS ====================

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    // ==================== SCOPES ====================

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeActive($query)
    {
        // pending or approved (though approved should become BookLend ideally, but let's keep it simple for now)
        return $query->whereIn('status', [self::STATUS_PENDING, self::STATUS_APPROVED]);
    }
}
