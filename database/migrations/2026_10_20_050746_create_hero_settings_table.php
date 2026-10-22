<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('hero_settings', function (Blueprint $table) {
            $table->id();
            $table->string('badge_tag_1')->default('AI-generated');
            $table->string('badge_tag_2')->default('Human-directed');
            $table->string('headline_1')->default('AI-powered video.');
            $table->string('headline_2')->default('Human-led creative.');
            $table->text('subtitle');
            $table->string('primary_cta_text')->default('Watch our work');
            $table->string('primary_cta_link')->default('#work');
            $table->string('secondary_cta_text')->default('Book a creative call');
            $table->string('secondary_cta_link')->default('#book');
            $table->string('reel_placeholder_text')->default('[HERO REEL PLACEHOLDER - 4G-008 - MUTED AUTOPLAY]');
            $table->string('reel_video_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hero_settings');
    }
};
