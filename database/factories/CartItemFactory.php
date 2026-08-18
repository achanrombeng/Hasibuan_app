<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CartItem>
 */
class CartItemFactory extends Factory
{
    protected $model = CartItem::class;

    public function definition(): array
    {
        $product = Product::factory()->create();

        return [
            'cart_id' => Cart::factory(),
            'product_id' => $product->id,
            'quantity' => $this->faker->numberBetween(1, 5),
            'unit_price' => $product->price,
        ];
    }

    /**
     * Cart item dengan product tertentu.
     */
    public function forProduct(Product $product): static
    {
        return $this->state(fn () => [
            'product_id' => $product->id,
            'unit_price' => $product->price,
        ]);
    }

    /**
     * Cart item dengan quantity tertentu.
     */
    public function quantity(int $quantity): static
    {
        return $this->state(fn () => [
            'quantity' => $quantity,
        ]);
    }
}

