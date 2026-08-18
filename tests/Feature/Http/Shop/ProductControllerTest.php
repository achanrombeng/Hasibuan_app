<?php

declare(strict_types=1);

use App\Enums\ProductStatus;
use App\Models\Category;
use App\Models\Product;

beforeEach(function () {
    // Disable Vite for testing (frontend not built yet)
    $this->withoutVite();

    // Disable Inertia page existence check (frontend not built yet)
    config(['inertia.testing.ensure_pages_exist' => false]);
});

describe('Shop ProductController', function () {
    it('shows products listing page', function () {
        Product::factory()->count(5)->create(['status' => ProductStatus::ACTIVE]);

        $response = $this->get(route('shop.products.index'));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Shop/Products/Index')
                ->has('products.data', 5)
            );
    });

    it('only shows active products', function () {
        Product::factory()->create(['status' => ProductStatus::ACTIVE]);
        Product::factory()->create(['status' => ProductStatus::DRAFT]);
        Product::factory()->create(['status' => ProductStatus::INACTIVE]);

        $response = $this->get(route('shop.products.index'));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page->has('products.data', 1));
    });

    it('shows single product page', function () {
        $product = Product::factory()->create([
            'status' => ProductStatus::ACTIVE,
            'slug' => 'test-product',
        ]);

        $response = $this->get(route('shop.products.show', $product));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Shop/Products/Show')
                ->has('product')
            );
    });

    it('increments view count when viewing product', function () {
        $product = Product::factory()->create([
            'status' => ProductStatus::ACTIVE,
            'view_count' => 0,
        ]);

        $this->get(route('shop.products.show', $product));

        expect($product->fresh()->view_count)->toBe(1);
    });

    it('shows products by category', function () {
        $category = Category::factory()->create(['is_active' => true]);
        Product::factory()->count(3)->create([
            'category_id' => $category->id,
            'status' => ProductStatus::ACTIVE,
        ]);
        $otherCategory = Category::factory()->create();
        Product::factory()->create([
            'status' => ProductStatus::ACTIVE,
            'category_id' => $otherCategory->id,
        ]); // Different category

        $response = $this->get(route('shop.products.category', $category));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Shop/Products/Index')
                ->has('products.data', 3)
                ->has('currentCategory')
            );
    });

    it('filters products by name', function () {
        Product::factory()->create([
            'name' => 'Kursi Makan',
            'status' => ProductStatus::ACTIVE,
        ]);
        Product::factory()->create([
            'name' => 'Meja Tamu',
            'status' => ProductStatus::ACTIVE,
        ]);

        $response = $this->get(route('shop.products.index', ['filter[name]' => 'Kursi']));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page->has('products.data', 1));
    });

    it('sorts products by price', function () {
        Product::factory()->create([
            'name' => 'Expensive',
            'price' => 500000,
            'status' => ProductStatus::ACTIVE,
        ]);
        Product::factory()->create([
            'name' => 'Cheap',
            'price' => 100000,
            'status' => ProductStatus::ACTIVE,
        ]);

        $response = $this->get(route('shop.products.index', ['sort' => 'price']));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('products.data', 2)
                ->where('products.data.0.name', 'Cheap')
            );
    });

    it('shows related products on product page', function () {
        $category = Category::factory()->create();
        $product = Product::factory()->create([
            'category_id' => $category->id,
            'status' => ProductStatus::ACTIVE,
        ]);
        // Create 4 related products (controller limits to 4)
        $relatedProducts = Product::factory()->count(4)->create([
            'category_id' => $category->id,
            'status' => ProductStatus::ACTIVE,
        ]);

        // Verify products are created correctly
        expect($relatedProducts)->toHaveCount(4);
        expect(Product::where('category_id', $category->id)->where('status', ProductStatus::ACTIVE)->count())->toBe(5);

        $response = $this->get(route('shop.products.show', $product));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page->has('relatedProducts'));
    });
});

