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
use App\Models\CompanySetting;
use App\Models\WorkSetting;
use App\Models\ContactSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Display the Admin Dashboard with CMS and Leads inbox.
     */
    public function dashboard(Request $request)
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

        $company = CompanySetting::first() ?? CompanySetting::create([
            'logo_type' => 'text',
            'logo_text_prefix' => 'Loops',
            'logo_text_suffix' => 'Integrated',
            'logo_image_url' => null,
            'company_name' => 'Loops Integrated',
            'email' => 'hello@loopsdubai.com',
            'phone' => '+971 4 000 0000',
            'address' => 'Dubai Media City, Building 4, Dubai, UAE',
            'working_hours' => 'Mon — Fri, 9:00 AM — 6:00 PM GST',
            'tagline' => 'AI video production with human creative direction.',
        ]);

        $bookings = Booking::orderBy('created_at', 'desc')->get();
        $portfolio = PortfolioItem::orderBy('sort_order')->get();
        $brandLogos = \App\Models\BrandLogo::orderBy('sort_order')->get();

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

        $stats = [
            'total_bookings' => Booking::count(),
            'new_bookings' => Booking::where('status', 'new')->count(),
            'scheduled_bookings' => Booking::where('status', 'scheduled')->count(),
            'completed_bookings' => Booking::where('status', 'completed')->count(),
            'total_films' => PortfolioItem::count(),
            'total_brands' => \App\Models\BrandLogo::count(),
            'total_team' => TeamMember::count(),
            'total_services' => ServiceItem::count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'hero' => $hero,
            'behindTheFilm' => $behindTheFilm,
            'about' => $about,
            'teamMembers' => $teamMembers,
            'servicesSetting' => $servicesSetting,
            'services' => $services,
            'company' => $company,
            'bookings' => $bookings,
            'portfolio' => $portfolio,
            'brandLogos' => $brandLogos,
            'workSetting' => $workSetting,
            'contactSetting' => $contactSetting,
            'stats' => $stats,
        ]);
    }

    /**
     * Update a brand logo item.
     */
    public function updateBrandLogo(Request $request, \App\Models\BrandLogo $brandLogo)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo_url' => 'nullable|string|max:500',
            'sort_order' => 'nullable|integer',
        ]);

        $brandLogo->update($validated);

        return back()->with('success', 'Brand logo updated successfully.');
    }

    /**
     * Update the Hero section CMS settings.
     */
    public function updateHero(Request $request)
    {
        $validated = $request->validate([
            'badge_tag_1' => 'required|string|max:100',
            'badge_tag_2' => 'required|string|max:100',
            'headline_1' => 'required|string|max:255',
            'headline_2' => 'required|string|max:255',
            'subtitle' => 'required|string|max:1000',
            'primary_cta_text' => 'required|string|max:100',
            'primary_cta_link' => 'nullable|string|max:255',
            'secondary_cta_text' => 'required|string|max:100',
            'secondary_cta_link' => 'nullable|string|max:255',
            'reel_placeholder_text' => 'nullable|string|max:255',
            'reel_video_url' => 'nullable|string|max:500',
        ]);

        $hero = HeroSetting::first();
        if ($hero) {
            $hero->update($validated);
        } else {
            HeroSetting::create($validated);
        }

        return back()->with('success', 'Hero section content updated successfully!');
    }

    /**
     * Update booking status or notes.
     */
    public function updateBooking(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'status' => 'required|in:new,contacted,scheduled,completed',
            'admin_notes' => 'nullable|string|max:2000',
        ]);

        $booking->update($validated);

        return back()->with('success', 'Booking status updated.');
    }

    /**
     * Delete a booking.
     */
    public function deleteBooking(Booking $booking)
    {
        $booking->delete();

        return back()->with('success', 'Booking removed successfully.');
    }

    /**
     * Store a new portfolio / curated film item.
     */
    public function storePortfolio(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:100',
            'duration' => 'nullable|string|max:50',
            'film_subtitle' => 'nullable|string|max:500',
            'thumbnail_url' => 'nullable|string|max:500',
            'thumbnail_file' => 'nullable|file|mimes:png,jpg,jpeg,webp,gif|max:10240',
            'video_url' => 'nullable|string|max:500',
            'sort_order' => 'nullable|integer',
        ]);

        if (empty($validated['category']) || $validated['category'] === 'None') {
            $validated['category'] = 'Real estate';
        }

        if (empty($validated['duration'])) {
            $validated['duration'] = '[0:45]';
        }

        if ($request->hasFile('thumbnail_file')) {
            $file = $request->file('thumbnail_file');
            $uploadDir = public_path('uploads/portfolio');
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            $extension = $file->getClientOriginalExtension() ?: 'jpg';
            $filename = 'film_thumb_' . time() . '_' . \Illuminate\Support\Str::random(6) . '.' . $extension;
            $file->move($uploadDir, $filename);
            $validated['thumbnail_url'] = '/uploads/portfolio/' . $filename;
        } elseif (!empty($validated['video_url']) && preg_match('/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i', $validated['video_url'], $matches)) {
            $ytId = $matches[1];
            $currentThumb = trim($validated['thumbnail_url'] ?? '');
            if (empty($currentThumb) 
                || str_contains($currentThumb, 'unsplash.com') 
                || str_contains($currentThumb, 'img.youtube.com')
                || !str_starts_with($currentThumb, '/uploads/')) {
                $validated['thumbnail_url'] = 'https://img.youtube.com/vi/' . $ytId . '/maxresdefault.jpg';
            }
        }

        unset($validated['thumbnail_file']);

        if (empty($validated['video_url'])) {
            $validated['video_url'] = 'https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-city-street-in-the-rain-41133-large.mp4';
        }

        PortfolioItem::create($validated);

        return back()->with('success', 'New film added to portfolio successfully.');
    }

    /**
     * Update an existing portfolio / curated film item.
     */
    public function updatePortfolio(Request $request, PortfolioItem $portfolioItem)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:100',
            'duration' => 'nullable|string|max:50',
            'film_subtitle' => 'nullable|string|max:500',
            'thumbnail_url' => 'nullable|string|max:500',
            'thumbnail_file' => 'nullable|file|mimes:png,jpg,jpeg,webp,gif|max:10240',
            'video_url' => 'nullable|string|max:500',
            'sort_order' => 'nullable|integer',
        ]);

        if (empty($validated['category']) || $validated['category'] === 'None') {
            $validated['category'] = 'Real estate';
        }

        if ($request->hasFile('thumbnail_file')) {
            $file = $request->file('thumbnail_file');
            $uploadDir = public_path('uploads/portfolio');
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            $extension = $file->getClientOriginalExtension() ?: 'jpg';
            $filename = 'film_thumb_' . time() . '_' . \Illuminate\Support\Str::random(6) . '.' . $extension;
            $file->move($uploadDir, $filename);
            $validated['thumbnail_url'] = '/uploads/portfolio/' . $filename;
        } elseif (!empty($validated['video_url']) && preg_match('/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i', $validated['video_url'], $matches)) {
            $ytId = $matches[1];
            $currentThumb = trim($validated['thumbnail_url'] ?? '');
            if (empty($currentThumb) 
                || str_contains($currentThumb, 'unsplash.com') 
                || str_contains($currentThumb, 'img.youtube.com')
                || !str_starts_with($currentThumb, '/uploads/')) {
                $validated['thumbnail_url'] = 'https://img.youtube.com/vi/' . $ytId . '/maxresdefault.jpg';
            }
        }

        unset($validated['thumbnail_file']);

        $portfolioItem->update($validated);

        return back()->with('success', 'Film updated successfully.');
    }

    /**
     * Delete a portfolio item.
     */
    public function deletePortfolio(PortfolioItem $portfolioItem)
    {
        $portfolioItem->delete();

        return back()->with('success', 'Film removed from portfolio.');
    }

    /**
     * Store a new brand logo.
     */
    public function storeBrandLogo(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo_url' => 'nullable|string|max:500',
            'sort_order' => 'nullable|integer',
        ]);

        \App\Models\BrandLogo::create($validated);

        return back()->with('success', 'Brand logo added successfully.');
    }

    /**
     * Delete a brand logo.
     */
    public function deleteBrandLogo(\App\Models\BrandLogo $brandLogo)
    {
        $brandLogo->delete();

        return back()->with('success', 'Brand logo removed.');
    }

    /**
     * Update Company details, logo, and branding.
     */
    public function updateCompanySettings(Request $request)
    {
        $validated = $request->validate([
            'logo_type' => 'nullable|string|in:text,image',
            'logo_text_prefix' => 'nullable|string|max:100',
            'logo_text_suffix' => 'nullable|string|max:100',
            'logo_image_url' => 'nullable|string|max:500',
            'logo_file' => 'nullable|file|mimes:png,jpg,jpeg,svg,webp,gif|max:5120',
            'company_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:100',
            'address' => 'required|string|max:500',
            'working_hours' => 'required|string|max:255',
            'tagline' => 'nullable|string|max:500',
        ]);

        if ($request->hasFile('logo_file')) {
            $file = $request->file('logo_file');
            $uploadDir = public_path('uploads/logos');
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            $extension = $file->getClientOriginalExtension() ?: 'png';
            $filename = 'logo_' . time() . '_' . \Illuminate\Support\Str::random(6) . '.' . $extension;
            $file->move($uploadDir, $filename);
            $validated['logo_image_url'] = '/uploads/logos/' . $filename;
            $validated['logo_type'] = 'image';
        }

        unset($validated['logo_file']);

        $company = CompanySetting::first();
        if ($company) {
            $company->update($validated);
        } else {
            CompanySetting::create($validated);
        }

        return back()->with('success', 'Company details and logo updated successfully!');
    }

    /**
     * Update Behind The Film CMS settings.
     */
    public function updateBehindTheFilm(Request $request)
    {
        $validated = $request->validate([
            'tag' => 'required|string|max:100',
            'title_line_1' => 'required|string|max:255',
            'title_line_2' => 'nullable|string|max:255',
            'concept_label' => 'required|string|max:100',
            'concept_placeholder_text' => 'nullable|string|max:255',
            'concept_image_url' => 'nullable|string|max:500',
            'concept_file' => 'nullable|file|mimes:png,jpg,jpeg,webp,gif|max:10240',
            'finish_label' => 'required|string|max:100',
            'finish_placeholder_text' => 'nullable|string|max:255',
            'finish_image_url' => 'nullable|string|max:500',
            'finish_file' => 'nullable|file|mimes:png,jpg,jpeg,webp,gif|max:10240',
        ]);

        $uploadDir = public_path('uploads/behind_the_film');
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        if ($request->hasFile('concept_file')) {
            $file = $request->file('concept_file');
            $extension = $file->getClientOriginalExtension() ?: 'png';
            $filename = 'concept_' . time() . '_' . \Illuminate\Support\Str::random(6) . '.' . $extension;
            $file->move($uploadDir, $filename);
            $validated['concept_image_url'] = '/uploads/behind_the_film/' . $filename;
        }

        if ($request->hasFile('finish_file')) {
            $file = $request->file('finish_file');
            $extension = $file->getClientOriginalExtension() ?: 'png';
            $filename = 'finish_' . time() . '_' . \Illuminate\Support\Str::random(6) . '.' . $extension;
            $file->move($uploadDir, $filename);
            $validated['finish_image_url'] = '/uploads/behind_the_film/' . $filename;
        }

        unset($validated['concept_file'], $validated['finish_file']);

        $setting = BehindTheFilmSetting::first();
        if ($setting) {
            $setting->update($validated);
        } else {
            BehindTheFilmSetting::create($validated);
        }

        return back()->with('success', 'Behind The Film section updated successfully!');
    }

    /**
     * Update About section CMS settings.
     */
    public function updateAbout(Request $request)
    {
        $validated = $request->validate([
            'tag' => 'required|string|max:100',
            'headline' => 'required|string|max:255',
            'description' => 'required|string|max:2000',
        ]);

        $about = AboutSetting::first();
        if ($about) {
            $about->update($validated);
        } else {
            AboutSetting::create($validated);
        }

        return back()->with('success', 'About section updated successfully!');
    }

    /**
     * Store a new team member.
     */
    public function storeTeamMember(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'photo_url' => 'nullable|string|max:500',
            'photo_file' => 'nullable|file|mimes:png,jpg,jpeg,webp,gif|max:10240',
            'sort_order' => 'nullable|integer',
        ]);

        if ($request->hasFile('photo_file')) {
            $file = $request->file('photo_file');
            $uploadDir = public_path('uploads/team');
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            $extension = $file->getClientOriginalExtension() ?: 'png';
            $filename = 'team_' . time() . '_' . \Illuminate\Support\Str::random(6) . '.' . $extension;
            $file->move($uploadDir, $filename);
            $validated['photo_url'] = '/uploads/team/' . $filename;
        }

        unset($validated['photo_file']);

        if (empty($validated['sort_order'])) {
            $validated['sort_order'] = TeamMember::count() + 1;
        }

        TeamMember::create($validated);

        return back()->with('success', 'Team member added successfully!');
    }

    /**
     * Update an existing team member.
     */
    public function updateTeamMember(Request $request, TeamMember $teamMember)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'photo_url' => 'nullable|string|max:500',
            'photo_file' => 'nullable|file|mimes:png,jpg,jpeg,webp,gif|max:10240',
            'sort_order' => 'nullable|integer',
        ]);

        if ($request->hasFile('photo_file')) {
            $file = $request->file('photo_file');
            $uploadDir = public_path('uploads/team');
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            $extension = $file->getClientOriginalExtension() ?: 'png';
            $filename = 'team_' . time() . '_' . \Illuminate\Support\Str::random(6) . '.' . $extension;
            $file->move($uploadDir, $filename);
            $validated['photo_url'] = '/uploads/team/' . $filename;
        }

        unset($validated['photo_file']);

        $teamMember->update($validated);

        return back()->with('success', 'Team member updated successfully!');
    }

    /**
     * Delete a team member.
     */
    public function deleteTeamMember(TeamMember $teamMember)
    {
        $teamMember->delete();

        return back()->with('success', 'Team member removed.');
    }

    /**
     * Update Other Services section CMS settings.
     */
    public function updateServicesSetting(Request $request)
    {
        $validated = $request->validate([
            'tag' => 'required|string|max:100',
            'headline_1' => 'required|string|max:255',
            'headline_2' => 'nullable|string|max:255',
        ]);

        $setting = ServicesSetting::first();
        if ($setting) {
            $setting->update($validated);
        } else {
            ServicesSetting::create($validated);
        }

        return back()->with('success', 'Services section settings updated successfully!');
    }

    /**
     * Store a new service card.
     */
    public function storeServiceItem(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'sort_order' => 'nullable|integer',
        ]);

        if (empty($validated['sort_order'])) {
            $validated['sort_order'] = ServiceItem::count() + 1;
        }

        ServiceItem::create($validated);

        return back()->with('success', 'New service added successfully!');
    }

    /**
     * Update an existing service card.
     */
    public function updateServiceItem(Request $request, ServiceItem $serviceItem)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'sort_order' => 'nullable|integer',
        ]);

        $serviceItem->update($validated);

        return back()->with('success', 'Service updated successfully!');
    }

    /**
     * Delete a service card.
     */
    public function deleteServiceItem(ServiceItem $serviceItem)
    {
        $serviceItem->delete();

        return back()->with('success', 'Service removed successfully.');
    }

    /**
     * Update the Work page Hero & Header CMS settings.
     */
    public function updateWorkSetting(Request $request)
    {
        $validated = $request->validate([
            'tag' => 'nullable|string|max:100',
            'headline_prefix' => 'nullable|string|max:100',
            'headline_highlight' => 'nullable|string|max:100',
            'headline_suffix' => 'nullable|string|max:100',
            'subtitle' => 'nullable|string|max:1000',
            'badge_tag_1' => 'nullable|string|max:100',
            'badge_tag_2' => 'nullable|string|max:100',
            'services_cta_text' => 'nullable|string|max:100',
            'services_cta_link' => 'nullable|string|max:255',
        ]);

        $workSetting = WorkSetting::first() ?? new WorkSetting();
        $workSetting->fill($validated);
        $workSetting->save();

        return back()->with('success', 'Work page hero & header updated successfully!');
    }

    /**
     * Update the Contact page copy and brief form settings.
     */
    public function updateContactSetting(Request $request)
    {
        $validated = $request->validate([
            'tag' => 'nullable|string|max:100',
            'headline_prefix' => 'nullable|string|max:150',
            'headline_highlight' => 'nullable|string|max:150',
            'subtitle' => 'nullable|string|max:1000',
            'form_title' => 'nullable|string|max:150',
            'form_subtitle' => 'nullable|string|max:500',
            'success_title' => 'nullable|string|max:150',
            'success_message' => 'nullable|string|max:1000',
        ]);

        $contactSetting = ContactSetting::first() ?? new ContactSetting();
        $contactSetting->fill($validated);
        $contactSetting->save();

        return back()->with('success', 'Contact page copy updated successfully!');
    }
}
