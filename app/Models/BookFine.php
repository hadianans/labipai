<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookFine extends Model
{
    use HasFactory;

    protected $table = 'book_fine';

    /**
     * Fine per day in IDR (excluding weekends)
     */
    const FINE_PER_DAY = 500;

    protected $fillable = [
        'lend_id',
        'amount',
        'is_paid',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'is_paid' => 'boolean',
    ];

    // ==================== HELPER METHODS ====================

    public function isPaid(): bool
    {
        return $this->is_paid;
    }

    // ==================== RELATIONSHIPS ====================

    public function lend(): BelongsTo
    {
        return $this->belongsTo(BookLend::class, 'lend_id');
    }

    // ==================== SCOPES ====================

    public function scopeUnpaid($query)
    {
        return $query->where('is_paid', false);
    }
}
