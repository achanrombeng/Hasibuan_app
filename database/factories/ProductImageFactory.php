<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductImage>
 */
class ProductImageFactory extends Factory
{
    protected $model = ProductImage::class;

    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'image_path' => 'products/placeholder-'.$this->faker->numberBetween(1, 10).'.jpg',
            'alt_text' => $this->faker->sentence(3),
            'sort_order' => $this->faker->numberBetween(1, 10),
            'is_primary' => false,
        ];
    }

    public function primary(): static
    {
        return $this->state(fn () => [
            'is_primary' => true,
            'sort_order' => 0,
        ]);
    }
}
