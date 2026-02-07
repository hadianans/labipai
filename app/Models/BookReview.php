<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookReview extends Model
{
    use HasFactory;

    protected $table = 'book_review';

    /**
     * Maximum star rating
     */
    const MAX_STARS = 5;

    protected $fillable = [
        'book_id',
        'user_id',
        'star',
        'review',
    ];

    protected $casts = [
        'star' => 'integer',
    ];

    // ==================== RELATIONSHIPS ====================

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
