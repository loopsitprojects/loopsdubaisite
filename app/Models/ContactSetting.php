<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'tag',
        'headline_prefix',
        'headline_highlight',
        'subtitle',
        'form_title',
        'form_subtitle',
        'success_title',
        'success_message',
    ];
}
