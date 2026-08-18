import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Eye, Clock, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import Pagination from '@/components/pagination';

interface Order {
    id: number;
    order_number: string;
    user: { id: number; name: string; email: string } | null;
    total: number;
    total_formatted: string;
    status: { value: string; label: string; color: string };
    payment_status: { value: string; label: string; color: string };
    items: Array<{ id: number }>;
    created_at: string;
}

interface OrdersIndexProps {
    orders: {
        data: Order[];
        links: {
            first?: string;
            last?: string;
            prev?: string;
            next?: string;
        };
        meta: {
            current_page: number;
            last_page: number;
            from: number;
            to: number;
            total: number;
            links: Array<{ url: string | null; label: string; active: boolean }>;
        };
    };
    filters?: { filter?: Record<string, string> };
    statuses: Array<{ value: string; name: string }>;
    paymentStatuses: Array<{ value: string; name: string }>;
}

const statusIcons: Record<string, React.ElementType> = {
    pending: Clock,
    processing: Package,
    shipped: Truck,
    delivered: CheckCircle,
    completed: CheckCircle,
    cancelled: XCircle,
};

export default function OrdersIndex({ orders, filters, statuses }: OrdersIndexProps) {
    // Safely get filter values - check if filter is an object
    const filterObj = filters?.filter && typeof filters.filter === 'object' ? filters.filter : {};
    const [search, setSearch] = useState(filterObj.order_number || '');
    const [statusFilter, setStatusFilter] = useState(filterObj.status || '');
    const orderData = orders.data;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params: Record<string, string> = {};
        if (search) params['filter[order_number]'] = search;
        if (statusFilter) params['filter[status]'] = statusFilter;
        router.get('/admin/orders', params, { preserveState: true });
    };

    return (
        <AdminLayout breadcrumbs={[{ title: 'Pesanan', href: '/admin/orders' }]}>
            <Head title="Kelola Pesanan" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-terra-900">Kelola Pesanan</h1>
                    <p className="text-terra-500 mt-1">Kelola semua pesanan pelanggan</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-terra-100">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-terra-400" />
                            <input
                                type="text"
                                placeholder="Cari nomor pesanan atau nama pelanggan..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 placeholder:text-terra-400 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2.5 rounded-xl border border-terra-200 bg-white text-terra-900 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all"
                        >
                            <option value="" className="text-terra-900 bg-white">Semua Status</option>
                            {statuses.map((s) => (
                                <option key={s.value} value={s.value} className="text-terra-900 bg-white">{s.name}</option>
                            ))}
                        </select>
                    </form>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-terra-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-sand-50 border-b border-terra-100">
                                <tr>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-terra-600">No. Pesanan</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-terra-600">Pelanggan</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-terra-600">Total</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-terra-600">Status</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-terra-600">Pembayaran</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-terra-600">Tanggal</th>
                                    <th className="text-right py-4 px-6 text-sm font-medium text-terra-600">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-terra-100">
                                {orderData.length === 0 ? (
                                    <tr><td colSpan={7} className="py-12 text-center text-terra-500">Belum ada pesanan</td></tr>
                                ) : orderData.map((order) => {
                                    const StatusIcon = statusIcons[order.status.value] || Clock;
                                    return (
                                        <tr key={order.id} className="hover:bg-sand-50/50 transition-colors">
                                            <td className="py-4 px-6">
                                                <p className="font-medium text-terra-900">{order.order_number}</p>
                                                <p className="text-sm text-terra-500">{order.items?.length || 0} item</p>
                                            </td>
                                            <td className="py-4 px-6">
                                                <p className="font-medium text-terra-900">{order.user?.name || 'Guest'}</p>
                                                <p className="text-sm text-terra-500">{order.user?.email || '-'}</p>
                                            </td>
                                            <td className="py-4 px-6 font-medium text-terra-900">{order.total_formatted}</td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex whitespace-nowrap items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium bg-${order.status.color}-100 text-${order.status.color}-700`}>
                                                    <StatusIcon className="w-3.5 h-3.5" />
                                                    {order.status.label}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex whitespace-nowrap text-xs px-2.5 py-1 rounded-full font-medium bg-${order.payment_status.color}-100 text-${order.payment_status.color}-700`}>
                                                    {order.payment_status.label}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-terra-600">{new Date(order.created_at).toLocaleDateString('id-ID')}</td>
                                            <td className="py-4 px-6">
                                                <Link href={`/admin/orders/${order.id}`} className="p-2 rounded-lg text-terra-500 hover:bg-terra-100 transition-colors inline-flex" title="Lihat Detail">
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    {orders.meta && (
                        <Pagination links={orders.meta.links} meta={orders.meta} className="px-6 py-4 border-t border-terra-100" />
                    )}</div>
            </div>
        </AdminLayout>
    );
}

