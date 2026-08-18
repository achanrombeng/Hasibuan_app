import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Eye, Mail, Phone, ShoppingBag, User } from 'lucide-react';
import { useState } from 'react';
import Pagination from '@/components/pagination';

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    orders_count: number;
    total_spent: string;
    last_order: string | null;
    created_at: string;
}

interface CustomersIndexProps {
    customers: {
        data: Customer[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    filters?: { filter?: Record<string, string> };
}

export default function CustomersIndex({ customers, filters }: CustomersIndexProps) {
    // Safely get filter name - check if filter is an object
    const filterName = filters?.filter && typeof filters.filter === 'object' ? filters.filter.name : '';
    const [search, setSearch] = useState(filterName || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/customers', search ? { 'filter[name]': search } : {}, { preserveState: true });
    };

    return (
        <AdminLayout breadcrumbs={[{ title: 'Pelanggan', href: '/admin/customers' }]}>
            <Head title="Kelola Pelanggan" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-terra-900">Kelola Pelanggan</h1>
                    <p className="text-terra-500 mt-1">Lihat dan kelola data pelanggan</p>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="bg-white rounded-2xl p-4 shadow-sm border border-terra-100">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-terra-400" />
                        <input
                            type="text"
                            placeholder="Cari nama atau email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 placeholder:text-terra-400 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all"
                        />
                    </div>
                </form>

                {/* Customers Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-terra-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-sand-50 border-b border-terra-100">
                                <tr>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-terra-600">Pelanggan</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-terra-600">Kontak</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-terra-600">Pesanan</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-terra-600">Total Belanja</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-terra-600">Pesanan Terakhir</th>
                                    <th className="text-right py-4 px-6 text-sm font-medium text-terra-600">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-terra-100">
                                {customers.data.length === 0 ? (
                                    <tr><td colSpan={6} className="py-12 text-center text-terra-500">Belum ada pelanggan</td></tr>
                                ) : customers.data.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-sand-50/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-wood/10 rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5 text-wood" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-terra-900">{customer.name}</p>
                                                    <p className="text-sm text-terra-500">Bergabung {customer.created_at}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-terra-600">
                                                    <Mail className="w-4 h-4" />
                                                    {customer.email}
                                                </div>
                                                {customer.phone && (
                                                    <div className="flex items-center gap-2 text-sm text-terra-600">
                                                        <Phone className="w-4 h-4" />
                                                        {customer.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <ShoppingBag className="w-4 h-4 text-terra-400" />
                                                <span className="font-medium text-terra-900">{customer.orders_count}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 font-medium text-terra-900">{customer.total_spent}</td>
                                        <td className="py-4 px-6 text-sm text-terra-600">{customer.last_order || '-'}</td>
                                        <td className="py-4 px-6">
                                            <Link
                                                href={`/admin/customers/${customer.id}`}
                                                className="p-2 rounded-lg text-terra-500 hover:bg-terra-100 transition-colors inline-flex"
                                                title="Lihat Detail"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    {/* Pagination */}
                    <Pagination paginator={customers} className="px-6 py-4 border-t border-terra-100" />
                </div>


            </div>
        </AdminLayout>
    );
}

