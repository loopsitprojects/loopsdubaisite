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
        Schema::create('services_settings', function (Blueprint $table) {
            $table->id();
            $table->string('tag')->default('OUR OTHER SERVICES');
            $table->string('headline_1')->default('Beyond video, we support the wider');
            $table->string('headline_2')->default('brand.');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services_settings');
    }
};
