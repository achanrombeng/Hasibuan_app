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

    it('inherits primary image and images from connected products for living collection category', function () {
        $livingCollectionCategory = Category::factory()->create([
            'name' => 'Living Collection',
            'slug' => 'living-collection',
        ]);

        $collectionProduct = Product::factory()->create([
            'name' => 'Nova Collection',
            'category_id' => $livingCollectionCategory->id,
            'status' => ProductStatus::ACTIVE,
        ]);

        $chairProduct = Product::factory()->create(['name' => 'Nova Chair']);
        $chairImage = ProductImage::create([
            'product_id' => $chairProduct->id,
            'image_path' => 'products/chair.jpg',
            'sort_order' => 0,
            'is_primary' => true,
        ]);

        $sofaProduct = Product::factory()->create(['name' => 'Nova Sofa']);
        $sofaImage = ProductImage::create([
            'product_id' => $sofaProduct->id,
            'image_path' => 'products/sofa.jpg',
            'sort_order' => 0,
            'is_primary' => true,
        ]);

        $collectionProduct->linkedProducts()->sync([
            $chairProduct->id => ['sort_order' => 1],
            $sofaProduct->id => ['sort_order' => 2],
        ]);

        $collectionProduct = $collectionProduct->fresh()->load(['category', 'images', 'linkedProducts.images']);

        expect($collectionProduct->isLivingCollection())->toBeTrue();
        expect($collectionProduct->hasImages())->toBeTrue();
        expect($collectionProduct->primary_image)->not->toBeNull();
        expect($collectionProduct->primary_image->id)->toBe($chairImage->id);
        expect($collectionProduct->effective_images)->toHaveCount(2);
        expect($collectionProduct->effective_images->pluck('id')->toArray())->toEqual([$chairImage->id, $sofaImage->id]);
    });

    it('automatically syncs and populates primary images from linked products for living collection', function () {
        $livingCollectionCategory = Category::factory()->create([
            'name' => 'Living Collection',
            'slug' => 'living-collection',
        ]);

        $collection = Product::factory()->create([
            'name' => 'Salvador Collection',
            'category_id' => $livingCollectionCategory->id,
            'status' => ProductStatus::DRAFT,
        ]);

        $table = Product::factory()->create(['name' => 'Salvador Table']);
        $tableImg = ProductImage::create([
            'product_id' => $table->id,
            'image_path' => 'products/table.jpg',
            'sort_order' => 0,
            'is_primary' => true,
        ]);

        $chair = Product::factory()->create(['name' => 'Salvador Chair']);
        $chairImg = ProductImage::create([
            'product_id' => $chair->id,
            'image_path' => 'products/chair.jpg',
            'sort_order' => 0,
            'is_primary' => true,
        ]);

        $collection->linkedProducts()->sync([
            $table->id => ['sort_order' => 0],
            $chair->id => ['sort_order' => 1],
        ]);

        $collection->syncLivingCollectionImages();

        $collection = $collection->fresh()->load('images');
        expect($collection->images)->toHaveCount(2);
        expect($collection->status)->toBe(ProductStatus::ACTIVE);
        expect($collection->images[0]->image_path)->toBe('products/table.jpg');
        expect($collection->images[0]->is_primary)->toBeTrue();
        expect($collection->images[1]->image_path)->toBe('products/chair.jpg');
        expect($collection->images[1]->is_primary)->toBeFalse();
    });
});

