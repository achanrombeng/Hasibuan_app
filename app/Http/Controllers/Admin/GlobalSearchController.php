<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class GlobalSearchController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->input('query');

        if (! $query) {
            return response()->json([
                'products' => [],
                'users' => [],
                'orders' => [],
            ]);
        }

        $val = '%' . mb_strtolower(trim((string) $query), 'UTF-8') . '%';

        $products = Product::where(function ($q) use ($val) {
            $q->whereRaw('LOWER(name) LIKE ?', [$val])
                ->orWhereRaw('LOWER(sku) LIKE ?', [$val]);
        })
            ->limit(5)
            ->get(['id', 'name', 'slug', 'sku']);

        $users = User::role('customer') // Only search customers
            ->where(function ($q) use ($val) {
                $q->whereRaw('LOWER(name) LIKE ?', [$val])
                    ->orWhereRaw('LOWER(email) LIKE ?', [$val]);
            })
            ->limit(5)
            ->get(['id', 'name', 'email', 'avatar']);

        $orders = Order::whereRaw('LOWER(order_number) LIKE ?', [$val])
            ->limit(5)
            ->get(['id', 'order_number', 'grand_total', 'status', 'created_at']);

        return response()->json([
            'products' => $products,
            'users' => $users,
            'orders' => $orders,
        ]);
    }
}
