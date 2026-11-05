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
                'reel_video_url' => 'https://ai.loopsintegrated.co/loopsvideos/Showreel/Dubaisw.mp4',
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
                'concept_image_url' => '/images/storyboard/lily-lanka',
                'finish_label' => 'AI production, human finish',
                'finish_placeholder_text' => '[Final film frame]',
                'finish_image_url' => 'https://www.youtube.com/watch?v=9FpcdDYyvWo',
            ]
        );

        // 4. Create Default About Section Setting & Team Members
        AboutSetting::updateOrCreate(
            ['id' => 1],
            [
                'tag' => 'ABOUT',
                'headline' => 'Built for global brands.',
                'description' => 'From Colombo to Doha and Sydney, we’ve worked with brands across 14 markets, including the UK, USA, Canada, Japan, Singapore, the UAE and New Zealand. That range has taught us how to make ideas travel without losing what makes a brand distinct. Our creative direction stays human because the ideas that move people come from people, and tools only speed up the making.',
            ]
        );

        $defaultTeam = [
            [
                'id' => 1,
                'name' => 'Shehan Selvanayagam',
                'role' => 'Managing Director',
                'photo_url' => '/uploads/team/team_1793773609_9izX5N.png',
                'sort_order' => 1,
            ],
            [
                'id' => 2,
                'name' => 'Stephan Anoj',
                'role' => 'Executive Director',
                'photo_url' => '/uploads/team/team_1793773653_AOgqAJ.png',
                'sort_order' => 2,
            ],
            [
                'id' => 3,
                'name' => 'Oken Silva',
                'role' => 'Head of Digital',
                'photo_url' => '/uploads/team/team_1793773682_ZHO02B.png',
                'sort_order' => 3,
            ],
            [
                'id' => 4,
                'name' => 'Perez Daniel',
                'role' => 'Creative Director',
                'photo_url' => '/uploads/team/team_1793773714_3rlFFO.png',
                'sort_order' => 4,
            ],
        ];

        foreach ($defaultTeam as $member) {
            TeamMember::updateOrCreate(['id' => $member['id']], $member);
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
                'description' => "Positioning, brand architecture and 360° creative concepts, built on research and consumer insight.\nIdentities, packaging and campaign ideas that give a brand a clear, ownable voice.",
                'sort_order' => 1,
            ],
            [
                'id' => 2,
                'title' => 'Digital performance',
                'description' => "Multichannel strategy, social, content, SEO and performance media, planned and bought around your goals.\nAnalytics and automation keep every campaign measurable and optimised for growth.",
                'sort_order' => 2,
            ],
            [
                'id' => 3,
                'title' => 'Experiences and events',
                'description' => "Event design, brand activations and ambient and outdoor concepts that put the brand in front of people in real life.\nBuilt to be memorable on the day and to carry on through content and social.",
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

        // 4. Create Curated Films matching the Our Work showcase
        $films = [
            [
                'id' => 1,
                'title' => 'Asian Paints Causeway — Royal Infinity | Film by Loops Integrated',
                'category' => 'Consumer',
                'duration' => '[1:21]',
                'client' => 'Real Estate Brand',
                'film_subtitle' => "We created this commercial film for Asian Paints Causeway's Royal Infinity paint, showcased at a special event celebrating a life shaped by personal expression and refined taste.",
                'description' => 'Architectural cinematic showcase for luxury developments.',
                'thumbnail_url' => 'https://img.youtube.com/vi/NZBRpXRW4V0/maxresdefault.jpg',
                'video_url' => 'https://www.youtube.com/watch?v=NZBRpXRW4V0&list=PLbgYKilHGIbE',
                'is_featured' => true,
                'sort_order' => 1,
            ],
            [
                'id' => 2,
                'title' => 'Elyndra Life | Belong Beautifully | Brand Film by Loops Integrated',
                'category' => 'Real estate',
                'duration' => '[1:47]',
                'client' => 'Real Estate Brand',
                'film_subtitle' => 'Belong beautifully.We produced this brand film for Elyndra Life, capturing a sense of belonging found in a place of rare beauty near Yala.',
                'description' => 'Cinematic modern villa and skyline vision.',
                'thumbnail_url' => 'https://img.youtube.com/vi/MfDawFyD2H0/maxresdefault.jpg',
                'video_url' => 'https://youtu.be/MfDawFyD2H0?si=e5Gx4xoXKbBKl8ji',
                'is_featured' => true,
                'sort_order' => 2,
            ],
            [
                'id' => 3,
                'title' => 'Moov | Animated Film by Loops Integrated',
                'category' => 'Consumer',
                'duration' => '[0:19]',
                'client' => 'Consumer Brand',
                'film_subtitle' => 'We created this 15-second animated film for Moov, following a cricket moment where their pain relief spray keeps players moving through the game, without missing a beat.',
                'description' => 'High-fashion and luxury consumer commercial film.',
                'thumbnail_url' => 'https://img.youtube.com/vi/dfgQZC8rrpI/maxresdefault.jpg',
                'video_url' => 'https://youtu.be/dfgQZC8rrpI?si=SyVPSp0zX6Xle4Se',
                'is_featured' => true,
                'sort_order' => 3,
            ],
            [
                'id' => 4,
                'title' => 'Moov',
                'category' => 'Consumer',
                'duration' => '[0:19]',
                'client' => 'Consumer Brand',
                'film_subtitle' => 'We created this 15-second animated film for Moov, following a gym moment where their pain relief spray keeps you moving through your workout, without missing a beat.',
                'description' => 'Modern lifestyle and luxury consumer goods campaign.',
                'thumbnail_url' => 'https://img.youtube.com/vi/3i8EHmXjVGE/maxresdefault.jpg',
                'video_url' => 'https://youtu.be/3i8EHmXjVGE?si=rkKs1yfQCic3lT6J',
                'is_featured' => true,
                'sort_order' => 4,
            ],
            [
                'id' => 5,
                'title' => 'Moov',
                'category' => 'Tech',
                'duration' => '[0:19]',
                'client' => 'Tech Brand',
                'film_subtitle' => 'We created this 15-second animated film for Moov, following a futsal moment where their pain relief spray keeps players moving through the game, without missing a beat.',
                'description' => 'Next-generation AI cloud platform visualization.',
                'thumbnail_url' => 'https://img.youtube.com/vi/SCvM_xxix04/maxresdefault.jpg',
                'video_url' => 'https://youtu.be/SCvM_xxix04?si=PqV8-eRO3Wc92SjD',
                'is_featured' => true,
                'sort_order' => 5,
            ],
            [
                'id' => 6,
                'title' => 'LilyLanka | AI Film by Loops Integrated',
                'category' => 'Tech',
                'duration' => '[1:30]',
                'client' => 'Tech Brand',
                'film_subtitle' => "We created this AI-produced film for LilyLanka, showcasing the beauty of Sri Lanka's destinations and experiences for tourism.",
                'description' => 'Cybersecurity and hyper-connected world brand story.',
                'thumbnail_url' => 'https://img.youtube.com/vi/ZJ3pMniorko/maxresdefault.jpg',
                'video_url' => 'https://youtu.be/ZJ3pMniorko?si=Mc8P32w8epy6Whf7',
                'is_featured' => true,
                'sort_order' => 6,
            ],
            [
                'id' => 7,
                'title' => 'Elephant House Wonder | Ice Cream Day Special by Loops Integrated',
                'category' => 'Auto',
                'duration' => '[1:36]',
                'client' => 'Auto Brand',
                'film_subtitle' => 'TV commercial produced by Loops Integrated for Elephant House Wonder ice cream, celebrating Ice Cream Day',
                'description' => 'High-velocity automotive cinematic launch film.',
                'thumbnail_url' => 'https://img.youtube.com/vi/hL_OjUWdDRg/maxresdefault.jpg',
                'video_url' => 'https://youtu.be/hL_OjUWdDRg?si=jJeG3L8NY5OGMo90',
                'is_featured' => true,
                'sort_order' => 7,
            ],
            [
                'id' => 8,
                'title' => 'Elephant House "Wonder Blast" | Fully AI Produced Film by Loops Integrated',
                'category' => 'Auto',
                'duration' => '[0:34]',
                'client' => 'Auto Brand',
                'film_subtitle' => 'We created this fully AI-produced video for Elephant House Wonder Blast ice cream generated from concept to final frame using AI video production, bringing the fun and flavor of Wonder Blast to life.',
                'description' => 'Next-gen electric vehicle reveal and performance reel.',
                'thumbnail_url' => 'https://img.youtube.com/vi/0YRnuCGvyR4/maxresdefault.jpg',
                'video_url' => 'https://youtu.be/0YRnuCGvyR4?si=tOB9pNd1yoZ7y0it',
                'is_featured' => true,
                'sort_order' => 8,
            ],
            [
                'id' => 9,
                'title' => 'Yamaha FZS V5 | Fully AI Produced Film by Loops Integrated',
                'category' => 'Real estate',
                'duration' => '[1:12]',
                'client' => null,
                'film_subtitle' => "We created this fully AI produced video for the Yamaha FZS V5, generated from concept to final frame using AI video production showcasing the bike's design, power, and performance in a bold new way.",
                'description' => null,
                'thumbnail_url' => 'https://img.youtube.com/vi/5MZuArhqgAg/maxresdefault.jpg',
                'video_url' => 'https://youtu.be/5MZuArhqgAg?si=4srDSZGo-OSfuh77',
                'is_featured' => true,
                'sort_order' => 9,
            ],
        ];

        foreach ($films as $film) {
            PortfolioItem::updateOrCreate(['id' => $film['id']], $film);
        }

        // 5. Brand logos for the "Trusted by leading brands" strip
        $brands = [
            ['name' => 'Yamaha', 'logo_url' => '/images/brands/yamaha.svg'],
            ['name' => 'PepsiCo', 'logo_url' => '/images/brands/pepsico.png'],
            ['name' => 'British Council', 'logo_url' => '/images/brands/british-council.png'],
            ['name' => 'Nas Daily', 'logo_url' => '/images/brands/nas-daily.png'],
            ['name' => 'Rauland Australia', 'logo_url' => '/images/brands/rauland.png'],
        ];

        foreach ($brands as $index => $brand) {
            \App\Models\BrandLogo::updateOrCreate(
                ['id' => $index + 1],
                $brand + ['sort_order' => $index + 1, 'is_active' => true]
            );
        }

        // Remove the leftover sixth placeholder row
        \App\Models\BrandLogo::where('name', '[Brand logo]')->delete();

        // 6. Create Default Company Settings
        \App\Models\CompanySetting::updateOrCreate(
            ['id' => 1],
            [
                'logo_type' => 'image',
                'logo_text_prefix' => 'Loops',
                'logo_text_suffix' => 'Integrated',
                'logo_image_url' => '/uploads/logos/loops_integrated_logo.png',
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
