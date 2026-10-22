<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanySetting extends Model
{
    protected $fillable = [
        'logo_type',
        'logo_text_prefix',
        'logo_text_suffix',
        'logo_image_url',
        'company_name',
        'email',
        'phone',
        'address',
        'working_hours',
        'tagline',
    ];
}
