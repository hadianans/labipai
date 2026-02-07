<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vision extends Model
{
    use HasFactory;

    protected $table = 'vision';

    protected $fillable = [
        'vision_point',
        'year',
        'is_active',
    ];

    public function missions()
    {
        return $this->hasMany(Mission::class);
    }
}
