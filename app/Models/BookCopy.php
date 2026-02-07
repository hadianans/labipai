<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookCopy extends Model
{
    use HasFactory;

    protected $table = 'book_copy';

    protected $fillable = [
        'book_id',
        'duplicate_code',
    ];

    // ==================== RELATIONSHIPS ====================

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }
}
