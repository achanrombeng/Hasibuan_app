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

    if (!$query) {
      return response()->json([
        'products' => [],
        'users' => [],
        'orders' => [],
      ]);
    }

    $products = Product::where('name', 'like', "%{$query}%")
      ->limit(5)
      ->get(['id', 'name', 'slug', 'image']);

    $users = User::role('customer') // Only search customers
      ->where(function ($q) use ($query) {
        $q->where('name', 'like', "%{$query}%")
          ->orWhere('email', 'like', "%{$query}%");
      })
      ->limit(5)
      ->get(['id', 'name', 'email', 'avatar']);

    $orders = Order::where('order_number', 'like', "%{$query}%")
      ->limit(5)
      ->get(['id', 'order_number', 'grand_total', 'status', 'created_at']);

    return response()->json([
      'products' => $products,
      'users' => $users,
      'orders' => $orders,
    ]);
  }
}
