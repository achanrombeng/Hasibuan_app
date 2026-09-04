<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'price',
                'compare_price',
                'cost_price',
                'discount_percentage',
                'discount_starts_at',
                'discount_ends_at',
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->unsignedBigInteger('price')->default(0)->after('description');
            $table->unsignedBigInteger('compare_price')->nullable()->after('price');
            $table->unsignedBigInteger('cost_price')->nullable()->after('compare_price');
            $table->unsignedTinyInteger('discount_percentage')->nullable()->after('is_new_arrival');
            $table->timestamp('discount_starts_at')->nullable()->after('discount_percentage');
            $table->timestamp('discount_ends_at')->nullable()->after('discount_starts_at');
        });
    }
};
