<?php

declare(strict_types=1);

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
        Schema::create('promo_banners', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('description')->nullable();
            $table->string('cta_text')->default('Lihat Sekarang');
            $table->string('cta_link')->default('/shop/products');
            $table->enum('icon', ['gift', 'percent', 'truck'])->default('percent');
            $table->string('bg_gradient')->default('from-teal-700 to-teal-900');
            $table->enum('display_type', ['banner', 'popup', 'both'])->default('banner');
            $table->boolean('is_active')->default(true);
            $table->integer('priority')->default(0);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promo_banners');
    }
};
