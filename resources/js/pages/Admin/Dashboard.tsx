import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link } from '@inertiajs/react';
import {
    Package,
    ShoppingCart,
    Users,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    ArrowRight,
    Clock,
    AlertTriangle,
} from 'lucide-react';
import { useState } from 'react';
import Pagination from '@/components/pagination';

interface DashboardProps {
    stats: {
        totalProducts: number;
        totalOrders: number;
        totalCustomers: number;
        totalRevenue: number;
        ordersGrowth: number;
        revenueGrowth: number;
    };
    recentOrders: {
        data: Array<{
            id: number;
            order_number: string;
            customer: string;
            total: string;
            status: string;
            created_at: string;
        }>;
        links: Array<{ url: string | null; label: string; active: boolean }>;
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    lowStockProducts: {
        data: Array<{
            id: number;
            name: string;
            stock: number;
            sku: string;
        }>;
        links: Array<{ url: string | null; label: string; active: boolean }>;
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
    pending: 'Menunggu',
    processing: 'Diproses',
    shipped: 'Dikirim',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
};

export default function Dashboard({
    stats,
    recentOrders,
    lowStockProducts,
}: DashboardProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <AdminLayout>
            <Head title="Dashboard Admin" />

            <div className="space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-2xl font-bold text-terra-900">Dashboard Showcase</h1>
                    <p className="text-terra-500 mt-1">Selamat datang kembali! Ringkasan pengolahan katalog showcase produk Anda.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Total Products */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-terra-500">Total Produk Showcase</p>
                            <p className="text-3xl font-bold text-terra-900 mt-1">{stats.totalProducts}</p>
                        </div>
                        <div className="w-14 h-14 bg-wood/10 rounded-2xl flex items-center justify-center">
                            <Package className="w-7 h-7 text-wood" />
                        </div>
                    </div>

                    {/* Total Customers */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-terra-500">Total Pelanggan Terdaftar</p>
                            <p className="text-3xl font-bold text-terra-900 mt-1">{stats.totalCustomers}</p>
                        </div>
                        <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center">
                            <Users className="w-7 h-7 text-purple-600" />
                        </div>
                    </div>
                </div>

                {/* Showcase Quick Management Cards */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-terra-100">
                    <h2 className="text-lg font-bold text-terra-900 mb-4">Manajemen Showcase Produk</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link href="/admin/products" className="group p-5 rounded-xl border border-neutral-100 bg-neutral-50/50 hover:bg-white hover:border-teal-500 hover:shadow-md transition-all">
                            <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center mb-3 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                <Package size={20} />
                            </div>
                            <h3 className="font-semibold text-neutral-900 group-hover:text-teal-700">Kelola Produk</h3>
                            <p className="text-sm text-neutral-500 mt-1">Tambah, ubah foto, deskripsi, & status produk showcase.</p>
                        </Link>
                        <Link href="/admin/categories" className="group p-5 rounded-xl border border-neutral-100 bg-neutral-50/50 hover:bg-white hover:border-teal-500 hover:shadow-md transition-all">
                            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center mb-3 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                <Package size={20} />
                            </div>
                            <h3 className="font-semibold text-neutral-900 group-hover:text-amber-700">Kategori Produk</h3>
                            <p className="text-sm text-neutral-500 mt-1">Atur 11 kategori produk utama dan gambar pendukung.</p>
                        </Link>
                        <Link href="/admin/promo-banners" className="group p-5 rounded-xl border border-neutral-100 bg-neutral-50/50 hover:bg-white hover:border-teal-500 hover:shadow-md transition-all">
                            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-3 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <Package size={20} />
                            </div>
                            <h3 className="font-semibold text-neutral-900 group-hover:text-indigo-700">Promo & Banner</h3>
                            <p className="text-sm text-neutral-500 mt-1">Kelola banner visual dan pengumuman katalog.</p>
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

