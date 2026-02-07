<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $table = 'contact';

    /**
     * Contact type constants
     */
    const TYPE_EMAIL = 'email';
    const TYPE_WHATSAPP = 'whatsapp';
    const TYPE_INSTAGRAM = 'instagram';
    const TYPE_TWITTER = 'twitter';
    const TYPE_YOUTUBE = 'youtube';
    const TYPE_TELEGRAM = 'telegram';

    protected $fillable = [
        'type',
        'detail',
    ];
}
