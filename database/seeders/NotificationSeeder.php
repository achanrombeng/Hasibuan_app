<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class NotificationSeeder extends Seeder
{
  public function run()
  {
    $user = User::first(); // Assuming the first user is admin

    if (!$user)
      return;

    $notifications = [
      [
        'id' => Str::uuid()->toString(),
        'type' => 'App\Notifications\NewOrderNotification',
        'notifiable_type' => 'App\Models\User',
        'notifiable_id' => $user->id,
        'data' => json_encode([
          'title' => 'Pesanan Baru #ORD-001',
          'message' => 'Pesanan baru dari Budi Santoso sebesar Rp 1.500.000',
          'link' => '/admin/orders/1'
        ]),
        'read_at' => null,
        'created_at' => now(),
        'updated_at' => now(),
      ],
      [
        'id' => Str::uuid()->toString(),
        'type' => 'App\Notifications\LowStockNotification',
        'notifiable_type' => 'App\Models\User',
        'notifiable_id' => $user->id,
        'data' => json_encode([
          'title' => 'Stok Menipis',
          'message' => 'Produk "Kursi Tamu Jati" tersisa 2 item',
          'link' => '/admin/products/1'
        ]),
        'read_at' => null,
        'created_at' => now()->subHours(1),
        'updated_at' => now()->subHours(1),
      ],
      [
        'id' => Str::uuid()->toString(),
        'type' => 'App\Notifications\NewReviewNotification',
        'notifiable_type' => 'App\Models\User',
        'notifiable_id' => $user->id,
        'data' => json_encode([
          'title' => 'Ulasan Baru',
          'message' => 'Ulasan bintang 5 baru untuk "Meja Makan Minimalis"',
          'link' => '/admin/reviews/1'
        ]),
        'read_at' => now()->subDays(1),
        'created_at' => now()->subDays(1),
        'updated_at' => now()->subDays(1),
      ],
    ];

    DB::table('notifications')->insert($notifications);
  }
}
