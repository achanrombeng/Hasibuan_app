<?php

declare(strict_types=1);

namespace App\Actions\Order;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CreateOrderAction
{
    /**
     * @param  array<string, mixed>  $shippingData
     */
    public function execute(User $user, Cart $cart, array $shippingData): Order
    {
        return DB::transaction(function () use ($user, $cart, $shippingData) {
            $subtotal = $cart->subtotal;
            $shippingCost = $shippingData['shipping_cost'] ?? 0;
            $discount = $shippingData['discount_amount'] ?? 0;
            $total = $subtotal - $discount + $shippingCost;

            /** @var Order $order */
            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => Order::generateOrderNumber(),
                'status' => OrderStatus::PENDING,
                'payment_status' => PaymentStatus::PENDING,
                'payment_method' => PaymentMethod::from($shippingData['payment_method']),
                'subtotal' => $subtotal,
                'discount_amount' => $discount,
                'shipping_cost' => $shippingCost,
                'tax_amount' => 0,
                'total' => $total,
                'coupon_code' => $shippingData['coupon_code'] ?? null,
                'shipping_name' => $shippingData['shipping_name'],
                'shipping_phone' => $shippingData['shipping_phone'],
                'shipping_email' => $shippingData['shipping_email'],
                'shipping_address' => $shippingData['shipping_address'],
                'shipping_city' => $shippingData['shipping_city'],
                'shipping_province' => $shippingData['shipping_province'],
                'shipping_postal_code' => $shippingData['shipping_postal_code'],
                'shipping_method' => $shippingData['shipping_method'],
                'customer_notes' => $shippingData['customer_notes'] ?? null,
            ]);

            // Create order items from cart
            /** @var \Illuminate\Database\Eloquent\Collection<int, \App\Models\CartItem> $cartItems */
            $cartItems = $cart->items;

            foreach ($cartItems as $cartItem) {
                OrderItem::fromCartItem($order, $cartItem);

                // Reduce stock
                /** @var Product $product */
                $product = $cartItem->product;
                if ($product->track_stock) {
                    $product->reduceStock($cartItem->quantity);
                }
            }

            // Clear the cart
            $cart->items()->delete();

            // Notify all admin users
            $order->load('items');
            $admins = User::role('admin')->get();
            foreach ($admins as $admin) {
                $admin->notify(new \App\Notifications\NewOrderNotification($order));
            }

            return $order->fresh()->load('items');
        });
    }
}
