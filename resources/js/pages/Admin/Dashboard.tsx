import { useTranslation } from '@/hooks/use-translation';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link } from '@inertiajs/react';
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  ExternalLink,
  FileText,
  FolderTree,
  Mail,
  MessageSquare,
  Package,
  Phone,
  SlidersHorizontal,
  Star,
  Users,
} from 'lucide-react';

interface DashboardProps {
  stats: {
    totalProducts: number;
    totalCategories?: number;
    activeBanners?: number;
    totalInquiries?: number;
    totalArticles?: number;
    totalReviews?: number;
    totalCustomers?: number;
  };
  recentInquiries?: Array<{
    id: number;
    name: string;
    email: string;
    phone: string;
    message: string;
    status: string;
    created_at: string;
  }>;
}

export default function Dashboard({ stats, recentInquiries = [] }: DashboardProps) {
  const { t } = useTranslation();

  const getInquiryBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (['new', 'pending', 'unread'].includes(s)) {
      return (
        <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 capitalize">
          Baru
        </span>
      );
    }
    if (['contacted', 'replied', 'in_progress'].includes(s)) {
      return (
        <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 capitalize">
          Dihubungi
        </span>
      );
    }
    if (['closed', 'completed', 'resolved'].includes(s)) {
      return (
        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 capitalize">
          Selesai
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-0.5 text-[11px] font-medium text-neutral-600 capitalize">
        {status || 'Inquiry'}
      </span>
    );
  };

  const quickLinks = [
    {
      title: 'Katalog Produk',
      desc: `${stats.totalProducts ?? 0} produk aktif di etalase`,
      href: '/admin/products',
      icon: Package,
    },
    {
      title: 'Pengaturan Beranda',
      desc: 'Kelola banner, show/hide sub, & background',
      href: '/admin/settings/homepage',
      icon: SlidersHorizontal,
    },
    {
      title: 'Inquiry Trade & Kemitraan',
      desc: `${stats.totalInquiries ?? 0} permintaan kemitraan masuk`,
      href: '/admin/dealer-inquiries',
      icon: Briefcase,
    },
    {
      title: 'Kategori Produk',
      desc: `${stats.totalCategories ?? 0} kategori ruang & koleksi`,
      href: '/admin/categories',
      icon: FolderTree,
    },
    {
      title: 'Artikel & Jurnal',
      desc: `${stats.totalArticles ?? 0} artikel arsitektur terbit`,
      href: '/admin/articles',
      icon: FileText,
    },
    {
      title: 'Ulasan Pelanggan',
      desc: `${stats.totalReviews ?? 0} ulasan & testimoni klien`,
      href: '/admin/reviews',
      icon: Star,
    },
  ];

  return (
    <AdminLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin' }]}>
      <Head title={t('admin.dashboard.title') || 'Dashboard'} />

      <div className="space-y-6">
        {/* Simplified Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Panel administrasi & katalog arsitektur Hasibuan Design
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/settings/homepage"
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-xs font-medium text-neutral-700 shadow-2xs transition-colors hover:bg-neutral-50"
            >
              <SlidersHorizontal size={14} />
              <span>Pengaturan Beranda</span>
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3.5 py-2 text-xs font-medium text-white shadow-2xs transition-colors hover:bg-neutral-800"
            >
              <ExternalLink size={14} />
              <span>Lihat Toko</span>
            </a>
          </div>
        </div>

        {/* 4 Clean Showcase Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Stat 1: Products */}
          <Link
            href="/admin/products"
            className="group rounded-xl border border-neutral-200/90 bg-white p-5 shadow-2xs transition-all hover:border-neutral-300 hover:shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                Katalog Produk
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700 transition-colors group-hover:bg-amber-600 group-hover:text-white">
                <Package size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-neutral-900">
                {stats.totalProducts ?? 0}
              </div>
              <div className="mt-1.5 text-xs text-neutral-500">
                {stats.totalCategories ?? 0} kategori aktif di etalase
              </div>
            </div>
          </Link>

          {/* Stat 2: Inquiries */}
          <Link
            href="/admin/dealer-inquiries"
            className="group rounded-xl border border-neutral-200/90 bg-white p-5 shadow-2xs transition-all hover:border-neutral-300 hover:shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                Inquiry Kemitraan
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700 transition-colors group-hover:bg-teal-600 group-hover:text-white">
                <Briefcase size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-neutral-900">
                {stats.totalInquiries ?? 0}
              </div>
              <div className="mt-1.5 text-xs text-neutral-500">
                Permintaan trade & arsitek
              </div>
            </div>
          </Link>

          {/* Stat 3: Articles */}
          <Link
            href="/admin/articles"
            className="group rounded-xl border border-neutral-200/90 bg-white p-5 shadow-2xs transition-all hover:border-neutral-300 hover:shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                Artikel & Jurnal
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                <FileText size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-neutral-900">
                {stats.totalArticles ?? 0}
              </div>
              <div className="mt-1.5 text-xs text-neutral-500">
                Publikasi & esai arsitektur
              </div>
            </div>
          </Link>

          {/* Stat 4: Reviews & Clients */}
          <Link
            href="/admin/reviews"
            className="group rounded-xl border border-neutral-200/90 bg-white p-5 shadow-2xs transition-all hover:border-neutral-300 hover:shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                Ulasan & Testimoni
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-700 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                <MessageSquare size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-neutral-900">
                {stats.totalReviews ?? 0}
              </div>
              <div className="mt-1.5 text-xs text-neutral-500">
                {stats.totalCustomers ?? 0} klien terdaftar
              </div>
            </div>
          </Link>
        </div>

        {/* 2 Columns: Recent Inquiries (2/3) + Quick Access (1/3) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Inquiries Table */}
          <div className="rounded-xl border border-neutral-200/90 bg-white shadow-2xs lg:col-span-2">
            <div className="flex items-center justify-between border-b border-neutral-100 p-5">
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  Inquiry & Konsultasi Terbaru
                </h2>
                <p className="text-xs text-neutral-500">
                  Daftar permintaan kemitraan dan trade inquiry dari klien / arsitek
                </p>
              </div>
              <Link
                href="/admin/dealer-inquiries"
                className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:text-teal-800"
              >
                <span>Lihat Semua</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              {recentInquiries && recentInquiries.length > 0 ? (
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-neutral-100 bg-neutral-50/70 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    <tr>
                      <th className="px-5 py-3">Nama Klien</th>
                      <th className="px-5 py-3">Kontak</th>
                      <th className="px-5 py-3">Pesan</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Waktu</th>
                      <th className="px-5 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {recentInquiries.map((inquiry) => (
                      <tr
                        key={inquiry.id}
                        className="hover:bg-neutral-50/60 transition-colors"
                      >
                        <td className="px-5 py-3.5 font-medium text-neutral-900">
                          {inquiry.name}
                        </td>
                        <td className="px-5 py-3.5 text-neutral-600">
                          <div className="space-y-0.5">
                            {inquiry.email && (
                              <div className="flex items-center gap-1 text-[11px]">
                                <Mail size={11} className="text-neutral-400" />
                                <span>{inquiry.email}</span>
                              </div>
                            )}
                            {inquiry.phone && (
                              <div className="flex items-center gap-1 text-[11px] text-neutral-500">
                                <Phone size={11} className="text-neutral-400" />
                                <span>{inquiry.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-neutral-600 max-w-[220px]">
                          <p className="truncate text-xs">
                            {inquiry.message || '-'}
                          </p>
                        </td>
                        <td className="px-5 py-3.5">
                          {getInquiryBadge(inquiry.status)}
                        </td>
                        <td className="px-5 py-3.5 text-neutral-500 whitespace-nowrap">
                          {inquiry.created_at}
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <Link
                            href="/admin/dealer-inquiries"
                            className="inline-flex items-center gap-1 font-medium text-teal-700 hover:text-teal-800"
                          >
                            <span>Detail</span>
                            <ArrowUpRight size={12} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center">
                  <Briefcase className="mx-auto h-8 w-8 text-neutral-300" />
                  <p className="mt-2 text-sm font-medium text-neutral-700">
                    Belum ada inquiry masuk
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">
                    Permintaan kemitraan dan pesan formulir dari pengunjung akan tampil di sini.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Access Menu */}
          <div className="rounded-xl border border-neutral-200/90 bg-white p-5 shadow-2xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Menu & Akses Cepat
              </h2>
              <p className="text-xs text-neutral-500">
                Pintasan navigasi penting untuk mengelola showroom
              </p>
            </div>

            <div className="space-y-2">
              {quickLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50/50 p-3 transition-all hover:border-neutral-300 hover:bg-white hover:shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white border border-neutral-200 text-neutral-700 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                        <Icon size={15} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-neutral-900">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-neutral-500 line-clamp-1">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                    <ArrowRight
                      size={14}
                      className="text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all shrink-0 ml-2"
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
