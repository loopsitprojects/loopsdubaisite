<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HeroSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'badge_tag_1',
        'badge_tag_2',
        'headline_1',
        'headline_2',
        'subtitle',
        'primary_cta_text',
        'primary_cta_link',
        'secondary_cta_text',
        'secondary_cta_link',
        'reel_placeholder_text',
        'reel_video_url',
    ];
}
