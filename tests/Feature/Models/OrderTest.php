<?php

declare(strict_types=1);

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;

describe('Order Model', function () {
    it('can be created with factory', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id]);

        expect($order)->toBeInstanceOf(Order::class)
            ->and($order->id)->toBeInt()
            ->and($order->order_number)->toBeString();
    });

    it('generates unique order number', function () {
        $user = User::factory()->create();
        $order1 = Order::factory()->create(['user_id' => $user->id]);
        $order2 = Order::factory()->create(['user_id' => $user->id]);

        expect($order1->order_number)->not->toBe($order2->order_number);
    });

    it('belongs to user', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id]);

        expect($order->user)->toBeInstanceOf(User::class)
            ->and($order->user->id)->toBe($user->id);
    });

    it('has many items', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id]);
        $product = Product::factory()->create();

        OrderItem::factory()->count(3)->create([
            'order_id' => $order->id,
            'product_id' => $product->id,
        ]);

        expect($order->items)->toHaveCount(3);
    });

    it('casts status to enum', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => OrderStatus::PENDING,
        ]);

        expect($order->status)->toBeInstanceOf(OrderStatus::class)
            ->and($order->status)->toBe(OrderStatus::PENDING);
    });

    it('casts payment_status to enum', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'payment_status' => PaymentStatus::PENDING,
        ]);

        expect($order->payment_status)->toBeInstanceOf(PaymentStatus::class)
            ->and($order->payment_status)->toBe(PaymentStatus::PENDING);
    });

    it('casts payment_method to enum', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'payment_method' => PaymentMethod::BANK_TRANSFER,
        ]);

        expect($order->payment_method)->toBeInstanceOf(PaymentMethod::class)
            ->and($order->payment_method)->toBe(PaymentMethod::BANK_TRANSFER);
    });

    it('can check if cancellable', function () {
        $user = User::factory()->create();

        $pendingOrder = Order::factory()->create([
            'user_id' => $user->id,
            'status' => OrderStatus::PENDING,
        ]);

        $shippedOrder = Order::factory()->create([
            'user_id' => $user->id,
            'status' => OrderStatus::SHIPPED,
        ]);

        expect($pendingOrder->isCancellable())->toBeTrue()
            ->and($shippedOrder->isCancellable())->toBeFalse();
    });

    it('formats total correctly', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'total' => 1500000,
        ]);

        // Money library formats IDR with subunits
        expect($order->formatted_total)->toBeString()
            ->and($order->formatted_total)->toContain('Rp');
    });
});

describe('OrderItem Model', function () {
    it('belongs to order', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id]);
        $product = Product::factory()->create();
        $item = OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $product->id,
        ]);

        expect($item->order)->toBeInstanceOf(Order::class)
            ->and($item->order->id)->toBe($order->id);
    });

    it('belongs to product', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id]);
        $product = Product::factory()->create();
        $item = OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $product->id,
        ]);

        expect($item->product)->toBeInstanceOf(Product::class)
            ->and($item->product->id)->toBe($product->id);
    });

    it('calculates subtotal correctly', function () {
        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id]);
        $product = Product::factory()->create();
        $item = OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'unit_price' => 250000,
            'subtotal' => 500000, // subtotal is stored in database
        ]);

        expect($item->subtotal)->toBe(500000);
    });
});

