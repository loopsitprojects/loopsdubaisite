<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('storyboard_frames', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->string('image_url');
            $table->text('caption')->nullable();
            $table->text('scene')->nullable();
            $table->text('vo')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Pre-populate with initial 17 storyboard frames
        $now = now();
        $frames = [
            [
                'title' => 'Shot 01',
                'image_url' => '/images/storyboard/lily-lanka/shot_01.webp',
                'caption' => 'Sunrise over Sri Lanka (coastline / hills). Quiet morning mood. VO: "Before you arrive in Sri Lanka..."',
                'scene' => 'Sunrise over Sri Lanka (coastline / hills). Quiet morning mood.',
                'vo' => 'Before you arrive in Sri Lanka...',
                'sort_order' => 1,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'title' => 'Shot 02',
                'image_url' => '/images/storyboard/lily-lanka/shot_02.webp',
                'caption' => 'Hotel doors open, lights switch on, staff prepping reception. VO: "…Sri Lanka is already preparing for you."',
                'scene' => 'Hotel doors open, lights switch on, staff prepping reception.',
                'vo' => '…Sri Lanka is already preparing for you.',
                'sort_order' => 2,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'title' => 'Shot 03',
                'image_url' => '/images/storyboard/lily-lanka/shot_03.webp',
                'caption' => 'Driver wipes mirrors, checks vehicle, straightens pickup board. VO: "Because here.."',
                'scene' => 'Driver wipes mirrors, checks vehicle, straightens pickup board.',
                'vo' => 'Because here..',
                'sort_order' => 3,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'title' => 'Shot 04',
                'image_url' => '/images/storyboard/lily-lanka/shot_04.webp',
                'caption' => 'Cooking class host lays out spices, clay pots simmer, warm smile. VO: "..you\'re not just visiting a destination."',
                'scene' => 'Cooking class host lays out spices, clay pots simmer, warm smile.',
                'vo' => '..you\'re not just visiting a destination.',
                'sort_order' => 4,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'title' => 'Shot 05',
                'image_url' => '/images/storyboard/lily-lanka/shot_05.webp',
                'caption' => 'Dolphin / whale watching crew preparing the boat at sunrise. VO: "You\'re being hosted."',
                'scene' => 'Dolphin / whale watching crew preparing the boat at sunrise.',
                'vo' => 'You\'re being hosted.',
                'sort_order' => 5,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'title' => 'Shot 06',
                'image_url' => '/images/storyboard/lily-lanka/shot_06.webp',
                'caption' => 'Safari jeep starts up, guide checks binoculars, nature shots. VO: "From the moment you land.."',
                'scene' => 'Safari jeep starts up, guide checks binoculars, nature shots.',
                'vo' => 'From the moment you land..',
                'sort_order' => 6,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'title' => 'Shot 07',
                'image_url' => '/images/storyboard/lily-lanka/shot_07.webp',
                'caption' => 'Tourist arrives, greeted warmly, luggage helped, water offered. VO: "...to every journey you take..."',
                'scene' => 'Tourist arrives, greeted warmly, luggage helped, water offered.',
                'vo' => '...to every journey you take...',
                'sort_order' => 7,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'title' => 'Shot 08',
                'image_url' => '/images/storyboard/lily-lanka/shot_08.webp',
                'caption' => 'Quick montage of smiles: hotel staff, tour guide, driver, boat crew. VO: "It\'s not one place that welcomes you...It\'s all of us. Hotels. Drivers. Guides. Tour operators."',
                'scene' => 'Quick montage of smiles: hotel staff, tour guide, driver, boat crew.',
                'vo' => 'It\'s not one place that welcomes you...It\'s all of us. Hotels. Drivers. Guides. Tour operators.',
                'sort_order' => 8,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'title' => 'Shot 09',
                'image_url' => '/images/storyboard/lily-lanka/shot_09.webp',
                'caption' => 'Different experiences flowing: surf, tea trails, cultural spots. VO: "Ocean adventures. Wildlife safaris. Local experiences."',
                'scene' => 'Different experiences flowing: surf, tea trails, cultural spots.',
                'vo' => 'Ocean adventures. Wildlife safaris. Local experiences.',
                'sort_order' => 9,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'title' => 'Shot 10',
                'image_url' => '/images/storyboard/lily-lanka/shot_10.webp',
                'caption' => 'Subtle UI shots: mobile booking / partner confirmations (not too "techy"). VO: "That\'s why we built Lily Lanka."',
                'scene' => 'Subtle UI shots: mobile booking / partner confirmations (not too "techy").',
                'vo' => 'That\'s why we built Lily Lanka.',
                'sort_order' => 10,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'title' => 'Shot 11',
                'image_url' => '/images/storyboard/lily-lanka/shot_11.webp',
                'caption' => 'Map-style motion visual/ journey lines connecting regions (Colombo →South→Yala→Hill Country). VO: "A one-stop travel ecosystem made for Sri Lanka."',
                'scene' => 'Map-style motion visual/ journey lines connecting regions (Colombo →South→Yala→Hill Country).',
                'vo' => 'A one-stop travel ecosystem made for Sri Lanka.',
                'sort_order' => 11,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'title' => 'Shot 12',
                'image_url' => '/images/storyboard/lily-lanka/shot_12.webp',
                'caption' => 'Bookings in action: guest checking in, driver pickup, tour departure. VO: "Bringing everything you need into one place..."',
                'scene' => 'Bookings in action: guest checking in, driver pickup, tour departure.',
                'vo' => 'Bringing everything you need into one place...',
                'sort_order' => 12,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'title' => 'Shot 13',
                'image_url' => '/images/storyboard/lily-lanka/shot_13.webp',
                'caption' => 'Cut to multiple stakeholders in motion (like "team Sri Lanka"). VO: "...while supporting everyone who makes your journey possible."',
                'scene' => 'Cut to multiple stakeholders in motion (like "team Sri Lanka").',
                'vo' => '...while supporting everyone who makes your journey possible.',
                'sort_order' => 13,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'title' => 'Shot 14',
                'image_url' => '/images/storyboard/lily-lanka/shot_14.webp',
                'caption' => 'Emotional payoff montage: laughter, authentic smiles, family moments. VO: "So when you visit Sri Lanka..."',
                'scene' => 'Emotional payoff montage: laughter, authentic smiles, family moments.',
                'vo' => 'So when you visit Sri Lanka...',
                'sort_order' => 14,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'title' => 'Shot 15',
                'image_url' => '/images/storyboard/lily-lanka/shot_15.webp',
                'caption' => 'Tourist experiences: dolphin sighting, leopard track, cooking class plating. VO: "..you\'re not just booking a trip."',
                'scene' => 'Tourist experiences: dolphin sighting, leopard track, cooking class plating.',
                'vo' => '..you\'re not just booking a trip.',
                'sort_order' => 15,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'title' => 'Shot 16',
                'image_url' => '/images/storyboard/lily-lanka/shot_16.webp',
                'caption' => 'Wide scenic shot: beach sunset / tea estates. VO: "You\'re being hosted by a nation."',
                'scene' => 'Wide scenic shot: beach sunset / tea estates.',
                'vo' => 'You\'re being hosted by a nation.',
                'sort_order' => 16,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'title' => 'Shot 17',
                'image_url' => '/images/storyboard/lily-lanka/shot_17.webp',
                'caption' => 'Final brand frame. Logo + platform benefits. VO: "We Host Sri Lanka."',
                'scene' => 'Final brand frame. Logo + platform benefits.',
                'vo' => 'We Host Sri Lanka.',
                'sort_order' => 17,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        DB::table('storyboard_frames')->insert($frames);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('storyboard_frames');
    }
};
