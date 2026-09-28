import CustomerLayout from '@/layouts/customer/customer-layout';
import { Head, Link } from '@inertiajs/react';
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Heart,
  Package,
  ShoppingBag,
} from 'lucide-react';

interface DashboardProps {
  stats: {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalSpent: string;
    wishlistCount: number;
  };
  recentOrders: Array<{
    id: number;
    order_number: string;
    total: string;
    status: {
      value: string;
      label: string;
      color: string;
    };
    created_at: string;
  }>;
}

export default function Dashboard({ stats, recentOrders }: DashboardProps) {
  return (
    <CustomerLayout>
      <Head title="Dashboard" />

      <div className="space-y-6">
        {/* Welcome */}
        <div className="rounded-2xl bg-gradient-to-r from-terra-900 to-terra-700 p-6 text-white">
          <h1 className="mb-2 text-2xl font-bold">Welcome Back!</h1>
          <p className="text-terra-100">
            Manage your orders and account settings here.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-xl border border-terra-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-terra-900">
              {stats.totalOrders}
            </p>
            <p className="text-sm text-terra-500">Total Orders</p>
          </div>
          <div className="rounded-xl border border-terra-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-lg bg-yellow-100 p-2">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-terra-900">
              {stats.pendingOrders}
            </p>
            <p className="text-sm text-terra-500">In Progress</p>
          </div>
          <div className="rounded-xl border border-terra-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-terra-900">
              {stats.completedOrders}
            </p>
            <p className="text-sm text-terra-500">Completed</p>
          </div>
          <div className="rounded-xl border border-terra-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-lg bg-red-100 p-2">
                <Heart className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-terra-900">
              {stats.wishlistCount}
            </p>
            <p className="text-sm text-terra-500">Wishlist</p>
          </div>
        </div>

        {/* Total Spent */}
        <div className="rounded-xl border border-terra-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm text-terra-500">Total Spent</p>
              <p className="text-3xl font-bold text-terra-900">
                {stats.totalSpent}
              </p>
            </div>
            <div className="rounded-xl bg-terra-100 p-4">
              <ShoppingBag className="h-8 w-8 text-terra-600" />
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="overflow-hidden rounded-xl border border-terra-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-terra-100 p-5">
            <h2 className="text-lg font-semibold text-terra-900">
              Recent Orders
            </h2>
            <Link
              href="/shop/orders"
              className="flex items-center gap-1 text-sm text-wood hover:text-wood-dark"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {recentOrders.length > 0 ? (
            <div className="divide-y divide-terra-100">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/shop/orders/${order.id}`}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-sand-50"
                >
                  <div>
                    <p className="font-medium text-terra-900">
                      {order.order_number}
                    </p>
                    <p className="text-sm text-terra-500">{order.created_at}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-terra-900">{order.total}</p>
                    <span
                      className={`inline-block rounded-lg px-2 py-1 text-xs ${order.status.color}`}
                    >
                      {order.status.label}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Package className="mx-auto mb-3 h-12 w-12 text-terra-300" />
              <p className="text-terra-500">No orders placed yet</p>
              <Link
                href="/shop/products"
                className="mt-4 inline-block rounded-lg bg-terra-900 px-4 py-2 text-white transition-colors hover:bg-terra-800"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
}
