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
        Schema::create('home_sections', function (Blueprint $table) {
            $table->id();
            $table->string('section_key')->unique();
            $table->string('name');
            $table->string('description')->nullable();
            $table->boolean('is_visible')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Seed default sections
        $now = now();
        $sections = [
            [
                'section_key' => 'hero',
                'name' => 'Hero Section',
                'description' => 'Main headline, subtext, badges and showreel video preview.',
                'is_visible' => true,
                'sort_order' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'section_key' => 'brands',
                'name' => 'Client Brands (Logo Strip)',
                'description' => 'Infinite scrolling ticker of trusted brand partner logos.',
                'is_visible' => true,
                'sort_order' => 2,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'section_key' => 'featured_films',
                'name' => 'Featured Films',
                'description' => 'Curated portfolio showcase grid and full video reel modal.',
                'is_visible' => true,
                'sort_order' => 3,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'section_key' => 'how_it_works',
                'name' => 'How It Works',
                'description' => 'Three-step process: Human concept, AI acceleration, Human finishing.',
                'is_visible' => true,
                'sort_order' => 4,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'section_key' => 'behind_the_film',
                'name' => 'Behind The Film',
                'description' => 'Interactive storyboard sketch vs final AI film comparison.',
                'is_visible' => true,
                'sort_order' => 5,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'section_key' => 'about',
                'name' => 'About & Leadership Team',
                'description' => 'Agency global story, narrative paragraph, and leadership team photo cards.',
                'is_visible' => true,
                'sort_order' => 6,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'section_key' => 'global_offices',
                'name' => 'Global Offices & Map',
                'description' => 'Interactive 360° global network canvas map and regional office cards.',
                'is_visible' => true,
                'sort_order' => 7,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'section_key' => 'services',
                'name' => 'Our Other Services',
                'description' => 'Brand strategy, digital performance, and experiential event cards.',
                'is_visible' => true,
                'sort_order' => 8,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'section_key' => 'cta',
                'name' => 'CTA Bottom Banner',
                'description' => 'High-contrast bottom banner inviting briefs and creative call booking.',
                'is_visible' => true,
                'sort_order' => 9,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        DB::table('home_sections')->insert($sections);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('home_sections');
    }
};
