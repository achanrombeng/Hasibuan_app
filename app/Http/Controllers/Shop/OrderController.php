<?php

declare(strict_types=1);

namespace App\Http\Controllers\Shop;

use App\Actions\Order\CancelOrderAction;
use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller implements HasMiddleware
{
    /** @return array<int, Middleware> */
    public static function middleware(): array
    {
        return [
            new Middleware('auth'),
        ];
    }

    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        $orders = $user->orders()
            ->with('items.product.images')
            ->latest()
            ->paginate(10);

        return Inertia::render('Shop/Orders/Index', [
            'orders' => OrderResource::collection($orders),
        ]);
    }

    public function show(Request $request, Order $order): Response|RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        // Ensure user can only view their own orders
        if ($order->user_id !== $user->id) {
            abort(403, 'Anda tidak memiliki akses ke pesanan ini.');
        }

        $order->load('items.product.images');

        return Inertia::render('Shop/Orders/Show', [
            'order' => (new OrderResource($order))->resolve(),
            'paymentSettings' => [
                'bank_name' => Setting::get('bank_name', 'BCA'),
                'bank_account_number' => Setting::get('bank_account_number', ''),
                'bank_account_name' => Setting::get('bank_account_name', ''),
                'cod_fee' => (int) Setting::get('cod_fee', '5000'),
                'payment_deadline_hours' => (int) Setting::get('payment_deadline_hours', '24'),
                'whatsapp' => Setting::get('contact_whatsapp', ''),
            ],
        ]);
    }

    public function cancel(Request $request, Order $order, CancelOrderAction $action): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        // Ensure user can only cancel their own orders
        if ($order->user_id !== $user->id) {
            abort(403, 'Anda tidak memiliki akses ke pesanan ini.');
        }

        try {
            $action->execute($order, 'Dibatalkan oleh pelanggan');

            return redirect()
                ->route('shop.orders.show', $order)
                ->with('success', __('messages.order_cancelled'));
        } catch (\InvalidArgumentException $e) {
            return redirect()
                ->route('shop.orders.show', $order)
                ->with('error', $e->getMessage());
        }
    }
}
