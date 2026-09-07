<?php

declare(strict_types=1);

use App\Enums\ProductStatus;
use App\Models\Product;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update all products without images to DRAFT status
        Product::doesntHave('images')
            ->where('status', '!=', ProductStatus::DRAFT->value)
            ->update([
                'status' => ProductStatus::DRAFT->value,
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No-op: do not revert products status automatically
    }
};
