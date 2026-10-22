<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BehindTheFilmSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'tag',
        'title_line_1',
        'title_line_2',
        'concept_label',
        'concept_placeholder_text',
        'concept_image_url',
        'finish_label',
        'finish_placeholder_text',
        'finish_image_url',
    ];
}
