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
        Schema::table('order_items', function (Blueprint $table) {
            $table->unsignedBigInteger('original_price')->nullable()->after('unit_price');
        });

        // Set original_price = unit_price + discount_amount for existing records
        DB::statement('UPDATE order_items SET original_price = unit_price + COALESCE(discount_amount, 0)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropColumn('original_price');
        });
    }
};
