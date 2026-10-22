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
        Schema::create('company_settings', function (Blueprint $table) {
            $table->id();
            $table->string('logo_type')->default('text'); // 'text' or 'image'
            $table->string('logo_text_prefix')->default('Loops');
            $table->string('logo_text_suffix')->default('Integrated');
            $table->string('logo_image_url', 500)->nullable();
            $table->string('company_name')->default('Loops Integrated');
            $table->string('email')->default('hello@loopsdubai.com');
            $table->string('phone')->default('+971 4 000 0000');
            $table->text('address')->nullable();
            $table->string('working_hours')->default('Mon — Fri, 9:00 AM — 6:00 PM GST');
            $table->string('tagline', 500)->nullable()->default('AI video production with human creative direction.');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_settings');
    }
};
