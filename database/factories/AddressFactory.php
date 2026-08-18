<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Address;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Address>
 */
class AddressFactory extends Factory
{
    protected $model = Address::class;

    /** @var array<int, string> */
    private array $labels = ['Rumah', 'Kantor', 'Apartemen', 'Kos'];

    /** @var array<int, string> */
    private array $cities = [
        'Jakarta Selatan', 'Jakarta Pusat', 'Jakarta Barat', 'Jakarta Timur', 'Jakarta Utara',
        'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Makassar',
        'Tangerang', 'Depok', 'Bekasi', 'Bogor', 'Yogyakarta',
    ];

    /** @var array<int, string> */
    private array $provinces = [
        'DKI Jakarta', 'Jawa Barat', 'Jawa Timur', 'Jawa Tengah',
        'Sumatera Utara', 'Sulawesi Selatan', 'Banten', 'DI Yogyakarta',
    ];

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'label' => $this->faker->randomElement($this->labels),
            'recipient_name' => $this->faker->name(),
            'phone' => $this->faker->phoneNumber(),
            'address' => $this->faker->streetAddress(),
            'city' => $this->faker->randomElement($this->cities),
            'province' => $this->faker->randomElement($this->provinces),
            'postal_code' => $this->faker->postcode(),
            'district' => $this->faker->citySuffix(),
            'notes' => $this->faker->boolean(30) ? $this->faker->sentence() : null,
            'is_default' => false,
        ];
    }

    public function default(): static
    {
        return $this->state(fn () => ['is_default' => true]);
    }

    public function home(): static
    {
        return $this->state(fn () => ['label' => 'Rumah']);
    }

    public function office(): static
    {
        return $this->state(fn () => ['label' => 'Kantor']);
    }
}
