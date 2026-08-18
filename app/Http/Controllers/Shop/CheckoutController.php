<?php

declare(strict_types=1);

namespace App\Http\Controllers\Shop;

use App\Actions\Checkout\ResolveShippingAddressAction;
use App\Actions\Order\CreateOrderAction;
use App\Enums\PaymentMethod;
use App\Http\Controllers\Controller;
use App\Http\Requests\Shop\CheckoutRequest;
use App\Http\Resources\AddressResource;
use App\Http\Resources\CartResource;
use App\Http\Resources\OrderResource;
use App\Models\Cart;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller implements HasMiddleware
{
    /** @return array<int, Middleware> */
    public static function middleware(): array
    {
        return [
            new Middleware('auth'),
        ];
    }

    public function index(Request $request): Response|RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        /** @var Cart|null $cart */
        $cart = $user->cart?->load('items.product.images');

        if (! $cart || $cart->items->isEmpty()) {
            return redirect()
                ->route('shop.cart.index')
                ->with('error', __('messages.cart_empty'));
        }

        $addresses = $user->addresses()->orderByDesc('is_default')->get();

        $codFee = (int) Setting::get('cod_fee', '5000');

        return Inertia::render('Shop/Checkout/Index', [
            'cart' => (new CartResource($cart))->resolve(),
            'addresses' => AddressResource::collection($addresses)->resolve(),
            'paymentMethods' => collect([
                PaymentMethod::MIDTRANS,
                PaymentMethod::WHATSAPP,
            ])->map(fn ($method) => [
                'value' => $method->value,
                'name' => $method->label(),
                'description' => $method->description(),
                'fee' => $method === PaymentMethod::COD ? $codFee : 0,
            ])->all(),
            'paymentSettings' => [
                'cod_fee' => $codFee,
                'payment_deadline_hours' => (int) Setting::get('payment_deadline_hours', '24'),
            ],
        ]);
    }

    public function store(
        CheckoutRequest $request,
        CreateOrderAction $createOrderAction,
        ResolveShippingAddressAction $resolveAddressAction,
        \App\Services\Payment\MidtransService $midtransService
    ): RedirectResponse {
        /** @var User $user */
        $user = $request->user();

        /** @var Cart|null $cart */
        $cart = $user->cart?->load('items.product');

        if (! $cart || $cart->items->isEmpty()) {
            return redirect()
                ->route('shop.cart.index')
                ->with('error', __('messages.cart_empty'));
        }

        $validated = $request->validated();

        $shippingData = $resolveAddressAction->execute($user, $validated);

        // Use shipping cost from frontend (already calculated via RajaOngkir API)
        $shippingData['shipping_cost'] = $validated['shipping_cost'];
        $shippingData['shipping_method'] = $validated['shipping_method'];

        $order = $createOrderAction->execute($user, $cart, $shippingData);

        // Handle Midtrans Payment
        if ($order->payment_method === PaymentMethod::MIDTRANS) {
            try {
                $snapToken = $midtransService->getSnapToken($order);
                $order->update(['snap_token' => $snapToken]);
            } catch (\Exception $e) {
                return redirect()
                    ->route('shop.orders.show', $order)
                    ->with('error', __('messages.midtrans_error', ['error' => $e->getMessage()]));
            }
        }

        return redirect()
            ->route('shop.orders.show', $order)
            ->with('success', __('messages.order_created', ['order_number' => $order->order_number]));
    }

    public function success(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        $order = $user->orders()->latest()->first();

        return Inertia::render('Shop/Checkout/Success', [
            'order' => $order ? new OrderResource($order->load('items')) : null,
        ]);
    }
}
