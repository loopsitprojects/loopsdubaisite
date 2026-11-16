<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PortfolioItem extends Model
{
    use HasFactory;

    // How many films the Home page "Featured films" grid shows.
    public const FEATURED_LIMIT = 4;

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

    // New films are added to the Work page only; featuring one on the Home
    // page is a separate choice made in the admin panel.
    protected $attributes = [
        'is_featured' => false,
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'featured_order' => 'integer',
    ];
}
