<?php

declare(strict_types=1);

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;

beforeEach(function () {
    // Disable Vite for testing (frontend not built yet)
    $this->withoutVite();

    // Disable Inertia page existence check (frontend not built yet)
    config(['inertia.testing.ensure_pages_exist' => false]);
});

describe('CartController', function () {
    it('shows cart page', function () {
        $response = $this->get(route('shop.cart.index'));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page->component('Shop/Cart/Index'));
    });

    it('adds product to cart for guest', function () {
        $product = Product::factory()->create([
            'price' => 100000,
            'track_stock' => true,
            'stock_quantity' => 10,
        ]);

        $response = $this->postJson(route('shop.cart.store'), [
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $response->assertOk()
            ->assertJson(['message' => 'Produk berhasil ditambahkan ke keranjang.']);

        expect(CartItem::where('product_id', $product->id)->exists())->toBeTrue();
    });

    it('adds product to cart for authenticated user', function () {
        $user = User::factory()->create();
        $product = Product::factory()->create(['price' => 100000]);

        $response = $this->actingAs($user)->postJson(route('shop.cart.store'), [
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        $response->assertOk();

        expect(Cart::where('user_id', $user->id)->exists())->toBeTrue();
    });

    it('validates quantity when adding to cart', function () {
        $product = Product::factory()->create(['price' => 100000]);

        $response = $this->postJson(route('shop.cart.store'), [
            'product_id' => $product->id,
            'quantity' => 0,
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['quantity']);
    });

    it('validates product exists when adding to cart', function () {
        $response = $this->postJson(route('shop.cart.store'), [
            'product_id' => 99999,
            'quantity' => 1,
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['product_id']);
    });

    it('updates cart item quantity', function () {
        $cart = Cart::factory()->create(['session_id' => session()->getId()]);
        $product = Product::factory()->create(['price' => 100000]);
        $cartItem = CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $response = $this->putJson(route('shop.cart.update', $cartItem), [
            'quantity' => 5,
        ]);

        $response->assertOk()
            ->assertJson(['message' => 'Keranjang berhasil diperbarui.']);

        expect($cartItem->fresh()->quantity)->toBe(5);
    });

    it('removes item from cart', function () {
        $cart = Cart::factory()->create(['session_id' => session()->getId()]);
        $product = Product::factory()->create();
        $cartItem = CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
        ]);

        $response = $this->deleteJson(route('shop.cart.destroy', $cartItem));

        $response->assertOk()
            ->assertJson(['message' => 'Produk berhasil dihapus dari keranjang.']);

        expect(CartItem::find($cartItem->id))->toBeNull();
    });

    it('clears entire cart', function () {
        $user = User::factory()->create();
        $cart = Cart::factory()->create(['user_id' => $user->id]);
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

        $response = $this->actingAs($user)->deleteJson(route('shop.cart.clear'));

        $response->assertOk()
            ->assertJson(['message' => 'Keranjang berhasil dikosongkan.']);

        expect($cart->fresh()->items)->toHaveCount(0);
    });

    it('merges guest cart to user cart after login', function () {
        $user = User::factory()->create();
        $product = Product::factory()->create(['price' => 100000]);

        // Create guest cart
        $guestCart = Cart::factory()->create(['session_id' => session()->getId()]);
        CartItem::factory()->create([
            'cart_id' => $guestCart->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'unit_price' => 100000,
        ]);

        $response = $this->actingAs($user)->postJson(route('shop.cart.merge'));

        $response->assertOk()
            ->assertJson(['message' => 'Keranjang berhasil digabungkan.']);

        expect(Cart::where('user_id', $user->id)->exists())->toBeTrue();
    });
});

