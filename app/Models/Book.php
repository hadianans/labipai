<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\BorrowRequest;

class Book extends Model
{
    use HasFactory;

    protected $table = 'book';

    /**
     * Type constants
     */
    const TYPE_RESTRICTED = '0';
    const TYPE_OPEN_ACCESS = '1';

    /**
     * Status constants
     */
    const STATUS_AVAILABLE = '0';
    const STATUS_BORROWED = '1';
    const STATUS_LOST = '2';

    /**
     * Type show
     */
    const TYPE_HIDE = '0';
    const TYPE_SHOW = '1';

    protected $fillable = [
        'id',
        'title',
        'author',
        'editor',
        'translator',
        'publisher',
        'year',
        'language',
        'page',
        'volume',
        'synopsis',
        'isbn',
        'type',
        'status',
        'img_url',
        'is_show',
    ];

    protected $casts = [
        'year' => 'integer',
        'page' => 'integer',
        'volume' => 'integer',
        'is_show' => 'boolean',
    ];

    // ==================== HELPER METHODS ====================

    public function isRestricted(): bool
    {
        return $this->type === self::TYPE_RESTRICTED;
    }

    public function isAvailable(): bool
    {
        return $this->status === self::STATUS_AVAILABLE;
    }

    public function isBorrowed(): bool
    {
        return $this->status === self::STATUS_BORROWED;
    }

    public function isLost(): bool
    {
        return $this->status === self::STATUS_LOST;
    }

    public function isShow(): bool
    {
        return $this->is_show === self::TYPE_SHOW;
    }

    public function isHide(): bool
    {
        return $this->is_show === self::TYPE_HIDE;
    }

    // ==================== RELATIONSHIPS ====================

    public function copies(): HasMany
    {
        return $this->hasMany(BookCopy::class);
    }

    public function genres(): BelongsToMany
    {
        return $this->belongsToMany(Genre::class, 'book_genre')
            ->withTimestamps();
    }

    public function lends(): HasMany
    {
        return $this->hasMany(BookLend::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(BookFavorite::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(BookReview::class);
    }

    public function borrowRequests(): HasMany
    {
        return $this->hasMany(BorrowRequest::class);
    }

    // ==================== SCOPES ====================

    public function scopeAvailable($query)
    {
        return $query->where('status', self::STATUS_AVAILABLE)
            ->whereDoesntHave('borrowRequests', function ($q) {
                $q->where('status', BorrowRequest::STATUS_PENDING)
                    ->where('expires_at', '>', now());
            });
    }

    public function scopeOpenAccess($query)
    {
        return $query->where('type', self::TYPE_OPEN_ACCESS);
    }
}
