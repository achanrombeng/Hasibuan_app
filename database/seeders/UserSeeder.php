<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Address;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'phone' => '081234567890',
            ]
        );
        if (!$admin->hasRole('admin')) {
            $admin->assignRole('admin');
        }

        // Create Manager
        $manager = User::firstOrCreate(
            ['email' => 'manager@example.com'],
            [
                'name' => 'Manager Toko',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'phone' => '081234567891',
            ]
        );
        if (!$manager->hasRole('manager')) {
            $manager->assignRole('manager');
        }

        // Create Staff
        $staff = User::firstOrCreate(
            ['email' => 'staff@example.com'],
            [
                'name' => 'Staff Gudang',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'phone' => '081234567892',
            ]
        );
        if (!$staff->hasRole('staff')) {
            $staff->assignRole('staff');
        }

        // Create Demo Customer
        $customer = User::firstOrCreate(
            ['email' => 'customer@example.com'],
            [
                'name' => 'Budi Santoso',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'phone' => '081234567893',
            ]
        );
        if (!$customer->hasRole('customer')) {
            $customer->assignRole('customer');
        }

        // Create address for customer if not exists
        if (!Address::where('user_id', $customer->id)->exists()) {
            Address::create([
                'user_id' => $customer->id,
                'label' => 'Rumah',
                'recipient_name' => 'Budi Santoso',
                'phone' => '081234567893',
                'address' => 'Jl. Sudirman No. 123',
                'city' => 'Jakarta Selatan',
                'province' => 'DKI Jakarta',
                'postal_code' => '12190',
                'district' => 'Setiabudi',
                'is_default' => true,
            ]);
        }

        // Create additional test customers
        User::factory()
            ->count(50)
            ->create()
            ->each(function (User $user) {
                $user->assignRole('customer');
                Address::factory()->default()->create(['user_id' => $user->id]);
            });
    }
}
