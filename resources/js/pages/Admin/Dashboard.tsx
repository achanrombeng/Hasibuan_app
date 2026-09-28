import { useTranslation } from '@/hooks/use-translation';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link } from '@inertiajs/react';
import { Package } from 'lucide-react';

interface DashboardProps {
  stats: {
    totalProducts: number;
    totalCategories?: number;
    activeBanners?: number;
    totalOrders: number;
    totalCustomers: number;
    totalRevenue: number;
    ordersGrowth: number;
    revenueGrowth: number;
  };
  recentOrders?: {
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
  lowStockProducts?: {
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

export default function Dashboard({ stats }: DashboardProps) {
  const { t } = useTranslation();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <AdminLayout>
      <Head title={t('admin.dashboard.title')} />

      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-terra-900">
            {t('admin.dashboard.showcase_title')}
          </h1>
          <p className="mt-1 text-terra-500">
            {t('admin.dashboard.welcome_subtitle')}
          </p>
        </div>

        {/* Showcase Quick Management Cards */}
        <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-terra-900">
            {t('admin.dashboard.showcase_management')}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link
              href="/admin/products"
              className="group flex flex-col justify-between rounded-xl border border-neutral-100 bg-neutral-50/50 p-5 transition-all hover:border-teal-500 hover:bg-white hover:shadow-md"
            >
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-700 transition-colors group-hover:bg-teal-600 group-hover:text-white">
                    <Package size={20} />
                  </div>
                  <span className="inline-flex items-center rounded-full bg-teal-100/70 px-2.5 py-1 text-xs font-semibold text-teal-800">
                    {t('admin.dashboard.total_products_count', {
                      count: stats.totalProducts ?? 0,
                    })}
                  </span>
                </div>
                <h3 className="font-semibold text-neutral-900 group-hover:text-teal-700">
                  {t('admin.dashboard.manage_products')}
                </h3>
                <p className="mt-1 text-sm text-neutral-500">
                  {t('admin.dashboard.manage_products_desc')}
                </p>
              </div>
            </Link>

            <Link
              href="/admin/categories"
              className="group flex flex-col justify-between rounded-xl border border-neutral-100 bg-neutral-50/50 p-5 transition-all hover:border-amber-500 hover:bg-white hover:shadow-md"
            >
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700 transition-colors group-hover:bg-amber-600 group-hover:text-white">
                    <Package size={20} />
                  </div>
                  <span className="inline-flex items-center rounded-full bg-amber-100/70 px-2.5 py-1 text-xs font-semibold text-amber-800">
                    {t('admin.dashboard.total_categories_count', {
                      count: stats.totalCategories ?? 0,
                    })}
                  </span>
                </div>
                <h3 className="font-semibold text-neutral-900 group-hover:text-amber-700">
                  {t('admin.dashboard.product_categories')}
                </h3>
                <p className="mt-1 text-sm text-neutral-500">
                  {t('admin.dashboard.product_categories_desc')}
                </p>
              </div>
            </Link>

            <Link
              href="/admin/promo-banners"
              className="group flex flex-col justify-between rounded-xl border border-neutral-100 bg-neutral-50/50 p-5 transition-all hover:border-indigo-500 hover:bg-white hover:shadow-md"
            >
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                    <Package size={20} />
                  </div>
                  <span className="inline-flex items-center rounded-full bg-indigo-100/70 px-2.5 py-1 text-xs font-semibold text-indigo-800">
                    {t('admin.dashboard.active_banners_count', {
                      count: stats.activeBanners ?? 0,
                    })}
                  </span>
                </div>
                <h3 className="font-semibold text-neutral-900 group-hover:text-indigo-700">
                  {t('admin.dashboard.promo_banners')}
                </h3>
                <p className="mt-1 text-sm text-neutral-500">
                  {t('admin.dashboard.promo_banners_desc')}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
