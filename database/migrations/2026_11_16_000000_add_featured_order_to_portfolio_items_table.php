<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Give the Home page "Featured films" its own order, separate from the
     * Work page order (sort_order). The four films the Home page showed before
     * this migration stay featured in the same order; the rest are unfeatured.
     */
    public function up(): void
    {
        Schema::table('portfolio_items', function (Blueprint $table) {
            $table->unsignedInteger('featured_order')->nullable()->after('is_featured');
        });

        $featuredIds = DB::table('portfolio_items')
            ->where('is_featured', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->limit(4)
            ->pluck('id');

        DB::table('portfolio_items')->update(['is_featured' => false]);

        foreach ($featuredIds as $index => $id) {
            DB::table('portfolio_items')
                ->where('id', $id)
                ->update(['is_featured' => true, 'featured_order' => $index + 1]);
        }
    }

    public function down(): void
    {
        Schema::table('portfolio_items', function (Blueprint $table) {
            $table->dropColumn('featured_order');
        });
    }
};
