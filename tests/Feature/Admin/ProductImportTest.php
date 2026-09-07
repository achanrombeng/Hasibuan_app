<?php

declare(strict_types=1);

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    // Create admin role and permission
    $role = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    $permCreate = Permission::firstOrCreate(['name' => 'create products', 'guard_name' => 'web']);
    $permView = Permission::firstOrCreate(['name' => 'view products', 'guard_name' => 'web']);
    $role->givePermissionTo([$permCreate, $permView]);

    $this->admin = User::factory()->create();
    $this->admin->assignRole('admin');
});

test('admin can download product import template in xlsx and csv format', function () {
    $response = $this->actingAs($this->admin)
        ->get(route('admin.products.import.template', ['format' => 'xlsx']));

    $response->assertOk();
    $response->assertHeader('content-disposition');

    $csvResponse = $this->actingAs($this->admin)
        ->get(route('admin.products.import.template', ['format' => 'csv']));

    $csvResponse->assertOk();
});

test('admin can import products via csv upload', function () {
    $csvContent = "sku,name,category,material,color\n";
    $csvContent .= "TEST-001,Test Kursi Kayu,Chairs,Kayu Jati,Natural Wood\n";
    $csvContent .= "TEST-002,Test Meja Makan,Dining Sets,Solid Teak,Coklat\n";

    $file = UploadedFile::fake()->createWithContent('products.csv', $csvContent);

    $response = $this->actingAs($this->admin)
        ->postJson(route('admin.products.import'), [
            'file' => $file,
            'update_existing' => 1,
        ]);

    $response->assertOk();
    $response->assertJson([
        'success' => true,
    ]);

    expect(Product::where('sku', 'TEST-001')->exists())->toBeTrue();
    expect(Product::where('sku', 'TEST-002')->exists())->toBeTrue();
});

test('importing product without sku generates sku with 2-letter category prefix and 5-letter product abbreviation', function () {
    $csvContent = "sku,name,category\n";
    $csvContent .= ",Sofa Minimalis Outdoor,Living Set\n";
    $csvContent .= ",Meja Makan Scandinavian,Dining Sets\n";

    $file = UploadedFile::fake()->createWithContent('products_no_sku.csv', $csvContent);

    $response = $this->actingAs($this->admin)
        ->postJson(route('admin.products.import'), [
            'file' => $file,
        ]);

    $response->assertOk();
    $response->assertJson(['success' => true]);

    $sofaProduct = Product::where('name->id', 'Sofa Minimalis Outdoor')->first();
    expect($sofaProduct)->not->toBeNull();
    // "Living Set" -> "LS", "Sofa Minimalis Outdoor" -> "SOMIO"
    expect($sofaProduct->sku)->toBe('LS-SOMIO');

    $tableProduct = Product::where('name->id', 'Meja Makan Scandinavian')->first();
    expect($tableProduct)->not->toBeNull();
    // "Dining Sets" -> "DS", "Meja Makan Scandinavian" -> "MEMAS"
    expect($tableProduct->sku)->toBe('DS-MEMAS');
});

test('admin can search products by SKU', function () {
    $category = Category::factory()->create();
    $product1 = Product::factory()->create([
        'category_id' => $category->id,
        'name' => 'Meja Makan Jati',
        'sku' => 'EOF-LRADNTB',
    ]);
    $product2 = Product::factory()->create([
        'category_id' => $category->id,
        'name' => 'Kursi Santai Teras',
        'sku' => 'EOF-DNLVCR',
    ]);

    // Search by SKU in filter[name]
    $response = $this->actingAs($this->admin)
        ->get(route('admin.products.index', ['filter' => ['name' => 'EOF-LRADNTB']]));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Products/Index')
        ->has('products.data', 1)
        ->where('products.data.0.sku', 'EOF-LRADNTB')
    );

    // Search by partial SKU
    $partialResponse = $this->actingAs($this->admin)
        ->get(route('admin.products.index', ['filter' => ['name' => 'DNLVCR']]));

    $partialResponse->assertOk();
    $partialResponse->assertInertia(fn ($page) => $page
        ->component('Admin/Products/Index')
        ->has('products.data', 1)
        ->where('products.data.0.sku', 'EOF-DNLVCR')
    );
});
