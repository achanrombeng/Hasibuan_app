<?php

declare(strict_types=1);

use App\Enums\ProductStatus;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
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

    it('creates new product as draft when no images are provided', function () {
        $admin = createAdmin();
        $admin->givePermissionTo('create products');
        $category = Category::factory()->create();

        $response = $this->actingAs($admin)->post(route('admin.products.store'), [
            'name' => 'Kursi Makan Modern',
            'sku' => 'KRS-001',
            'description' => 'Kursi makan dengan desain modern',
            'category_id' => $category->id,
            'status' => ProductStatus::ACTIVE->value,
            'track_stock' => true,
        ]);

        $response->assertRedirect(route('admin.products.index'))
            ->assertSessionHas('success');

        $created = Product::where('sku', 'KRS-001')->first();
        expect($created)->not->toBeNull();
        expect($created->status)->toBe(ProductStatus::DRAFT);
    });

    it('creates new product as active when image is provided', function () {
        Storage::fake('public');
        $admin = createAdmin();
        $admin->givePermissionTo('create products');
        $category = Category::factory()->create();

        $image = UploadedFile::fake()->image('chair.jpg', 600, 600);

        $response = $this->actingAs($admin)->post(route('admin.products.store'), [
            'name' => 'Kursi Makan Mewah',
            'sku' => 'KRS-002',
            'description' => 'Kursi makan mewah',
            'category_id' => $category->id,
            'status' => ProductStatus::ACTIVE->value,
            'track_stock' => true,
            'images' => [$image],
        ]);

        $response->assertRedirect(route('admin.products.index'))
            ->assertSessionHas('success');

        $created = Product::where('sku', 'KRS-002')->first();
        expect($created)->not->toBeNull();
        expect($created->status)->toBe(ProductStatus::ACTIVE);
        expect($created->images()->count())->toBe(1);
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

    it('updates product and forces draft if all images deleted', function () {
        Storage::fake('public');
        $admin = createAdmin();
        $admin->givePermissionTo('edit products');
        $product = Product::factory()->create(['name' => 'Old Name', 'status' => ProductStatus::ACTIVE]);
        $image = ProductImage::create([
            'product_id' => $product->id,
            'image_path' => 'products/sample.jpg',
            'sort_order' => 0,
            'is_primary' => true,
        ]);
        $category = Category::factory()->create();

        $response = $this->actingAs($admin)->put(route('admin.products.update', $product), [
            'name' => 'New Name',
            'sku' => $product->sku,
            'description' => 'Updated description',
            'category_id' => $category->id,
            'status' => ProductStatus::ACTIVE->value,
            'track_stock' => $product->track_stock,
            'delete_images' => [$image->id],
        ]);

        $response->assertRedirect(route('admin.products.index'))
            ->assertSessionHas('success');

        expect($product->fresh()->name)->toBe('New Name');
        expect($product->fresh()->status)->toBe(ProductStatus::DRAFT);
    });

    it('updates product and redirects to return_url if provided', function () {
        Storage::fake('public');
        $admin = createAdmin();
        $admin->givePermissionTo('edit products');
        $product = Product::factory()->create(['name' => 'Old Name', 'status' => ProductStatus::DRAFT]);
        $category = Category::factory()->create();

        $returnUrl = '/admin/products?filter%5Bname%5D=kursi&page=2';

        $response = $this->actingAs($admin)->put(route('admin.products.update', $product), [
            'name' => 'Updated Name',
            'sku' => $product->sku,
            'description' => 'Updated description',
            'category_id' => $category->id,
            'status' => ProductStatus::DRAFT->value,
            'track_stock' => $product->track_stock,
            'return_url' => $returnUrl,
        ]);

        $response->assertRedirect($returnUrl)
            ->assertSessionHas('success');

        expect($product->fresh()->name)->toBe('Updated Name');
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

    it('sets product to draft when its last image is deleted via model', function () {
        $product = Product::factory()->create(['status' => ProductStatus::ACTIVE]);
        $image = ProductImage::create([
            'product_id' => $product->id,
            'image_path' => 'products/test.jpg',
            'sort_order' => 0,
            'is_primary' => true,
        ]);

        expect($product->fresh()->status)->toBe(ProductStatus::ACTIVE);

        $image->delete();

        expect($product->fresh()->status)->toBe(ProductStatus::DRAFT);
    });
});
