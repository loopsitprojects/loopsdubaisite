<?php

namespace App\Http\Controllers;

use App\Models\PortfolioItem;
use App\Models\BrandLogo;
use App\Models\WorkSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkController extends Controller
{
    /**
     * Display the 'Our Work' page with AI Creative World hero.
     */
    public function index()
    {
        $portfolio = PortfolioItem::orderBy('sort_order')->get();
        $brandLogos = BrandLogo::where('is_active', true)->orderBy('sort_order')->get();
        $workSetting = WorkSetting::first() ?? WorkSetting::create([
            'tag' => 'OUR WORK',
            'headline_prefix' => 'Our',
            'headline_highlight' => 'AI creative',
            'headline_suffix' => 'world.',
            'subtitle' => 'Choose a sector. Every film is AI-generated and human-directed.',
            'badge_tag_1' => 'AI-generated',
            'badge_tag_2' => 'Human-directed',
            'services_cta_text' => 'Our other services',
            'services_cta_link' => '/#services',
        ]);

        return Inertia::render('Work', [
            'portfolio' => $portfolio,
            'brandLogos' => $brandLogos,
            'workSetting' => $workSetting,
        ]);
    }
}
