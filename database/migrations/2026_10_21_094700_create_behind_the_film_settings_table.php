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
        Schema::create('behind_the_film_settings', function (Blueprint $table) {
            $table->id();
            $table->string('tag')->default('BEHIND THE FILM');
            $table->string('title_line_1')->default('From human sketch to finished');
            $table->string('title_line_2')->default('film.');
            $table->string('concept_label')->default('Human concept');
            $table->string('concept_placeholder_text')->default('[Storyboard / reference frames]');
            $table->string('concept_image_url', 500)->nullable();
            $table->string('finish_label')->default('AI production, human finish');
            $table->string('finish_placeholder_text')->default('[Final film frame]');
            $table->string('finish_image_url', 500)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('behind_the_film_settings');
    }
};
