<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArticleCategory extends Model
{
    use HasFactory;

    protected $table = 'article_category';

    protected $fillable = [
        'article_id',
        'category_id',
    ];

    // ==================== RELATIONSHIPS ====================

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
