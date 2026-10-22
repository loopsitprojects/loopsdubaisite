<?php

namespace App\Http\Controllers;

use App\Models\HeroSetting;
use App\Models\BehindTheFilmSetting;
use App\Models\AboutSetting;
use App\Models\TeamMember;
use App\Models\ServicesSetting;
use App\Models\ServiceItem;
use App\Models\Booking;
use App\Models\PortfolioItem;
use App\Models\ContactSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the landing page with Hero, Header, and Footer.
     */
    public function index()
    {
        $hero = HeroSetting::first() ?? HeroSetting::create([
            'badge_tag_1' => 'AI-generated',
            'badge_tag_2' => 'Human-directed',
            'headline_1' => 'AI-powered video.',
            'headline_2' => 'Human-led creative.',
            'subtitle' => 'Concept, script, direction and finishing by experienced creatives. Production accelerated by AI. Made for global brands.',
            'primary_cta_text' => 'Watch our work',
            'primary_cta_link' => '#work',
            'secondary_cta_text' => 'Book a creative call',
            'secondary_cta_link' => '#book',
            'reel_placeholder_text' => '[HERO REEL PLACEHOLDER - 4G-008 - MUTED AUTOPLAY]',
            'reel_video_url' => 'https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-city-street-in-the-rain-41133-large.mp4',
        ]);

        $behindTheFilm = BehindTheFilmSetting::first() ?? BehindTheFilmSetting::create([
            'tag' => 'BEHIND THE FILM',
            'title_line_1' => 'From human sketch to finished',
            'title_line_2' => 'film.',
            'concept_label' => 'Human concept',
            'concept_placeholder_text' => '[Storyboard / reference frames]',
            'concept_image_url' => null,
            'finish_label' => 'AI production, human finish',
            'finish_placeholder_text' => '[Final film frame]',
            'finish_image_url' => null,
        ]);

        $about = AboutSetting::first() ?? AboutSetting::create([
            'tag' => 'ABOUT',
            'headline' => 'Built for global brands.',
            'description' => "[Two to three sentences on the team's international experience, the markets you have worked in and why creative direction stays human.]",
        ]);

        $teamMembers = TeamMember::orderBy('sort_order')->get();

        $servicesSetting = ServicesSetting::first() ?? ServicesSetting::create([
            'tag' => 'OUR OTHER SERVICES',
            'headline_1' => 'Beyond video, we support the wider',
            'headline_2' => 'brand.',
        ]);

        $services = ServiceItem::orderBy('sort_order')->get();

        $portfolio = PortfolioItem::where('is_featured', true)->orderBy('sort_order')->get();
        $brandLogos = \App\Models\BrandLogo::where('is_active', true)->orderBy('sort_order')->get();

        return Inertia::render('Home', [
            'hero' => $hero,
            'behindTheFilm' => $behindTheFilm,
            'about' => $about,
            'teamMembers' => $teamMembers,
            'servicesSetting' => $servicesSetting,
            'services' => $services,
            'portfolio' => $portfolio,
            'brandLogos' => $brandLogos,
        ]);
    }

    /**
     * Display the dedicated Contact Us page.
     */
    public function contact()
    {
        $contactSetting = ContactSetting::first() ?? ContactSetting::create([
            'tag' => 'START A PROJECT',
            'headline_prefix' => 'Let’s make something',
            'headline_highlight' => 'extraordinary.',
            'subtitle' => 'Send a brief or book a 20–minute discovery call with our creative directors. We’ll explore how AI acceleration can elevate your brand video.',
            'form_title' => 'Book a creative call',
            'form_subtitle' => 'Fill in your details below and we’ll reach out to schedule our session.',
            'success_title' => 'Creative Brief Received!',
            'success_message' => 'Thank you for reaching out. One of our creative directors will review your brief and get back to you within 24 hours with next steps.',
        ]);

        return Inertia::render('Contact', [
            'contactSetting' => $contactSetting,
        ]);
    }

    /**
     * Store a new creative call booking from the client modal.
     */
    public function storeBooking(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'company' => 'nullable|string|max:255',
            'service_type' => 'nullable|string|max:255',
            'preferred_timeline' => 'nullable|string|max:255',
            'message' => 'nullable|string|max:2000',
        ]);

        Booking::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'company' => $validated['company'] ?? null,
            'service_type' => $validated['service_type'] ?? 'AI Video Production',
            'preferred_timeline' => $validated['preferred_timeline'] ?? 'Flexible',
            'message' => $validated['message'] ?? '',
            'status' => 'new',
        ]);

        return back()->with('success', 'Thank you! Your creative call request has been received. Our team will reach out within 24 hours.');
    }
}
