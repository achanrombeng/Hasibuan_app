import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Eye, Mail, Phone, ShoppingBag, User, Clock, Sparkles } from 'lucide-react';
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

const DEMO_CUSTOMERS: Customer[] = [
    { id: 1, name: 'Adnan Buyung', email: 'adnan@example.com', phone: '+62 812-3456-7890', orders_count: 5, total_spent: 'Rp 12.500.000', last_order: '2026-08-20', created_at: '2026-01-15' },
    { id: 2, name: 'Siti Rahmawati', email: 'siti@example.com', phone: '+62 813-9876-5432', orders_count: 3, total_spent: 'Rp 8.200.000', last_order: '2026-08-18', created_at: '2026-02-10' },
    { id: 3, name: 'Budi Santoso', email: 'budi@example.com', phone: '+62 856-1122-3344', orders_count: 8, total_spent: 'Rp 24.100.000', last_order: '2026-08-22', created_at: '2025-11-05' },
    { id: 4, name: 'Dewi Lestari', email: 'dewi@example.com', phone: '+62 878-5566-7788', orders_count: 2, total_spent: 'Rp 4.500.000', last_order: '2026-07-30', created_at: '2026-03-01' },
    { id: 5, name: 'Eko Prasetyo', email: 'eko@example.com', phone: '+62 821-4433-2211', orders_count: 1, total_spent: 'Rp 2.100.000', last_order: '2026-08-01', created_at: '2026-04-12' },
];

export default function CustomersIndex({ customers, filters }: CustomersIndexProps) {
    const filterName = filters?.filter && typeof filters.filter === 'object' ? filters.filter.name : '';
    const [search, setSearch] = useState(filterName || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/customers', search ? { 'filter[name]': search } : {}, { preserveState: true });
    };

    const displayCustomers = customers?.data?.length > 0 ? customers.data : DEMO_CUSTOMERS;

    return (
        <AdminLayout breadcrumbs={[{ title: 'Customers', href: '/admin/customers' }]}>
            <Head title="Manage Customers - Coming Soon" />

            <div className="relative min-h-[600px]">
                {/* 1. Full Original Design (Behind Blur Overlay) */}
                <div className="space-y-6 filter blur-md select-none pointer-events-none opacity-60">
                    {/* Header */}
                    <div>
                        <h1 className="text-2xl font-bold text-terra-900">Manage Customers</h1>
                        <p className="mt-1 text-terra-500">View and manage registered customer profiles</p>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm md:p-6">
                        <form
                            onSubmit={handleSearch}
                            className="flex flex-col gap-3 sm:flex-row sm:items-center"
                        >
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder="Cari pelanggan..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 py-2.5 pr-4 pl-10 text-sm text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-wood focus:bg-white focus:ring-2 focus:ring-wood/20 focus:outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-2.5">
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center rounded-xl bg-[#a67c52] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#8e6843] active:scale-[0.98]"
                                >
                                    Cari
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Customers Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-terra-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-sand-50 border-b border-terra-100">
                                    <tr>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-terra-600">Customer</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-terra-600">Contact</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-terra-600">Orders</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-terra-600">Total Spent</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-terra-600">Last Order</th>
                                        <th className="text-right py-4 px-6 text-sm font-medium text-terra-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-terra-100">
                                    {displayCustomers.map((customer) => (
                                        <tr key={customer.id} className="hover:bg-sand-50/50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-wood/10 rounded-full flex items-center justify-center">
                                                        <User className="w-5 h-5 text-wood" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-terra-900">{customer.name}</p>
                                                        <p className="text-sm text-terra-500">Joined {customer.created_at}</p>
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
                                            <td className="py-4 px-6 text-right">
                                                <Link
                                                    href={`/admin/customers/${customer.id}`}
                                                    className="p-2 rounded-lg text-terra-500 hover:bg-terra-100 transition-colors inline-flex"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination paginator={customers} className="px-6 py-4 border-t border-terra-100" />
                    </div>
                </div>

                {/* 2. Glassmorphism Coming Soon Overlay (Centered On Top) */}
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center">
                    <div className="mx-auto max-w-md rounded-3xl border border-white/80 bg-white/90 p-8 md:p-10 shadow-2xl backdrop-blur-xl transition-all">
                        <h2 className="mb-6 font-serif text-4xl font-extrabold text-terra-900 md:text-5xl">
                            Coming Soon
                        </h2>

                        <div className="flex justify-center">
                            <Link
                                href="/admin"
                                className="inline-flex items-center gap-2 rounded-xl bg-terra-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-wood hover:shadow-md"
                            >
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

