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
        Schema::create('contact_settings', function (Blueprint $table) {
            $table->id();
            $table->string('tag')->nullable()->default('START A PROJECT');
            $table->string('headline_prefix')->nullable()->default('Let’s make something');
            $table->string('headline_highlight')->nullable()->default('extraordinary.');
            $table->text('subtitle')->nullable();
            $table->string('form_title')->nullable()->default('Book a creative call');
            $table->string('form_subtitle')->nullable()->default('Fill in your details below and we’ll reach out to schedule our session.');
            $table->string('success_title')->nullable()->default('Creative Brief Received!');
            $table->text('success_message')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_settings');
    }
};
