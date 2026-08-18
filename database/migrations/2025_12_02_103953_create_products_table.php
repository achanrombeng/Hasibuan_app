<?php

declare(strict_types=1);

use App\Enums\ProductStatus;
use App\Enums\SaleType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Products table untuk produk furniture.
     * Sesuai requirement: SKU, categories, multiple images, pricing, reviews, dll.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->string('sku')->unique();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('short_description')->nullable();
            $table->longText('description')->nullable();

            // Pricing (dalam satuan terkecil: rupiah)
            $table->unsignedBigInteger('price');
            $table->unsignedBigInteger('compare_price')->nullable(); // Harga coret
            $table->unsignedBigInteger('cost_price')->nullable(); // Harga modal

            // Stock management
            $table->integer('stock_quantity')->default(0);
            $table->integer('low_stock_threshold')->default(5);
            $table->boolean('track_stock')->default(true);
            $table->boolean('allow_backorder')->default(false);

            // Physical attributes (untuk furniture)
            $table->decimal('weight', 10, 2)->nullable(); // dalam kg
            $table->decimal('length', 10, 2)->nullable(); // dalam cm
            $table->decimal('width', 10, 2)->nullable();
            $table->decimal('height', 10, 2)->nullable();

            // Material & specifications
            $table->string('material')->nullable();
            $table->string('color')->nullable();
            $table->json('specifications')->nullable(); // JSON untuk spesifikasi tambahan

            // Status & visibility
            $table->string('status')->default(ProductStatus::DRAFT->value);
            $table->string('sale_type')->default(SaleType::REGULAR->value);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_new_arrival')->default(false);

            // Sale discount (untuk clearance, stock sale, hot sale)
            $table->unsignedTinyInteger('discount_percentage')->nullable();
            $table->timestamp('discount_starts_at')->nullable();
            $table->timestamp('discount_ends_at')->nullable();

            // SEO
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();

            // Statistics
            $table->unsignedInteger('view_count')->default(0);
            $table->unsignedInteger('sold_count')->default(0);
            $table->decimal('average_rating', 3, 2)->default(0);
            $table->unsignedInteger('review_count')->default(0);

            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index(['status', 'is_featured']);
            $table->index(['category_id', 'status']);
            $table->index(['sale_type', 'status']);
            $table->index('sold_count');
            $table->index('average_rating');
        });

        // Fulltext index hanya untuk MySQL/MariaDB
        if (in_array(Schema::getConnection()->getDriverName(), ['mysql', 'mariadb'])) {
            Schema::table('products', function (Blueprint $table) {
                $table->fullText(['name', 'short_description']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
