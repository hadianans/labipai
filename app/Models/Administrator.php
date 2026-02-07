<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Administrator extends Model
{
    use HasFactory;

    protected $table = 'administrator';

    protected $fillable = [
        'email',
        'name',
        'position',
        'year',
        'is_active',
        'is_chief',
        'phone',
        'description',
        'img_url',
    ];
}
