import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, router } from '@inertiajs/react';
import {
    Calendar,
    DollarSign,
    Download,
    ShoppingCart,
    Users,
} from 'lucide-react';

interface ReportsIndexProps {
    summary: {
        totalSales: string;
        totalOrders: number;
        averageOrderValue: string;
        totalCustomers: number;
    };
    salesByDay: Array<{ date: string; total: number; orders: number }>;
    topProducts: Array<{
        id: number;
        name: string;
        total_sold: number;
        revenue: string;
    }>;
    topCustomers: Array<{
        id: number;
        name: string;
        email: string;
        orders_count: number;
        total_spent: string;
    }>;
    ordersByStatus: Array<{ status: string; label: string; count: number }>;
    period: string;
}

export default function ReportsIndex({
    summary,
    salesByDay,
    topProducts,
    topCustomers,
    period,
}: ReportsIndexProps) {
    const handlePeriodChange = (newPeriod: string) => {
        router.get(
            '/admin/reports',
            { period: newPeriod },
            { preserveState: true },
        );
    };

    return (
        <AdminLayout
            breadcrumbs={[{ title: 'Laporan', href: '/admin/reports' }]}
        >
            <Head title="Laporan & Analitik" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-terra-900">
                            Laporan & Analitik
                        </h1>
                        <p className="mt-1 text-terra-500">
                            Pantau performa toko Anda
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={period}
                            onChange={(e) => handlePeriodChange(e.target.value)}
                            className="rounded-xl border border-terra-200 bg-sand-50 px-4 py-2.5 text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                        >
                            <option value="week">7 Hari Terakhir</option>
                            <option value="month">30 Hari Terakhir</option>
                            <option value="year">Tahun Ini</option>
                        </select>
                        <button className="inline-flex items-center gap-2 rounded-xl bg-wood-dark px-4 py-2.5 text-white transition-colors">
                            <Download className="h-4 w-4" />
                            Export
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                            <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-terra-500">
                                Total Penjualan
                            </p>
                            <p className="mt-1 text-2xl font-bold text-terra-900">
                                {summary.totalSales}
                            </p>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                            <ShoppingCart className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-terra-500">
                                Total Pesanan
                            </p>
                            <p className="mt-1 text-2xl font-bold text-terra-900">
                                {summary.totalOrders}
                            </p>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-wood/10">
                            <DollarSign className="h-6 w-6 text-wood" />
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-terra-500">
                                Rata-rata Pesanan
                            </p>
                            <p className="mt-1 text-2xl font-bold text-terra-900">
                                {summary.averageOrderValue}
                            </p>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">
                            <Users className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-terra-500">
                                Total Pelanggan
                            </p>
                            <p className="mt-1 text-2xl font-bold text-terra-900">
                                {summary.totalCustomers}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Top Products */}
                    <div className="rounded-2xl border border-terra-100 bg-white shadow-sm">
                        <div className="border-b border-terra-100 p-6">
                            <h2 className="text-lg font-semibold text-terra-900">
                                Produk Terlaris
                            </h2>
                        </div>
                        <div className="divide-y divide-terra-100">
                            {topProducts.length === 0 ? (
                                <div className="p-6 text-center text-terra-500">
                                    Belum ada data
                                </div>
                            ) : (
                                topProducts.map((product, index) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center gap-4 p-4"
                                    >
                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-terra-100 text-sm font-medium text-terra-600">
                                            {index + 1}
                                        </span>
                                        <div className="flex-1">
                                            <p className="font-medium text-terra-900">
                                                {product.name}
                                            </p>
                                            <p className="text-sm text-terra-500">
                                                {product.total_sold} terjual
                                            </p>
                                        </div>
                                        <p className="font-medium text-terra-900">
                                            {product.revenue}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Sales by Day */}
                    <div className="rounded-2xl border border-terra-100 bg-white shadow-sm">
                        <div className="border-b border-terra-100 p-6">
                            <h2 className="text-lg font-semibold text-terra-900">
                                Penjualan Harian
                            </h2>
                        </div>
                        <div className="max-h-96 divide-y divide-terra-100 overflow-y-auto">
                            {salesByDay.length === 0 ? (
                                <div className="p-6 text-center text-terra-500">
                                    Belum ada data
                                </div>
                            ) : (
                                salesByDay.map((sale) => (
                                    <div
                                        key={sale.date}
                                        className="flex items-center justify-between p-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-5 w-5 text-terra-400" />
                                            <span className="text-terra-900">
                                                {sale.date}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-terra-900">
                                                Rp{' '}
                                                {sale.total.toLocaleString(
                                                    'id-ID',
                                                )}
                                            </p>
                                            <p className="text-sm text-terra-500">
                                                {sale.orders} pesanan
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Top Customers */}
                <div className="rounded-2xl border border-terra-100 bg-white shadow-sm">
                    <div className="border-b border-terra-100 p-6">
                        <h2 className="text-lg font-semibold text-terra-900">
                            Pelanggan Terbaik
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-terra-100 bg-sand-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-terra-600">
                                        #
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-terra-600">
                                        Pelanggan
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-terra-600">
                                        Pesanan
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-terra-600">
                                        Total Belanja
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-terra-100">
                                {topCustomers.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="py-6 text-center text-terra-500"
                                        >
                                            Belum ada data
                                        </td>
                                    </tr>
                                ) : (
                                    topCustomers.map((customer, index) => (
                                        <tr
                                            key={customer.id}
                                            className="hover:bg-sand-50/50"
                                        >
                                            <td className="px-6 py-3 text-terra-600">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-3">
                                                <p className="font-medium text-terra-900">
                                                    {customer.name}
                                                </p>
                                                <p className="text-sm text-terra-500">
                                                    {customer.email}
                                                </p>
                                            </td>
                                            <td className="px-6 py-3 text-terra-900">
                                                {customer.orders_count}
                                            </td>
                                            <td className="px-6 py-3 font-medium text-terra-900">
                                                {customer.total_spent}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
