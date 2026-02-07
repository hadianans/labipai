<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArticleAsset extends Model
{
    use HasFactory;

    protected $table = 'article_asset';

    protected $fillable = [
        'article_id',
        'img_url',
        'alt_text',
    ];

    public function article()
    {
        return $this->belongsTo(Article::class);
    }
}
