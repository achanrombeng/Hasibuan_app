import Pagination from '@/components/pagination';
import { useTranslation } from '@/hooks/use-translation';
import { ShopLayout } from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { PaginatedResponse } from '@/types/shop';
import { Head, Link, usePage } from '@inertiajs/react';
import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Clock,
  Package,
  Truck,
  XCircle,
} from 'lucide-react';

interface OrderStatus {
  value: string;
  label: string;
  color: string;
}

interface OrderItem {
  id: number;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  product?: {
    id: number;
    slug: string;
    images?: { image_url: string }[];
  };
}

interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  payment_status: OrderStatus;
  total_formatted: string;
  items: OrderItem[];
  created_at: string;
}

interface Props {
  orders: PaginatedResponse<Order>;
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock size={16} />,
  processing: <AlertCircle size={16} />,
  shipped: <Truck size={16} />,
  delivered: <CheckCircle size={16} />,
  cancelled: <XCircle size={16} />,
};

export default function OrdersIndex({ orders }: Props) {
  const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
  const siteName = siteSettings?.site_name || 'Ronica';
  const { t } = useTranslation();

  return (
    <>
      <Head title={`${t('shop.orders.title')} - ${siteName}`} />
      <div className="bg-noise" />
      <ShopLayout>
        <main className="min-h-screen bg-white pb-20">
          <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-12">
            <h1 className="mb-8 font-serif text-3xl font-medium text-terra-900 md:text-4xl">
              {t('shop.orders.title')}
            </h1>

            {orders.data.length > 0 ? (
              <div className="space-y-4">
                {orders.data.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}

                {/* Pagination */}
                {orders.meta.last_page > 1 && (
                  <Pagination
                    links={orders.meta.links}
                    meta={orders.meta}
                    className="mt-8 border-t border-neutral-100"
                    showPerPage={false}
                  />
                )}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </main>
      </ShopLayout>
    </>
  );
}

function OrderCard({ order }: { order: Order }) {
  const { t } = useTranslation();
  const firstItem = order.items[0];
  const imageUrl =
    firstItem?.product?.images?.[0]?.image_url ||
    '/images/placeholder-product.svg';
  const otherItemsCount = order.items.length - 1;

  return (
    <Link
      href={`/shop/orders/${order.id}`}
      className="block rounded-sm border border-terra-100 bg-white p-6 transition-all hover:border-terra-200 hover:shadow-sm"
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-sm text-terra-500">#{order.order_number}</p>
          <p className="mt-1 text-xs text-terra-400">
            {new Date(order.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${order.status.color}`}
          >
            {STATUS_ICONS[order.status.value]}
            {order.status.label}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <img
          src={imageUrl}
          alt={firstItem?.product_name}
          className="h-16 w-16 rounded-lg bg-sand-100 object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-terra-900">
            {firstItem?.product_name}
          </p>
          <p className="text-sm text-terra-500">
            {firstItem?.quantity} x Rp{' '}
            {firstItem?.unit_price.toLocaleString('id-ID')}
          </p>
          {otherItemsCount > 0 && (
            <p className="mt-1 text-xs text-terra-400">
              +{otherItemsCount} {t('shop.products.showing_results', { count: '' })}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm text-terra-500">{t('common.total')}</p>
          <p className="font-semibold text-terra-900">
            {order.total_formatted}
          </p>
        </div>
        <ChevronRight size={20} className="text-terra-300" />
      </div>
    </Link>
  );
}

function EmptyState() {
  const { t } = useTranslation();

  return (
    <div className="rounded-sm bg-white py-20 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sand-100">
        <Package size={32} className="text-terra-300" />
      </div>
      <h3 className="mb-2 text-xl font-medium text-terra-900">
        {t('shop.orders.no_orders')}
      </h3>
      <p className="mb-8 text-terra-500">{t('shop.orders.no_orders_desc')}</p>
      <Link
        href="/shop/products"
        className="inline-flex items-center gap-2 rounded-full bg-terra-900 px-6 py-3 text-white transition-colors hover:bg-wood"
      >
        {t('shop.cart.continue_shopping')}
      </Link>
    </div>
  );
}
