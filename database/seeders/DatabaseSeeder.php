<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\HeroSetting;
use App\Models\BehindTheFilmSetting;
use App\Models\AboutSetting;
use App\Models\TeamMember;
use App\Models\ServicesSetting;
use App\Models\ServiceItem;
use App\Models\Booking;
use App\Models\PortfolioItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Default Admin User
        User::updateOrCreate(
            ['email' => 'admin@loopsdubai.com'],
            [
                'name' => 'Loops Admin',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );

        // 2. Create Default Hero Setting matching exact design
        HeroSetting::updateOrCreate(
            ['id' => 1],
            [
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
            ]
        );

        // 3. Create Default Behind The Film Setting
        BehindTheFilmSetting::updateOrCreate(
            ['id' => 1],
            [
                'tag' => 'BEHIND THE FILM',
                'title_line_1' => 'From human sketch to finished',
                'title_line_2' => 'film.',
                'concept_label' => 'Human concept',
                'concept_placeholder_text' => '[Storyboard / reference frames]',
                'concept_image_url' => null,
                'finish_label' => 'AI production, human finish',
                'finish_placeholder_text' => '[Final film frame]',
                'finish_image_url' => null,
            ]
        );

        // 4. Create Default About Section Setting & Team Members
        AboutSetting::updateOrCreate(
            ['id' => 1],
            [
                'tag' => 'ABOUT',
                'headline' => 'Built for global brands.',
                'description' => "[Two to three sentences on the team's international experience, the markets you have worked in and why creative direction stays human.]",
            ]
        );

        for ($i = 1; $i <= 4; $i++) {
            TeamMember::updateOrCreate(
                ['id' => $i],
                [
                    'name' => '[Name]',
                    'role' => '[Role]',
                    'photo_url' => null,
                    'sort_order' => $i,
                ]
            );
        }

        // 5. Create Default Other Services Setting & Items
        ServicesSetting::updateOrCreate(
            ['id' => 1],
            [
                'tag' => 'OUR OTHER SERVICES',
                'headline_1' => 'Beyond video, we support the wider',
                'headline_2' => 'brand.',
            ]
        );

        $defaultServices = [
            [
                'id' => 1,
                'title' => 'Brand and creative strategy',
                'description' => '[Two-line description to confirm with the team.]',
                'sort_order' => 1,
            ],
            [
                'id' => 2,
                'title' => 'Digital performance',
                'description' => '[Two-line description to confirm with the team.]',
                'sort_order' => 2,
            ],
            [
                'id' => 3,
                'title' => 'Experiences and events',
                'description' => '[Two-line description to confirm with the team.]',
                'sort_order' => 3,
            ],
        ];

        foreach ($defaultServices as $serviceData) {
            ServiceItem::updateOrCreate(
                ['id' => $serviceData['id']],
                $serviceData
            );
        }

        // 3. Create Sample Bookings for Admin Dashboard
        Booking::firstOrCreate(
            ['email' => 'sarah@globalbrand.com'],
            [
                'name' => 'Sarah Jenkins',
                'company' => 'Apex Global Dynamics',
                'service_type' => 'Full AI Commercial Campaign',
                'message' => 'Looking to produce a 60-second high-end brand film using hyper-realistic AI visuals and live human voiceover.',
                'preferred_timeline' => 'Within 2 weeks',
                'status' => 'new',
                'admin_notes' => 'High priority inquiry from enterprise client.',
            ]
        );

        Booking::firstOrCreate(
            ['email' => 'marcus@futuredrive.io'],
            [
                'name' => 'Marcus Chen',
                'company' => 'FutureDrive Motors',
                'service_type' => 'Automotive Cinematic Reel',
                'message' => 'Need 3 video variations for our next-gen EV launch in Dubai and GCC regions.',
                'preferred_timeline' => '1 month',
                'status' => 'contacted',
                'admin_notes' => 'Sent introductory pitch deck and pricing structure.',
            ]
        );

        // 4. Create 8 Curated Films matching the Our Work showcase
        $films = [
            // Row 1: Real estate
            [
                'id' => 1,
                'title' => '[Brand name 1]',
                'film_subtitle' => '[Film title] · Created for [Brand]',
                'category' => 'Real estate',
                'duration' => '[0:45]',
                'client' => 'Real Estate Brand',
                'description' => 'Architectural cinematic showcase for luxury developments.',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
                'video_url' => 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-41551-large.mp4',
                'is_featured' => true,
                'sort_order' => 1,
            ],
            [
                'id' => 2,
                'title' => '[Brand name 2]',
                'film_subtitle' => '[Film title] · Created for [Brand]',
                'category' => 'Real estate',
                'duration' => '[0:45]',
                'client' => 'Real Estate Brand',
                'description' => 'Cinematic modern villa and skyline vision.',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                'video_url' => 'https://assets.mixkit.co/videos/preview/mixkit-modern-city-at-sunset-41553-large.mp4',
                'is_featured' => true,
                'sort_order' => 2,
            ],

            // Row 2: Consumer
            [
                'id' => 3,
                'title' => '[Brand name 1]',
                'film_subtitle' => '[Film title] · Created for [Brand]',
                'category' => 'Consumer',
                'duration' => '[0:45]',
                'client' => 'Consumer Brand',
                'description' => 'High-fashion and luxury consumer commercial film.',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
                'video_url' => 'https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-city-street-in-the-rain-41133-large.mp4',
                'is_featured' => true,
                'sort_order' => 3,
            ],
            [
                'id' => 4,
                'title' => '[Brand name 2]',
                'film_subtitle' => '[Film title] · Created for [Brand]',
                'category' => 'Consumer',
                'duration' => '[0:45]',
                'client' => 'Consumer Brand',
                'description' => 'Modern lifestyle and luxury consumer goods campaign.',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
                'video_url' => 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-modern-smartphone-41485-large.mp4',
                'is_featured' => true,
                'sort_order' => 4,
            ],

            // Row 3: Tech
            [
                'id' => 5,
                'title' => '[Brand name 1]',
                'film_subtitle' => '[Film title] · Created for [Brand]',
                'category' => 'Tech',
                'duration' => '[0:45]',
                'client' => 'Tech Brand',
                'description' => 'Next-generation AI cloud platform visualization.',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
                'video_url' => 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-flying-cars-41135-large.mp4',
                'is_featured' => true,
                'sort_order' => 5,
            ],
            [
                'id' => 6,
                'title' => '[Brand name 2]',
                'film_subtitle' => '[Film title] · Created for [Brand]',
                'category' => 'Tech',
                'duration' => '[0:45]',
                'client' => 'Tech Brand',
                'description' => 'Cybersecurity and hyper-connected world brand story.',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
                'video_url' => 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-41441-large.mp4',
                'is_featured' => true,
                'sort_order' => 6,
            ],

            // Row 4: Auto
            [
                'id' => 7,
                'title' => '[Brand name 1]',
                'film_subtitle' => '[Film title] · Created for [Brand]',
                'category' => 'Auto',
                'duration' => '[0:45]',
                'client' => 'Auto Brand',
                'description' => 'High-velocity automotive cinematic launch film.',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
                'video_url' => 'https://assets.mixkit.co/videos/preview/mixkit-sports-car-driving-on-a-road-in-the-city-at-night-42861-large.mp4',
                'is_featured' => true,
                'sort_order' => 7,
            ],
            [
                'id' => 8,
                'title' => '[Brand name 2]',
                'film_subtitle' => '[Film title] · Created for [Brand]',
                'category' => 'Auto',
                'duration' => '[0:45]',
                'client' => 'Auto Brand',
                'description' => 'Next-gen electric vehicle reveal and performance reel.',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
                'video_url' => 'https://assets.mixkit.co/videos/preview/mixkit-night-city-street-with-neon-lights-41134-large.mp4',
                'is_featured' => true,
                'sort_order' => 8,
            ],
        ];

        foreach ($films as $film) {
            PortfolioItem::updateOrCreate(['id' => $film['id']], $film);
        }

        // 5. Create 6 Brand Logos for CREATED FOR Section (matching screenshot)
        for ($i = 1; $i <= 6; $i++) {
            \App\Models\BrandLogo::updateOrCreate(
                ['id' => $i],
                [
                    'name' => '[Brand logo]',
                    'logo_url' => null,
                    'sort_order' => $i,
                    'is_active' => true,
                ]
            );
        }

        // 6. Create Default Company Settings
        \App\Models\CompanySetting::updateOrCreate(
            ['id' => 1],
            [
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
            ]
        );
    }
}
