<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $table = 'article';

    protected $fillable = [
        'slug',
        'title',
        'excerpt',
        'content',
        'author',
        'status',
        'img_url', // Adding this for cover image as discussed
    ];

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'article_category');
    }

    public function assets()
    {
        return $this->hasMany(ArticleAsset::class);
    }

    public function scopePublished($query)
    {
        return $query->where('status', '1');
    }
}
