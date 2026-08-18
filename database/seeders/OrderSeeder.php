<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
  public function run(): void
  {
    $users = User::role('customer')->get();
    $products = Product::all();

    if ($users->isEmpty() || $products->isEmpty()) {
      $this->command->warn('No customers or products found. Skipping OrderSeeder.');
      return;
    }

    // Create orders for each user
    foreach ($users as $user) {
      // 1-3 orders per user
      $orderCount = rand(1, 3);

      for ($i = 0; $i < $orderCount; $i++) {
        $status = fake()->randomElement(['pending', 'processing', 'shipped', 'delivered', 'cancelled']);

        $order = Order::factory()
          ->{$status}() // Use the state method corresponding to the status
            ->create([
              'user_id' => $user->id,
            ]);

        // 1-5 items per order
        $itemCount = rand(1, 5);
        $orderProducts = $products->random($itemCount);
        $subtotal = 0;

        foreach ($orderProducts as $product) {
          $quantity = rand(1, 3);
          $price = $product->final_price ?? $product->price;
          $rowTotal = $price * $quantity;
          $subtotal += $rowTotal;

          OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'product_name' => $product->name,
            'product_sku' => $product->sku,
            'quantity' => $quantity,
            'unit_price' => $price,
            'subtotal' => $rowTotal,
          ]);
        }

        // Update order totals
        $order->update([
          'subtotal' => $subtotal,
          'total' => $subtotal - $order->discount_amount + $order->shipping_cost,
        ]);
      }
    }
  }
}
