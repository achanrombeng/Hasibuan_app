<?php

declare(strict_types=1);

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;

describe('Cart Model', function () {
    it('can be created for user', function () {
        $user = User::factory()->create();
        $cart = Cart::factory()->create(['user_id' => $user->id]);

        expect($cart)->toBeInstanceOf(Cart::class)
            ->and($cart->user_id)->toBe($user->id);
    });

    it('can be created for guest with session', function () {
        $cart = Cart::factory()->create([
            'user_id' => null,
            'session_id' => 'test-session-id',
        ]);

        expect($cart->user_id)->toBeNull()
            ->and($cart->session_id)->toBe('test-session-id');
    });

    it('belongs to user', function () {
        $user = User::factory()->create();
        $cart = Cart::factory()->create(['user_id' => $user->id]);

        expect($cart->user)->toBeInstanceOf(User::class)
            ->and($cart->user->id)->toBe($user->id);
    });

    it('has many items', function () {
        $cart = Cart::factory()->create();

        // Create 3 different products for 3 cart items (unique constraint)
        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_id' => Product::factory()->create()->id,
        ]);
        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_id' => Product::factory()->create()->id,
        ]);
        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_id' => Product::factory()->create()->id,
        ]);

        expect($cart->items)->toHaveCount(3);
    });

    it('calculates subtotal correctly', function () {
        $cart = Cart::factory()->create();
        $product1 = Product::factory()->create(['price' => 100000]);
        $product2 = Product::factory()->create(['price' => 200000]);

        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_id' => $product1->id,
            'quantity' => 2,
            'unit_price' => 100000,
        ]);

        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_id' => $product2->id,
            'quantity' => 1,
            'unit_price' => 200000,
        ]);

        expect($cart->fresh()->subtotal)->toBe(400000);
    });

    it('calculates total items count', function () {
        $cart = Cart::factory()->create();
        $product = Product::factory()->create();

        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 3,
        ]);

        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_id' => Product::factory()->create()->id,
            'quantity' => 2,
        ]);

        expect($cart->fresh()->item_count)->toBe(5);
    });
});

describe('CartItem Model', function () {
    it('belongs to cart', function () {
        $cart = Cart::factory()->create();
        $product = Product::factory()->create();
        $item = CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
        ]);

        expect($item->cart)->toBeInstanceOf(Cart::class)
            ->and($item->cart->id)->toBe($cart->id);
    });

    it('belongs to product', function () {
        $cart = Cart::factory()->create();
        $product = Product::factory()->create();
        $item = CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
        ]);

        expect($item->product)->toBeInstanceOf(Product::class)
            ->and($item->product->id)->toBe($product->id);
    });

    it('calculates subtotal correctly', function () {
        $cart = Cart::factory()->create();
        $product = Product::factory()->create(['price' => 150000]);
        $item = CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 3,
            'unit_price' => 150000,
        ]);

        expect($item->subtotal)->toBe(450000);
    });
});

