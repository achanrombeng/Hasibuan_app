<?php

declare(strict_types=1);

use App\Actions\Order\CancelOrderAction;
use App\Actions\Order\CreateOrderAction;
use App\Actions\Order\UpdateOrderStatusAction;
use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;

describe('CreateOrderAction', function () {
    it('creates order from cart', function () {
        $user = User::factory()->create();
        $cart = Cart::factory()->create(['user_id' => $user->id]);
        $product = Product::factory()->create([
            'price' => 100000,
            'track_stock' => true,
            'stock_quantity' => 10,
        ]);

        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'unit_price' => 100000,
        ]);

        $shippingData = [
            'shipping_name' => 'John Doe',
            'shipping_phone' => '081234567890',
            'shipping_email' => 'john@example.com',
            'shipping_address' => 'Jl. Test No. 123',
            'shipping_city' => 'Jakarta',
            'shipping_province' => 'DKI Jakarta',
            'shipping_postal_code' => '12345',
            'payment_method' => PaymentMethod::BANK_TRANSFER->value,
            'shipping_method' => 'regular',
        ];

        $action = new CreateOrderAction();
        $order = $action->execute($user, $cart, $shippingData);

        expect($order)->toBeInstanceOf(Order::class)
            ->and($order->user_id)->toBe($user->id)
            ->and($order->status)->toBe(OrderStatus::PENDING)
            ->and($order->items)->toHaveCount(1)
            ->and($order->subtotal)->toBe(200000)
            ->and($product->fresh()->stock_quantity)->toBe(8);
    });

    it('clears cart after order creation', function () {
        $user = User::factory()->create();
        $cart = Cart::factory()->create(['user_id' => $user->id]);
        $product = Product::factory()->create(['price' => 100000]);

        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 1,
            'unit_price' => 100000,
        ]);

        $shippingData = [
            'shipping_name' => 'John Doe',
            'shipping_phone' => '081234567890',
            'shipping_email' => 'john@example.com',
            'shipping_address' => 'Jl. Test No. 123',
            'shipping_city' => 'Jakarta',
            'shipping_province' => 'DKI Jakarta',
            'shipping_postal_code' => '12345',
            'payment_method' => PaymentMethod::BANK_TRANSFER->value,
            'shipping_method' => 'regular',
        ];

        $action = new CreateOrderAction();
        $action->execute($user, $cart, $shippingData);

        expect($cart->fresh()->items)->toHaveCount(0);
    });
});

describe('UpdateOrderStatusAction', function () {
    it('updates order status', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => OrderStatus::PENDING,
        ]);

        $action = new UpdateOrderStatusAction();
        $action->execute($order, OrderStatus::PROCESSING);

        expect($order->fresh()->status)->toBe(OrderStatus::PROCESSING);
    });

    it('sets shipped_at when status is shipped', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => OrderStatus::PROCESSING,
        ]);

        $action = new UpdateOrderStatusAction();
        $action->execute($order, OrderStatus::SHIPPED, 'TRACK123');

        expect($order->fresh()->status)->toBe(OrderStatus::SHIPPED)
            ->and($order->fresh()->tracking_number)->toBe('TRACK123')
            ->and($order->fresh()->shipped_at)->not->toBeNull();
    });

    it('sets delivered_at when status is delivered', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => OrderStatus::SHIPPED,
        ]);

        $action = new UpdateOrderStatusAction();
        $action->execute($order, OrderStatus::DELIVERED);

        expect($order->fresh()->status)->toBe(OrderStatus::DELIVERED)
            ->and($order->fresh()->delivered_at)->not->toBeNull();
    });
});

describe('CancelOrderAction', function () {
    it('cancels order and restores stock', function () {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'track_stock' => true,
            'stock_quantity' => 5,
        ]);
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => OrderStatus::PENDING,
        ]);
        $order->items()->create([
            'product_id' => $product->id,
            'product_name' => $product->name,
            'product_sku' => $product->sku,
            'quantity' => 3,
            'unit_price' => 100000,
            'subtotal' => 300000,
        ]);

        $action = new CancelOrderAction();
        $action->execute($order, 'Customer request');

        expect($order->fresh()->status)->toBe(OrderStatus::CANCELLED)
            ->and($order->fresh()->cancellation_reason)->toBe('Customer request')
            ->and($product->fresh()->stock_quantity)->toBe(8);
    });

    it('throws exception for non-cancellable order', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => OrderStatus::SHIPPED,
        ]);

        $action = new CancelOrderAction();

        expect(fn () => $action->execute($order, 'Test'))
            ->toThrow(InvalidArgumentException::class);
    });
});

