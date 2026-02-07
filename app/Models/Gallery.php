<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    use HasFactory;

    protected $table = 'gallery';

    protected $fillable = [
        'title',
        'description',
        'alt_text',
        'img_url',
        'is_hero'
    ];

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'gallery_tag');
    }
}
