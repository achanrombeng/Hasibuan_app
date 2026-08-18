<?php

declare(strict_types=1);

use App\Models\Category;
use Illuminate\Foundation\Vite;
use Spatie\Permission\Models\Permission;

beforeEach(function () {
    // Disable Vite for testing (frontend not built yet)
    $this->withoutVite();

    // Disable Inertia page existence check (frontend not built yet)
    config(['inertia.testing.ensure_pages_exist' => false]);

    // Create permissions
    Permission::firstOrCreate(['name' => 'view categories', 'guard_name' => 'web']);
    Permission::firstOrCreate(['name' => 'create categories', 'guard_name' => 'web']);
    Permission::firstOrCreate(['name' => 'edit categories', 'guard_name' => 'web']);
    Permission::firstOrCreate(['name' => 'delete categories', 'guard_name' => 'web']);
});

describe('Admin CategoryController', function () {
    it('requires authentication', function () {
        $response = $this->get(route('admin.categories.index'));

        $response->assertRedirect(route('login'));
    });

    it('requires admin role', function () {
        $user = createCustomer();

        $response = $this->actingAs($user)->get(route('admin.categories.index'));

        $response->assertForbidden();
    });

    it('shows categories list for admin', function () {
        $admin = createAdmin();
        $admin->givePermissionTo('view categories');
        // Create root categories (no parent)
        Category::factory()->count(5)->create(['parent_id' => null]);

        $response = $this->actingAs($admin)->get(route('admin.categories.index'));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Categories/Index')
                ->has('categories.data', 5)
            );
    });

    it('shows create category form', function () {
        $admin = createAdmin();
        $admin->givePermissionTo('create categories');

        $response = $this->actingAs($admin)->get(route('admin.categories.create'));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Categories/Create'));
    });

    it('creates new category', function () {
        $admin = createAdmin();
        $admin->givePermissionTo('create categories');

        $response = $this->actingAs($admin)->post(route('admin.categories.store'), [
            'name' => 'Kursi',
            'description' => 'Kategori kursi',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        $response->assertRedirect(route('admin.categories.index'))
            ->assertSessionHas('success');

        expect(Category::where('name', 'Kursi')->exists())->toBeTrue();
    });

    it('validates category name is required', function () {
        $admin = createAdmin();
        $admin->givePermissionTo('create categories');

        $response = $this->actingAs($admin)->post(route('admin.categories.store'), [
            'name' => '',
        ]);

        $response->assertSessionHasErrors(['name']);
    });

    it('shows edit category form', function () {
        $admin = createAdmin();
        $admin->givePermissionTo('edit categories');
        $category = Category::factory()->create();

        $response = $this->actingAs($admin)->get(route('admin.categories.edit', $category));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Categories/Edit')
                ->has('category')
            );
    });

    it('updates category', function () {
        $admin = createAdmin();
        $admin->givePermissionTo('edit categories');
        $category = Category::factory()->create(['name' => 'Old Name']);

        $response = $this->actingAs($admin)->put(route('admin.categories.update', $category), [
            'name' => 'New Name',
            'description' => 'Updated description',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        $response->assertRedirect(route('admin.categories.index'))
            ->assertSessionHas('success');

        expect($category->fresh()->name)->toBe('New Name');
    });

    it('deletes category', function () {
        $admin = createAdmin();
        $admin->givePermissionTo('delete categories');
        $category = Category::factory()->create();

        $response = $this->actingAs($admin)->delete(route('admin.categories.destroy', $category));

        $response->assertRedirect(route('admin.categories.index'))
            ->assertSessionHas('success');

        expect(Category::find($category->id))->toBeNull();
    });

    it('prevents deleting category with products', function () {
        $admin = createAdmin();
        $admin->givePermissionTo('delete categories');
        $category = Category::factory()->hasProducts(3)->create();

        $response = $this->actingAs($admin)->delete(route('admin.categories.destroy', $category));

        $response->assertRedirect(route('admin.categories.index'))
            ->assertSessionHas('error');

        expect(Category::find($category->id))->not->toBeNull();
    });
});

