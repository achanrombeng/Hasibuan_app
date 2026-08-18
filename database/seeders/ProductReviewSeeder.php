<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProductReviewSeeder extends Seeder
{
  public function run(): void
  {
    $users = User::role('customer')->get();
    $products = Product::all();

    if ($users->isEmpty() || $products->isEmpty()) {
      $this->command->warn('No customers or products found. Skipping ProductReviewSeeder.');
      return;
    }

    foreach ($products as $product) {
      // Randomly decide how many reviews a product gets (0 to 5)
      $reviewCount = rand(0, 5);

      for ($i = 0; $i < $reviewCount; $i++) {
        $user = $users->random();

        // Check if user already reviewed this product
        if (ProductReview::where('product_id', $product->id)->where('user_id', $user->id)->exists()) {
          continue;
        }

        // Try to find a verified order for this user and product
        $order = Order::where('user_id', $user->id)
          ->whereHas('items', function ($query) use ($product) {
            $query->where('product_id', $product->id);
          })
          ->where('status', 'delivered')
          ->first();

        ProductReview::factory()->create([
          'product_id' => $product->id,
          'user_id' => $user->id,
          'order_id' => $order?->id,
          'is_verified_purchase' => (bool) $order,
          'is_approved' => fake()->boolean(80), // 80% approved
        ]);
      }
    }
  }
}
