<?php

declare(strict_types=1);

use App\Actions\Cart\AddToCartAction;
use App\Actions\Cart\ClearCartAction;
use App\Actions\Cart\MergeCartsAction;
use App\Actions\Cart\RemoveFromCartAction;
use App\Actions\Cart\UpdateCartItemAction;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;

describe('AddToCartAction', function () {
    it('creates new cart for guest', function () {
        $product = Product::factory()->create([
            'price' => 100000,
            'discount_percentage' => null, // No discount
        ]);
        $action = new AddToCartAction();

        $cartItem = $action->execute($product, 2, null, 'test-session');

        expect($cartItem)->toBeInstanceOf(CartItem::class)
            ->and($cartItem->quantity)->toBe(2)
            ->and($cartItem->unit_price)->toBe($product->final_price)
            ->and($cartItem->cart->session_id)->toBe('test-session')
            ->and($cartItem->cart->user_id)->toBeNull();
    });

    it('creates new cart for user', function () {
        $user = User::factory()->create();
        $product = Product::factory()->create(['price' => 150000]);
        $action = new AddToCartAction();

        $cartItem = $action->execute($product, 1, $user, 'test-session');

        expect($cartItem->cart->user_id)->toBe($user->id)
            ->and($cartItem->cart->session_id)->toBeNull();
    });

    it('adds to existing cart', function () {
        $user = User::factory()->create();
        $cart = Cart::factory()->create(['user_id' => $user->id]);
        $product = Product::factory()->create(['price' => 100000]);
        $action = new AddToCartAction();

        $cartItem = $action->execute($product, 3, $user, 'test-session');

        expect($cartItem->cart_id)->toBe($cart->id)
            ->and(Cart::count())->toBe(1);
    });

    it('updates quantity if product already in cart', function () {
        $user = User::factory()->create();
        $cart = Cart::factory()->create(['user_id' => $user->id]);
        $product = Product::factory()->create(['price' => 100000]);
        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $action = new AddToCartAction();
        $cartItem = $action->execute($product, 3, $user, 'test-session');

        expect($cartItem->quantity)->toBe(5)
            ->and(CartItem::count())->toBe(1);
    });
});

describe('UpdateCartItemAction', function () {
    it('updates cart item quantity', function () {
        $cart = Cart::factory()->create();
        $product = Product::factory()->create();
        $cartItem = CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $action = new UpdateCartItemAction();
        $action->execute($cartItem, 5);

        expect($cartItem->fresh()->quantity)->toBe(5);
    });
});

describe('RemoveFromCartAction', function () {
    it('removes item from cart', function () {
        $cart = Cart::factory()->create();
        $product = Product::factory()->create();
        $cartItem = CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
        ]);

        $action = new RemoveFromCartAction();
        $action->execute($cartItem);

        expect(CartItem::find($cartItem->id))->toBeNull();
    });
});

describe('ClearCartAction', function () {
    it('removes all items from cart', function () {
        $cart = Cart::factory()->create();
        // Create 3 different products for unique constraint
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

        $action = new ClearCartAction();
        $action->execute($cart);

        expect($cart->items()->count())->toBe(0);
    });
});

describe('MergeCartsAction', function () {
    it('merges guest cart into user cart', function () {
        $user = User::factory()->create();
        $product1 = Product::factory()->create(['price' => 100000]);
        $product2 = Product::factory()->create(['price' => 200000]);

        // Guest cart
        $guestCart = Cart::factory()->create([
            'user_id' => null,
            'session_id' => 'guest-session',
        ]);
        CartItem::factory()->create([
            'cart_id' => $guestCart->id,
            'product_id' => $product1->id,
            'quantity' => 2,
            'unit_price' => 100000,
        ]);

        // User cart
        $userCart = Cart::factory()->create(['user_id' => $user->id]);
        CartItem::factory()->create([
            'cart_id' => $userCart->id,
            'product_id' => $product2->id,
            'quantity' => 1,
            'unit_price' => 200000,
        ]);

        $action = new MergeCartsAction();
        $mergedCart = $action->execute($user, 'guest-session');

        expect($mergedCart->items)->toHaveCount(2)
            ->and(Cart::where('session_id', 'guest-session')->exists())->toBeFalse();
    });
});

