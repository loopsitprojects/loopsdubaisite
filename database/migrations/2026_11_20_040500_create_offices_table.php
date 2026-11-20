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
        Schema::create('offices', function (Blueprint $table) {
            $table->id();
            $table->string('city');
            $table->string('country');
            $table->string('role')->nullable();
            $table->boolean('is_headquarters')->default(false);
            $table->double('lat', 10, 6)->default(0);
            $table->double('lng', 10, 6)->default(0);
            $table->text('description')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('address')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Pre-populate with initial 7 global offices
        $now = now();
        $initialOffices = [
            [
                'city' => 'Colombo',
                'country' => 'Sri Lanka',
                'role' => 'Global Headquarters',
                'is_headquarters' => true,
                'lat' => 6.9147,
                'lng' => 79.8484,
                'description' => 'The foundation of Loops Integrated. Colombo drives our core creative direction, AI video workflows, and international strategy.',
                'phone' => '+94 11 259 0880',
                'email' => 'colombo@loopsintegrated.com',
                'address' => 'Loops Integrated HQ, Colombo 03, Sri Lanka',
                'sort_order' => 1,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'city' => 'Dubai',
                'country' => 'UAE',
                'role' => 'Middle East & Africa',
                'is_headquarters' => false,
                'lat' => 25.1972,
                'lng' => 55.2744,
                'description' => 'Our regional hub in Dubai Media City, producing AI-accelerated high-craft video campaigns and brand storytelling for premier Middle Eastern brands.',
                'phone' => '+971 4 000 0000',
                'email' => 'hello@loopsdubai.com',
                'address' => 'Dubai Media City, Building 4, Dubai, UAE',
                'sort_order' => 2,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'city' => 'Doha',
                'country' => 'Qatar',
                'role' => 'Gulf Region',
                'is_headquarters' => false,
                'lat' => 25.2854,
                'lng' => 51.5310,
                'description' => 'Empowering leading regional enterprises with world-class digital performance, creative campaigns, and high-impact media.',
                'phone' => '+974 4400 0000',
                'email' => 'doha@loopsintegrated.com',
                'address' => 'West Bay, Doha, Qatar',
                'sort_order' => 3,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'city' => 'London',
                'country' => 'United Kingdom',
                'role' => 'UK & Europe',
                'is_headquarters' => false,
                'lat' => 51.5144,
                'lng' => -0.0803,
                'description' => 'Connecting European enterprises with borderless creative talent, rapid AI video turnarounds, and cross-cultural campaign strategy.',
                'phone' => '+44 20 7946 0912',
                'email' => 'london@loopsintegrated.com',
                'address' => '128 City Road, London, EC1V 2NX, United Kingdom',
                'sort_order' => 4,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'city' => 'Singapore',
                'country' => 'Singapore',
                'role' => 'Southeast Asia',
                'is_headquarters' => false,
                'lat' => 1.2838,
                'lng' => 103.8516,
                'description' => 'Powering Southeast Asian markets with forward-leaning AI direction, social-first video production, and agile brand communications.',
                'phone' => '+65 6789 0123',
                'email' => 'singapore@loopsintegrated.com',
                'address' => 'Marina Bay Financial Centre, Singapore',
                'sort_order' => 5,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'city' => 'Sydney',
                'country' => 'Australia',
                'role' => 'Oceania',
                'is_headquarters' => false,
                'lat' => -33.8688,
                'lng' => 151.2093,
                'description' => 'Crafting brand campaigns and experiential creative for Australian and Kiwi audiences with human emotion and AI velocity.',
                'phone' => '+61 2 9876 5432',
                'email' => 'sydney@loopsintegrated.com',
                'address' => 'Barangaroo, Sydney NSW 2000, Australia',
                'sort_order' => 6,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'city' => 'Suva',
                'country' => 'Fiji',
                'role' => 'Pacific Hub',
                'is_headquarters' => false,
                'lat' => -18.1248,
                'lng' => 178.4501,
                'description' => 'Leading creative design, media strategy, and digital campaigns across the South Pacific.',
                'phone' => '+679 330 0000',
                'email' => 'fiji@loopsintegrated.com',
                'address' => 'Victoria Parade, Suva, Fiji',
                'sort_order' => 7,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        DB::table('offices')->insert($initialOffices);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offices');
    }
};
