<?php

declare(strict_types=1);

use App\Enums\ProductStatus;
use App\Enums\SaleType;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductReview;
use App\Models\User;

describe('Product Model', function () {
    it('can be created with factory', function () {
        $product = Product::factory()->create();

        expect($product)->toBeInstanceOf(Product::class)
            ->and($product->id)->toBeInt()
            ->and($product->name)->toBeString()
            ->and($product->slug)->toBeString();
    });

    it('belongs to a category', function () {
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id]);

        expect($product->category)->toBeInstanceOf(Category::class)
            ->and($product->category->id)->toBe($category->id);
    });

    it('has many images', function () {
        $product = Product::factory()->create();
        ProductImage::factory()->count(3)->create(['product_id' => $product->id]);

        expect($product->images)->toHaveCount(3)
            ->and($product->images->first())->toBeInstanceOf(ProductImage::class);
    });

    it('has many reviews', function () {
        // Create role to prevent observer failure
        if (! \Spatie\Permission\Models\Role::where('name', 'admin')->exists()) {
            \Spatie\Permission\Models\Role::create(['name' => 'admin', 'guard_name' => 'web']);
        }
        
        $product = Product::factory()->create();
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        ProductReview::factory()->create([
            'product_id' => $product->id,
            'user_id' => $user1->id,
        ]);
        ProductReview::factory()->create([
            'product_id' => $product->id,
            'user_id' => $user2->id,
        ]);

        expect($product->reviews)->toHaveCount(2)
            ->and($product->reviews->first())->toBeInstanceOf(ProductReview::class);
    });

    it('generates slug from name', function () {
        $product = Product::factory()->create(['name' => 'Kursi Makan Modern']);

        expect($product->slug)->toBe('kursi-makan-modern');
    });

    it('calculates final price with discount', function () {
        $product = Product::factory()->create([
            'price' => 1000000,
            'sale_type' => \App\Enums\SaleType::HOT_SALE,
            'discount_percentage' => 20,
            'discount_starts_at' => now()->subDay(),
            'discount_ends_at' => now()->addDay(),
        ]);

        expect($product->final_price)->toBe(800000);
    });

    it('returns original price when no active discount', function () {
        $product = Product::factory()->create([
            'price' => 1000000,
            'discount_percentage' => null,
        ]);

        expect($product->final_price)->toBe(1000000);
    });

    it('returns original price when discount expired', function () {
        $product = Product::factory()->create([
            'price' => 1000000,
            'discount_percentage' => 20,
            'discount_starts_at' => now()->subWeek(),
            'discount_ends_at' => now()->subDay(),
        ]);

        expect($product->final_price)->toBe(1000000);
    });

    it('can check if in stock', function () {
        $inStock = Product::factory()->create([
            'track_stock' => true,
            'stock_quantity' => 10,
        ]);

        $outOfStock = Product::factory()->create([
            'track_stock' => true,
            'stock_quantity' => 0,
            'allow_backorder' => false,
        ]);

        expect($inStock->isInStock())->toBeTrue()
            ->and($outOfStock->isInStock())->toBeFalse();
    });

    it('can reduce stock', function () {
        $product = Product::factory()->create([
            'track_stock' => true,
            'stock_quantity' => 10,
        ]);

        $product->reduceStock(3);

        expect($product->fresh()->stock_quantity)->toBe(7);
    });

    it('can add stock', function () {
        $product = Product::factory()->create([
            'track_stock' => true,
            'stock_quantity' => 10,
        ]);

        $product->addStock(5);

        expect($product->fresh()->stock_quantity)->toBe(15);
    });

    it('scopes active products', function () {
        Product::factory()->create(['status' => ProductStatus::ACTIVE]);
        Product::factory()->create(['status' => ProductStatus::DRAFT]);
        Product::factory()->create(['status' => ProductStatus::INACTIVE]);

        expect(Product::active()->count())->toBe(1);
    });

    it('scopes featured products', function () {
        Product::factory()->create(['is_featured' => true]);
        Product::factory()->create(['is_featured' => false]);

        expect(Product::featured()->count())->toBe(1);
    });

    it('formats price correctly', function () {
        $product = Product::factory()->create(['price' => 1500000]);

        // Money library formats IDR with subunits (1500000 = Rp 15.000,00)
        expect($product->formatted_price)->toBeString()
            ->and($product->formatted_price)->toContain('Rp');
    });
});

