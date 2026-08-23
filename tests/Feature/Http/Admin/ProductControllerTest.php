<?php

declare(strict_types=1);

use App\Enums\ProductStatus;
use App\Models\Category;
use App\Models\Product;
use Spatie\Permission\Models\Permission;

beforeEach(function () {
    // Disable Vite for testing (frontend not built yet)
    $this->withoutVite();

    // Disable Inertia page existence check (frontend not built yet)
    config(['inertia.testing.ensure_pages_exist' => false]);

    Permission::firstOrCreate(['name' => 'view products', 'guard_name' => 'web']);
    Permission::firstOrCreate(['name' => 'create products', 'guard_name' => 'web']);
    Permission::firstOrCreate(['name' => 'edit products', 'guard_name' => 'web']);
    Permission::firstOrCreate(['name' => 'delete products', 'guard_name' => 'web']);
});

describe('Admin ProductController', function () {
    it('requires authentication', function () {
        $response = $this->get(route('admin.products.index'));

        $response->assertRedirect(route('login'));
    });

    it('requires admin role', function () {
        $user = createCustomer();

        $response = $this->actingAs($user)->get(route('admin.products.index'));

        $response->assertForbidden();
    });

    it('shows products list for admin', function () {
        $admin = createAdmin();
        $admin->givePermissionTo('view products');
        Product::factory()->count(5)->create();

        $response = $this->actingAs($admin)->get(route('admin.products.index'));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Products/Index')
                ->has('products.data', 5)
            );
    });

    it('shows create product form', function () {
        $admin = createAdmin();
        $admin->givePermissionTo('create products');
        Category::factory()->create();

        $response = $this->actingAs($admin)->get(route('admin.products.create'));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Products/Create')
                ->has('categories')
            );
    });

    it('creates new product', function () {
        $admin = createAdmin();
        $admin->givePermissionTo('create products');
        $category = Category::factory()->create();

        $response = $this->actingAs($admin)->post(route('admin.products.store'), [
            'name' => 'Kursi Makan Modern',
            'sku' => 'KRS-001',
            'description' => 'Kursi makan dengan desain modern',
            'category_id' => $category->id,
            'price' => 1500000,
            'status' => ProductStatus::ACTIVE->value,
            'track_stock' => true,
            'stock_quantity' => 10,
        ]);

        $response->assertRedirect(route('admin.products.index'))
            ->assertSessionHas('success');

        expect(Product::where('sku', 'KRS-001')->exists())->toBeTrue();
    });

    it('validates product name is required', function () {
        $admin = createAdmin();
        $admin->givePermissionTo('create products');

        $response = $this->actingAs($admin)->post(route('admin.products.store'), [
            'name' => '',
        ]);

        $response->assertSessionHasErrors(['name']);
    });

    it('shows product details', function () {
        $admin = createAdmin();
        $admin->givePermissionTo('view products');
        $product = Product::factory()->create();

        $response = $this->actingAs($admin)->get(route('admin.products.show', $product));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Products/Show')
                ->has('product')
            );
    });

    it('shows edit product form', function () {
        $admin = createAdmin();
        $admin->givePermissionTo('edit products');
        $product = Product::factory()->create();

        $response = $this->actingAs($admin)->get(route('admin.products.edit', $product));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Products/Edit')
                ->has('product')
            );
    });

    it('updates product', function () {
        $admin = createAdmin();
        $admin->givePermissionTo('edit products');
        $product = Product::factory()->create(['name' => 'Old Name']);
        $category = Category::factory()->create();

        $response = $this->actingAs($admin)->put(route('admin.products.update', $product), [
            'name' => 'New Name',
            'sku' => $product->sku,
            'description' => 'Updated description',
            'category_id' => $category->id,
            'price' => 2000000,
            'status' => ProductStatus::ACTIVE->value,
            'track_stock' => $product->track_stock,
            'stock_quantity' => $product->stock_quantity,
        ]);

        $response->assertRedirect(route('admin.products.index'))
            ->assertSessionHas('success');

        expect($product->fresh()->name)->toBe('New Name');
    });

    it('deletes product', function () {
        $admin = createAdmin();
        $admin->givePermissionTo('delete products');
        $product = Product::factory()->create();

        $response = $this->actingAs($admin)->delete(route('admin.products.destroy', $product));

        $response->assertRedirect(route('admin.products.index'))
            ->assertSessionHas('success');

        expect(Product::find($product->id))->toBeNull();
    });

    it('filters products by status', function () {
        $admin = createAdmin();
        $admin->givePermissionTo('view products');
        Product::factory()->create(['status' => ProductStatus::ACTIVE]);
        Product::factory()->create(['status' => ProductStatus::DRAFT]);

        $response = $this->actingAs($admin)->get(route('admin.products.index', [
            'filter[status]' => ProductStatus::ACTIVE->value,
        ]));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page->has('products.data', 1));
    });
});
