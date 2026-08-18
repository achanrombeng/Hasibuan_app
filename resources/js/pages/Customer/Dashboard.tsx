import CustomerLayout from '@/layouts/customer/customer-layout';
import { Head, Link } from '@inertiajs/react';
import { Package, Heart, ShoppingBag, Clock, CheckCircle, ArrowRight } from 'lucide-react';

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
                <div className="bg-gradient-to-r from-terra-900 to-terra-700 rounded-2xl p-6 text-white">
                    <h1 className="text-2xl font-bold mb-2">Selamat Datang!</h1>
                    <p className="text-terra-100">Kelola pesanan dan akun Anda di sini.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-terra-100">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Package className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-terra-900">{stats.totalOrders}</p>
                        <p className="text-sm text-terra-500">Total Pesanan</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-terra-100">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Clock className="w-5 h-5 text-yellow-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-terra-900">{stats.pendingOrders}</p>
                        <p className="text-sm text-terra-500">Dalam Proses</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-terra-100">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-terra-900">{stats.completedOrders}</p>
                        <p className="text-sm text-terra-500">Selesai</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-terra-100">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <Heart className="w-5 h-5 text-red-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-terra-900">{stats.wishlistCount}</p>
                        <p className="text-sm text-terra-500">Wishlist</p>
                    </div>
                </div>

                {/* Total Spent */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-terra-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-terra-500 mb-1">Total Belanja</p>
                            <p className="text-3xl font-bold text-terra-900">{stats.totalSpent}</p>
                        </div>
                        <div className="p-4 bg-terra-100 rounded-xl">
                            <ShoppingBag className="w-8 h-8 text-terra-600" />
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-sm border border-terra-100 overflow-hidden">
                    <div className="p-5 border-b border-terra-100 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-terra-900">Pesanan Terbaru</h2>
                        <Link href="/shop/orders" className="text-sm text-wood hover:text-wood-dark flex items-center gap-1">
                            Lihat Semua <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    {recentOrders.length > 0 ? (
                        <div className="divide-y divide-terra-100">
                            {recentOrders.map((order) => (
                                <Link
                                    key={order.id}
                                    href={`/shop/orders/${order.id}`}
                                    className="flex items-center justify-between p-4 hover:bg-sand-50 transition-colors"
                                >
                                    <div>
                                        <p className="font-medium text-terra-900">{order.order_number}</p>
                                        <p className="text-sm text-terra-500">{order.created_at}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-terra-900">{order.total}</p>
                                        <span className={`inline-block px-2 py-1 text-xs rounded-lg ${order.status.color}`}>
                                            {order.status.label}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <Package className="w-12 h-12 mx-auto text-terra-300 mb-3" />
                            <p className="text-terra-500">Belum ada pesanan</p>
                            <Link href="/shop/products" className="inline-block mt-4 px-4 py-2 bg-terra-900 text-white rounded-lg hover:bg-terra-800 transition-colors">
                                Mulai Belanja
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
}

