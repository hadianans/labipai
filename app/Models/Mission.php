<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mission extends Model
{
    use HasFactory;

    protected $table = 'mission';

    protected $fillable = [
        'vision_id',
        'mission_point',
    ];

    public function vision()
    {
        return $this->belongsTo(Vision::class);
    }
}
