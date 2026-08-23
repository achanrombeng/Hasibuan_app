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
        // 11 Categories sorted alphabetically A-Z
        $productCategories = [
            ['name' => 'Accessories', 'description' => 'Luxury accessories and home decor', 'is_featured' => true],
            ['name' => 'Bar Sets', 'description' => 'Outdoor bar tables and bar stools', 'is_featured' => true],
            ['name' => 'Chairs', 'description' => 'Chairs, armchairs, and dining seating', 'is_featured' => true],
            ['name' => 'Collections', 'description' => 'Signature furniture collections', 'is_featured' => true],
            ['name' => 'Comfort Products', 'description' => 'Daybeds, loungers, and comfort seating', 'is_featured' => true],
            ['name' => 'Corner Sets', 'description' => 'Modular L-shape corner sofa sets', 'is_featured' => true],
            ['name' => 'Dining Sets', 'description' => 'Outdoor and indoor dining sets', 'is_featured' => true],
            ['name' => 'Flooring', 'description' => 'Teak decking tiles and flooring', 'is_featured' => true],
            ['name' => 'Natural Rattan', 'description' => 'Handcrafted natural rattan furniture', 'is_featured' => true],
            ['name' => 'Sun Loungers', 'description' => 'Poolside sunbeds and loungers', 'is_featured' => true],
            ['name' => 'Tables', 'description' => 'Dining tables, side tables, and coffee tables', 'is_featured' => true],
        ];

        $sortOrder = 1;

        foreach ($productCategories as $categoryData) {
            Category::updateOrCreate(
                ['slug' => Str::slug($categoryData['name'])],
                [
                    'name' => $categoryData['name'],
                    'description' => $categoryData['description'],
                    'is_active' => true,
                    'is_featured' => $categoryData['is_featured'],
                    'sort_order' => $sortOrder++,
                    'meta_title' => $categoryData['name'].' - Ronica Outdoor Furniture',
                    'meta_description' => $categoryData['description'],
                ]
            );
        }
    }
}
