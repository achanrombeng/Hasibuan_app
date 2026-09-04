<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // 11 Categories sorted alphabetically A-Z with bilingual support
        $productCategories = [
            [
                'name' => ['en' => 'Accessories', 'id' => 'Aksesoris'],
                'description' => ['en' => 'Luxury accessories and home decor', 'id' => 'Aksesoris mewah dan dekorasi rumah'],
                'is_featured' => true,
            ],
            [
                'name' => ['en' => 'Bar Sets', 'id' => 'Set Bar'],
                'description' => ['en' => 'Outdoor bar tables and bar stools', 'id' => 'Meja dan kursi bar outdoor'],
                'is_featured' => true,
            ],
            [
                'name' => ['en' => 'Chairs', 'id' => 'Kursi'],
                'description' => ['en' => 'Chairs, armchairs, and dining seating', 'id' => 'Kursi makan, armchair, dan kursi santai'],
                'is_featured' => true,
            ],
            [
                'name' => ['en' => 'Collections', 'id' => 'Koleksi'],
                'description' => ['en' => 'Signature furniture collections', 'id' => 'Koleksi furniture signature'],
                'is_featured' => true,
            ],
            [
                'name' => ['en' => 'Comfort Products', 'id' => 'Produk Kenyamanan'],
                'description' => ['en' => 'Daybeds, loungers, and comfort seating', 'id' => 'Daybed, lounger, dan tempat duduk santai'],
                'is_featured' => true,
            ],
            [
                'name' => ['en' => 'Corner Sets', 'id' => 'Set Sudut / Modular'],
                'description' => ['en' => 'Modular L-shape corner sofa sets', 'id' => 'Set sofa sudut modular model L'],
                'is_featured' => true,
            ],
            [
                'name' => ['en' => 'Dining Sets', 'id' => 'Set Meja Makan'],
                'description' => ['en' => 'Outdoor and indoor dining sets', 'id' => 'Set meja makan outdoor dan indoor'],
                'is_featured' => true,
            ],
            [
                'name' => ['en' => 'Flooring', 'id' => 'Lantai Decking'],
                'description' => ['en' => 'Teak decking tiles and flooring', 'id' => 'Ubin kayu jati dan lantai decking outdoor'],
                'is_featured' => true,
            ],
            [
                'name' => ['en' => 'Natural Rattan', 'id' => 'Rotan Alami'],
                'description' => ['en' => 'Handcrafted natural rattan furniture', 'id' => 'Furniture rotan alami buatan tangan'],
                'is_featured' => true,
            ],
            [
                'name' => ['en' => 'Sun Loungers', 'id' => 'Kursi Santai Kolam'],
                'description' => ['en' => 'Poolside sunbeds and loungers', 'id' => 'Sunbed dan kursi santai tepi kolam renang'],
                'is_featured' => true,
            ],
            [
                'name' => ['en' => 'Tables', 'id' => 'Meja'],
                'description' => ['en' => 'Dining tables, side tables, and coffee tables', 'id' => 'Meja makan, meja samping, dan meja tamu'],
                'is_featured' => true,
            ],
        ];

        $sortOrder = 1;

        foreach ($productCategories as $categoryData) {
            $slug = Str::slug($categoryData['name']['en']);
            Category::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $categoryData['name'],
                    'description' => $categoryData['description'],
                    'is_active' => true,
                    'is_featured' => $categoryData['is_featured'],
                    'sort_order' => $sortOrder++,
                    'meta_title' => [
                        'en' => $categoryData['name']['en'].' - Ronica Outdoor Furniture',
                        'id' => $categoryData['name']['id'].' - Ronica Outdoor Furniture',
                    ],
                    'meta_description' => $categoryData['description'],
                ]
            );
        }
    }
}
