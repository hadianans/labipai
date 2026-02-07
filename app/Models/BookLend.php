<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class BookLend extends Model
{
    use HasFactory;

    protected $table = 'book_lend';

    /**
     * Maximum allowed extensions
     */
    const MAX_EXTENSIONS = 2;

    /**
     * Default lending period in days
     */
    const LENDING_PERIOD_DAYS = 7;

    protected $fillable = [
        'book_id',
        'user_id',
        'due_date',
        'returned_at',
        'extension_count',
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'returned_at' => 'datetime',
        'extension_count' => 'integer',
    ];

    // ==================== HELPER METHODS ====================

    public function isReturned(): bool
    {
        return $this->returned_at !== null;
    }

    public function isOverdue(): bool
    {
        return !$this->isReturned() && $this->due_date && $this->due_date->isPast();
    }

    public function canExtend(): bool
    {
        return $this->extension_count < self::MAX_EXTENSIONS && !$this->isReturned();
    }

    // ==================== RELATIONSHIPS ====================

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function fine(): HasOne
    {
        return $this->hasOne(BookFine::class, 'lend_id');
    }

    // ==================== SCOPES ====================

    public function scopeActive($query)
    {
        return $query->whereNull('returned_at');
    }

    public function scopeOverdue($query)
    {
        return $query->whereNull('returned_at')
            ->where('due_date', '<', now());
    }
}
