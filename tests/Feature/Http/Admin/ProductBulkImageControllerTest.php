<?php

declare(strict_types=1);

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Permission;

beforeEach(function () {
    $this->withoutVite();
    config(['inertia.testing.ensure_pages_exist' => false]);
    Storage::fake('public');

    Permission::firstOrCreate(['name' => 'view products', 'guard_name' => 'web']);
    Permission::firstOrCreate(['name' => 'edit products', 'guard_name' => 'web']);
});

describe('Admin ProductBulkImageController', function () {
    it('matches filenames to existing product SKUs', function () {
        $admin = createAdmin();
        $admin->givePermissionTo('edit products');

        $category = Category::factory()->create();
        $product = Product::factory()->create([
            'sku' => 'CHAIR-001',
            'name' => 'Minimalist Chair',
            'category_id' => $category->id,
        ]);

        $response = $this->actingAs($admin)->postJson('/admin/products/bulk-images/match', [
            'filenames' => [
                'CHAIR-001.jpg',
                'CHAIR-001_front.png',
                'UNKNOWN-999.jpg',
            ],
        ]);

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'matches' => [
                    [
                        'filename' => 'CHAIR-001.jpg',
                        'detected_sku' => 'CHAIR-001',
                        'matched' => true,
                        'product' => [
                            'id' => $product->id,
                            'sku' => 'CHAIR-001',
                        ],
                    ],
                    [
                        'filename' => 'CHAIR-001_front.png',
                        'detected_sku' => 'CHAIR-001',
                        'matched' => true,
                        'product' => [
                            'id' => $product->id,
                            'sku' => 'CHAIR-001',
                        ],
                    ],
                    [
                        'filename' => 'UNKNOWN-999.jpg',
                        'matched' => false,
                        'product' => null,
                    ],
                ],
            ]);
    });

    it('searches products for manual image reassignment', function () {
        $admin = createAdmin();
        $admin->givePermissionTo('edit products');

        $product = Product::factory()->create([
            'sku' => 'SOFA-NORDIC',
            'name' => 'Nordic Fabric Sofa',
        ]);

        $response = $this->actingAs($admin)->getJson('/admin/products/bulk-images/search?q=nordic');

        $response->assertOk()
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonFragment([
                'id' => $product->id,
                'sku' => 'SOFA-NORDIC',
            ]);
    });

    it('uploads multiple image files and attaches them to products', function () {
        $admin = createAdmin();
        $admin->givePermissionTo('edit products');

        $product = Product::factory()->create([
            'sku' => 'TBL-001',
            'name' => 'Dining Table',
        ]);

        $file1 = UploadedFile::fake()->image('TBL-001.jpg', 400, 400);
        $file2 = UploadedFile::fake()->image('TBL-001_2.jpg', 400, 400);

        $response = $this->actingAs($admin)->post('/admin/products/bulk-images/upload', [
            'images' => [$file1, $file2],
            'mappings' => json_encode([
                'TBL-001.jpg' => $product->id,
                'TBL-001_2.jpg' => $product->id,
            ]),
        ]);

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'report' => [
                    'total' => 2,
                    'successful' => 2,
                    'failed' => 0,
                ],
            ]);

        $product->refresh();
        expect($product->images()->count())->toBe(2);
        expect($product->primary_image)->not->toBeNull();
    });

    it('uploads a zip archive with sku-named images', function () {
        $admin = createAdmin();
        $admin->givePermissionTo('edit products');

        $product1 = Product::factory()->create(['sku' => 'BED-100', 'name' => 'Queen Bed']);
        $product2 = Product::factory()->create(['sku' => 'DESK-200', 'name' => 'Study Desk']);

        // Create temporary zip archive
        $zipPath = tempnam(sys_get_temp_dir(), 'test_zip_') . '.zip';
        $zip = new ZipArchive();
        $zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE);

        // Add dummy images to zip
        $imgContent = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==');
        $zip->addFromString('BED-100.png', $imgContent);
        $zip->addFromString('DESK-200.png', $imgContent);
        $zip->close();

        $zipUploaded = new UploadedFile($zipPath, 'products_pack.zip', 'application/zip', null, true);

        $response = $this->actingAs($admin)->post('/admin/products/bulk-images/upload', [
            'zip_file' => $zipUploaded,
            'mappings' => json_encode([]),
        ]);

        if (file_exists($zipPath)) {
            @unlink($zipPath);
        }

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'report' => [
                    'total' => 2,
                    'successful' => 2,
                    'failed' => 0,
                ],
            ]);

        expect($product1->images()->count())->toBe(1);
        expect($product2->images()->count())->toBe(1);
    });

    it('handles macOS zip archives with nested folders and mac metadata', function () {
        $admin = createAdmin();
        $admin->givePermissionTo('edit products');

        $product = Product::factory()->create(['sku' => 'ROF-MLDDNCR', 'name' => 'Malibu Dining Chair']);

        $zipPath = tempnam(sys_get_temp_dir(), 'test_mac_zip_') . '.zip';
        $zip = new ZipArchive();
        $zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE);

        $imgContent = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==');
        $zip->addFromString('ROF-MLDDNCR/1.png', $imgContent);
        $zip->addFromString('ROF-MLDDNCR/2.png', $imgContent);
        $zip->addFromString('__MACOSX/._ROF-MLDDNCR', 'dummy metadata');
        $zip->addFromString('ROF-MLDDNCR/.DS_Store', 'dummy store');
        $zip->close();

        $zipUploaded = new UploadedFile($zipPath, 'ROF-MLDDNCR.zip', 'application/zip', null, true);

        $response = $this->actingAs($admin)->post('/admin/products/bulk-images/upload', [
            'zip_file' => $zipUploaded,
            'mappings' => json_encode([]),
        ]);

        if (file_exists($zipPath)) {
            @unlink($zipPath);
        }

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'report' => [
                    'total' => 2,
                    'successful' => 2,
                    'failed' => 0,
                ],
            ]);

        $product->refresh();
        expect($product->images()->count())->toBe(2);
    });
});
