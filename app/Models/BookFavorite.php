<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookFavorite extends Model
{
    use HasFactory;

    protected $table = 'book_favorite';

    protected $fillable = [
        'book_id',
        'user_id',
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
