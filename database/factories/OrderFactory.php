<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    protected $model = Order::class;

    /** @var array<int, string> */
    private array $cities = [
        'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang',
        'Makassar', 'Palembang', 'Tangerang', 'Depok', 'Bekasi',
    ];

    /** @var array<int, string> */
    private array $provinces = [
        'DKI Jakarta', 'Jawa Barat', 'Jawa Timur', 'Jawa Tengah',
        'Sumatera Utara', 'Sulawesi Selatan', 'Sumatera Selatan', 'Banten',
    ];

    public function definition(): array
    {
        $subtotal = $this->faker->numberBetween(1000000, 20000000);
        $shippingCost = $this->faker->randomElement([0, 25000, 50000, 75000, 100000]);
        $discount = $this->faker->boolean(30) ? (int) ($subtotal * 0.1) : 0;

        return [
            'user_id' => User::factory(),
            'order_number' => Order::generateOrderNumber(),
            'status' => OrderStatus::PENDING,
            'payment_status' => PaymentStatus::PENDING,
            'payment_method' => $this->faker->randomElement(PaymentMethod::cases()),
            'subtotal' => $subtotal,
            'discount_amount' => $discount,
            'shipping_cost' => $shippingCost,
            'tax_amount' => 0,
            'total' => $subtotal - $discount + $shippingCost,
            'coupon_code' => $discount > 0 ? 'DISKON10' : null,
            'shipping_name' => $this->faker->name(),
            'shipping_phone' => $this->faker->phoneNumber(),
            'shipping_email' => $this->faker->email(),
            'shipping_address' => $this->faker->streetAddress(),
            'shipping_city' => $this->faker->randomElement($this->cities),
            'shipping_province' => $this->faker->randomElement($this->provinces),
            'shipping_postal_code' => $this->faker->postcode(),
            'shipping_method' => $this->faker->randomElement(['JNE REG', 'JNE YES', 'J&T', 'SiCepat']),
            'tracking_number' => null,
            'customer_notes' => $this->faker->boolean(30) ? $this->faker->sentence() : null,
            'admin_notes' => null,
        ];
    }

    public function pending(): static
    {
        return $this->state(fn () => [
            'status' => OrderStatus::PENDING,
            'payment_status' => PaymentStatus::PENDING,
        ]);
    }

    public function confirmed(): static
    {
        return $this->state(fn () => [
            'status' => OrderStatus::CONFIRMED,
            'payment_status' => PaymentStatus::PAID,
            'paid_at' => now(),
        ]);
    }

    public function processing(): static
    {
        return $this->state(fn () => [
            'status' => OrderStatus::PROCESSING,
            'payment_status' => PaymentStatus::PAID,
            'paid_at' => now()->subHours(2),
        ]);
    }

    public function shipped(): static
    {
        return $this->state(fn () => [
            'status' => OrderStatus::SHIPPED,
            'payment_status' => PaymentStatus::PAID,
            'paid_at' => now()->subDays(2),
            'shipped_at' => now()->subDay(),
            'tracking_number' => strtoupper($this->faker->bothify('??########')),
        ]);
    }

    public function delivered(): static
    {
        return $this->state(fn () => [
            'status' => OrderStatus::DELIVERED,
            'payment_status' => PaymentStatus::PAID,
            'paid_at' => now()->subDays(5),
            'shipped_at' => now()->subDays(3),
            'delivered_at' => now()->subDay(),
            'tracking_number' => strtoupper($this->faker->bothify('??########')),
        ]);
    }

    public function cancelled(): static
    {
        return $this->state(fn () => [
            'status' => OrderStatus::CANCELLED,
            'cancelled_at' => now(),
            'cancellation_reason' => 'Dibatalkan oleh customer',
        ]);
    }
}
