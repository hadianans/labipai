<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory;

    protected $table = 'tag';

    protected $fillable = ['name'];

    public function galleryItems()
    {
        return $this->belongsToMany(Gallery::class, 'gallery_tag');
    }
}
