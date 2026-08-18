<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Actions\Order\UpdateAdminOrderAction;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\OrderUpdateRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\Query\OrderQuery;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller implements HasMiddleware
{
    /** @return array<int, Middleware> */
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view orders', only: ['index', 'show']),
            new Middleware('permission:edit orders', only: ['update']),
        ];
    }

    public function index(Request $request): Response
    {
        $orders = OrderQuery::admin($request)
            ->latest()
            ->paginate($request->input('per_page', 15))
            ->onEachSide(1)
            ->withQueryString();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => OrderResource::collection($orders),
            'filters' => $request->only(['filter', 'sort']),
            'statuses' => collect(OrderStatus::cases())->map(fn($status) => [
                'value' => $status->value,
                'name' => $status->label(),
            ])->all(),
            'paymentStatuses' => collect(PaymentStatus::cases())->map(fn($status) => [
                'value' => $status->value,
                'name' => $status->label(),
            ])->all(),
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load(['user', 'items.product.images']);

        return Inertia::render('Admin/Orders/Show', [
            'order' => (new OrderResource($order))->resolve(),
            'statuses' => collect(OrderStatus::cases())->map(fn($status) => [
                'value' => $status->value,
                'name' => $status->label(),
            ])->all(),
            'paymentStatuses' => collect(PaymentStatus::cases())->map(fn($status) => [
                'value' => $status->value,
                'name' => $status->label(),
            ])->all(),
        ]);
    }

    public function update(
        OrderUpdateRequest $request,
        Order $order,
        UpdateAdminOrderAction $action
    ): RedirectResponse {
        try {
            $action->execute($order, $request->validated());

            return redirect()
                ->route('admin.orders.show', $order)
                ->with('success', __('messages.order_updated'));
        } catch (\InvalidArgumentException $e) {
            return redirect()
                ->route('admin.orders.show', $order)
                ->with('error', $e->getMessage());
        }
    }
}
