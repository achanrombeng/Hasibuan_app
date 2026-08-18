<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductReview;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductReview>
 */
class ProductReviewFactory extends Factory
{
    protected $model = ProductReview::class;

    /** @var array<int, string> */
    private array $reviewTitles = [
        'Produk sangat bagus!',
        'Sesuai ekspektasi',
        'Kualitas premium',
        'Recommended!',
        'Puas dengan pembelian ini',
        'Lumayan bagus',
        'Cukup memuaskan',
    ];

    public function definition(): array
    {
        $isApproved = $this->faker->boolean(80);

        return [
            'product_id' => Product::factory(),
            'user_id' => User::factory(),
            'order_id' => null,
            'rating' => $this->faker->numberBetween(3, 5),
            'title' => $this->faker->randomElement($this->reviewTitles),
            'comment' => $this->faker->paragraph(),
            'is_verified_purchase' => $this->faker->boolean(70),
            'is_approved' => $isApproved,
            'approved_at' => $isApproved ? $this->faker->dateTimeBetween('-1 month') : null,
        ];
    }

    public function approved(): static
    {
        return $this->state(fn () => [
            'is_approved' => true,
            'approved_at' => now(),
        ]);
    }

    public function pending(): static
    {
        return $this->state(fn () => [
            'is_approved' => false,
            'approved_at' => null,
        ]);
    }

    public function verifiedPurchase(): static
    {
        return $this->state(fn () => ['is_verified_purchase' => true]);
    }

    public function withRating(int $rating): static
    {
        return $this->state(fn () => ['rating' => $rating]);
    }
}
