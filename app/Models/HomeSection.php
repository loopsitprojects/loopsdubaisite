<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomeSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'section_key',
        'name',
        'description',
        'is_visible',
        'sort_order',
    ];

    protected $casts = [
        'is_visible' => 'boolean',
        'sort_order' => 'integer',
    ];

    public const DEFAULTS = [
        [
            'section_key' => 'hero',
            'name' => 'Hero Section',
            'description' => 'Main headline, subtext, badges and showreel video preview.',
            'is_visible' => true,
            'sort_order' => 1,
        ],
        [
            'section_key' => 'brands',
            'name' => 'Client Brands (Logo Strip)',
            'description' => 'Infinite scrolling ticker of trusted brand partner logos.',
            'is_visible' => true,
            'sort_order' => 2,
        ],
        [
            'section_key' => 'featured_films',
            'name' => 'Featured Films',
            'description' => 'Curated portfolio showcase grid and full video reel modal.',
            'is_visible' => true,
            'sort_order' => 3,
        ],
        [
            'section_key' => 'how_it_works',
            'name' => 'How It Works',
            'description' => 'Three-step process: Human concept, AI acceleration, Human finishing.',
            'is_visible' => true,
            'sort_order' => 4,
        ],
        [
            'section_key' => 'behind_the_film',
            'name' => 'Behind The Film',
            'description' => 'Interactive storyboard sketch vs final AI film comparison.',
            'is_visible' => true,
            'sort_order' => 5,
        ],
        [
            'section_key' => 'about',
            'name' => 'About & Leadership Team',
            'description' => 'Agency global story, narrative paragraph, and leadership team photo cards.',
            'is_visible' => true,
            'sort_order' => 6,
        ],
        [
            'section_key' => 'global_offices',
            'name' => 'Global Offices & Map',
            'description' => 'Interactive 360° global network canvas map and regional office cards.',
            'is_visible' => true,
            'sort_order' => 7,
        ],
        [
            'section_key' => 'services',
            'name' => 'Our Other Services',
            'description' => 'Brand strategy, digital performance, and experiential event cards.',
            'is_visible' => true,
            'sort_order' => 8,
        ],
        [
            'section_key' => 'cta',
            'name' => 'CTA Bottom Banner',
            'description' => 'High-contrast bottom banner inviting briefs and creative call booking.',
            'is_visible' => true,
            'sort_order' => 9,
        ],
    ];

    /**
     * Get associative key-value map of [section_key => boolean is_visible].
     */
    public static function getVisibilityMap(): array
    {
        try {
            $items = static::pluck('is_visible', 'section_key')->toArray();
            if (empty($items)) {
                $now = now();
                foreach (self::DEFAULTS as $d) {
                    static::create($d);
                }
                $items = static::pluck('is_visible', 'section_key')->toArray();
            }

            // Fill in any defaults not yet in the DB
            foreach (self::DEFAULTS as $d) {
                if (!array_key_exists($d['section_key'], $items)) {
                    $items[$d['section_key']] = (bool) $d['is_visible'];
                }
            }

            return $items;
        } catch (\Throwable $e) {
            // Failsafe fallback
            $fallback = [];
            foreach (self::DEFAULTS as $d) {
                $fallback[$d['section_key']] = (bool) $d['is_visible'];
            }
            return $fallback;
        }
    }
}
