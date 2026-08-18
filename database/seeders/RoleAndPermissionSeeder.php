<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // Product permissions
            'view products',
            'create products',
            'edit products',
            'delete products',
            'manage product stock',

            // Category permissions
            'view categories',
            'create categories',
            'edit categories',
            'delete categories',

            // Order permissions
            'view orders',
            'create orders',
            'edit orders',
            'delete orders',
            'process orders',
            'cancel orders',

            // User permissions
            'view users',
            'create users',
            'edit users',
            'delete users',

            // Review permissions
            'view reviews',
            'approve reviews',
            'delete reviews',

            // Article permissions
            'view articles',
            'create articles',
            'edit articles',
            'delete articles',

            // Report permissions
            'view reports',
            'export reports',

            // Settings permissions
            'manage settings',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and assign permissions
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->syncPermissions(Permission::all());

        $managerRole = Role::firstOrCreate(['name' => 'manager']);
        $managerRole->syncPermissions([
            'view products',
            'create products',
            'edit products',
            'manage product stock',
            'view categories',
            'create categories',
            'edit categories',
            'view orders',
            'edit orders',
            'process orders',
            'view users',
            'view reviews',
            'approve reviews',
            'view articles',
            'create articles',
            'edit articles',
            'view reports',
        ]);

        $staffRole = Role::firstOrCreate(['name' => 'staff']);
        $staffRole->syncPermissions([
            'view products',
            'manage product stock',
            'view categories',
            'view orders',
            'process orders',
            'view reviews',
        ]);

        Role::firstOrCreate(['name' => 'customer']);
    }
}
