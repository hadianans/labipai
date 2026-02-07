<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GalleryTag extends Model
{
    use HasFactory;

    protected $table = 'gallery_tag';

    protected $fillable = [
        'gallery_id',
        'tag_id',
    ];

    // ==================== RELATIONSHIPS ====================

    public function gallery(): BelongsTo
    {
        return $this->belongsTo(Gallery::class);
    }

    public function tag(): BelongsTo
    {
        return $this->belongsTo(Tag::class);
    }
}
