<?php

declare(strict_types=1);

use App\Models\Category;
use App\Models\Product;

describe('Category Model', function () {
    it('can be created with factory', function () {
        $category = Category::factory()->create();

        expect($category)->toBeInstanceOf(Category::class)
            ->and($category->id)->toBeInt()
            ->and($category->name)->toBeString()
            ->and($category->slug)->toBeString();
    });

    it('generates slug from name', function () {
        $category = Category::factory()->create(['name' => 'Kursi Makan']);

        expect($category->slug)->toBe('kursi-makan');
    });

    it('can have parent category', function () {
        $parent = Category::factory()->create(['name' => 'Furniture']);
        $child = Category::factory()->create([
            'name' => 'Kursi',
            'parent_id' => $parent->id,
        ]);

        expect($child->parent)->toBeInstanceOf(Category::class)
            ->and($child->parent->id)->toBe($parent->id);
    });

    it('can have children categories', function () {
        $parent = Category::factory()->create(['name' => 'Furniture']);
        Category::factory()->count(3)->create(['parent_id' => $parent->id]);

        expect($parent->children)->toHaveCount(3);
    });

    it('has many products', function () {
        $category = Category::factory()->create();
        Product::factory()->count(5)->create(['category_id' => $category->id]);

        expect($category->products)->toHaveCount(5);
    });

    it('scopes active categories', function () {
        Category::factory()->create(['is_active' => true]);
        Category::factory()->create(['is_active' => false]);

        expect(Category::active()->count())->toBe(1);
    });

    it('scopes root categories', function () {
        $parent = Category::factory()->create(['parent_id' => null]);
        Category::factory()->create(['parent_id' => $parent->id]);

        expect(Category::root()->count())->toBe(1);
    });

    it('orders by sort_order', function () {
        Category::factory()->create(['sort_order' => 3, 'name' => 'Third']);
        Category::factory()->create(['sort_order' => 1, 'name' => 'First']);
        Category::factory()->create(['sort_order' => 2, 'name' => 'Second']);

        $categories = Category::ordered()->get();

        expect($categories->first()->name)->toBe('First')
            ->and($categories->last()->name)->toBe('Third');
    });
});

