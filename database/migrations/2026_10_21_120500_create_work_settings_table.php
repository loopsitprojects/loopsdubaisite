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
        Schema::create('work_settings', function (Blueprint $table) {
            $table->id();
            $table->string('tag')->default('OUR WORK');
            $table->string('headline_prefix')->default('Our');
            $table->string('headline_highlight')->default('AI creative');
            $table->string('headline_suffix')->default('world.');
            $table->text('subtitle');
            $table->string('badge_tag_1')->default('AI-generated');
            $table->string('badge_tag_2')->default('Human-directed');
            $table->string('services_cta_text')->default('Our other services');
            $table->string('services_cta_link')->default('/#services');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('work_settings');
    }
};
