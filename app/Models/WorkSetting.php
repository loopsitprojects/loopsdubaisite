<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'tag',
        'headline_prefix',
        'headline_highlight',
        'headline_suffix',
        'subtitle',
        'badge_tag_1',
        'badge_tag_2',
        'services_cta_text',
        'services_cta_link',
    ];
}
