<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Cart;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Cart>
 */
class CartFactory extends Factory
{
    protected $model = Cart::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'session_id' => null,
        ];
    }

    /**
     * Cart untuk guest (tanpa user).
     */
    public function guest(): static
    {
        return $this->state(fn () => [
            'user_id' => null,
            'session_id' => Str::random(40),
        ]);
    }

    /**
     * Cart dengan session ID tertentu.
     */
    public function withSession(string $sessionId): static
    {
        return $this->state(fn () => [
            'user_id' => null,
            'session_id' => $sessionId,
        ]);
    }
}

