<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PortfolioItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'category',
        'duration',
        'client',
        'film_subtitle',
        'description',
        'thumbnail_url',
        'video_url',
        'is_featured',
        'sort_order',
    ];
}
