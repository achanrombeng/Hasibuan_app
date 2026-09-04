<?php

declare(strict_types=1);

use App\Enums\ProductStatus;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductReview;
use App\Models\User;
use Spatie\Permission\Models\Role;

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
        if (! Role::where('name', 'admin')->exists()) {
            Role::create(['name' => 'admin', 'guard_name' => 'web']);
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

    it('can check if in stock', function () {
        $product = Product::factory()->create();

        expect($product->isInStock())->toBeTrue();
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
});
