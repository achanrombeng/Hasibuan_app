import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
  AlertCircle,
  ArrowLeft,
  Banknote,
  CheckCircle,
  Clock,
  CreditCard,
  MapPin,
  Package,
  Truck,
  User,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: number;
  price_formatted: string;
  original_price: number;
  original_price_formatted: string;
  discount_amount: number;
  discount_amount_formatted: string;
  discount_percentage: number;
  has_discount: boolean;
  subtotal: number;
  subtotal_formatted: string;
  product: {
    id: number;
    name: string;
    images: Array<{ image_url: string }>;
  } | null;
}

interface Order {
  id: number;
  order_number: string;
  user: { id: number; name: string; email: string } | null;
  shipping_name: string;
  shipping_phone: string;
  shipping_email: string;
  shipping_address: string;
  shipping_city: string;
  shipping_province: string;
  shipping_postal_code: string;
  items: OrderItem[];
  subtotal_formatted: string;
  shipping_cost_formatted: string;
  discount_formatted: string;
  total_formatted: string;
  status: { value: string; label: string };
  payment_status: { value: string; label: string };
  payment_method: { value: string; label: string };
  customer_notes: string | null;
  admin_notes: string | null;
  tracking_number: string | null;
  created_at: string;
}

interface ShowOrderProps {
  order: Order;
  statuses: Array<{ value: string; name: string }>;
  paymentStatuses: Array<{ value: string; name: string }>;
}

export default function ShowOrder({
  order,
  statuses,
  paymentStatuses,
}: ShowOrderProps) {
  // Safe access to nested objects
  const status = order.status || { value: 'pending', label: 'Menunggu' };
  const paymentStatus = order.payment_status || {
    value: 'pending',
    label: 'Menunggu',
  };
  const paymentMethod = order.payment_method || {
    value: 'unknown',
    label: 'Unknown',
  };
  const items: OrderItem[] = Array.isArray(order.items) ? order.items : [];

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showShipModal, setShowShipModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [trackingNumber, setTrackingNumber] = useState(
    order.tracking_number || '',
  );

  const { processing } = useForm({
    status: status.value,
    payment_status: paymentStatus.value,
    tracking_number: order.tracking_number || '',
    cancellation_reason: '',
  });

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === 'cancelled') {
      setShowCancelModal(true);
      return;
    }
    if (newStatus === 'shipped') {
      setShowShipModal(true);
      return;
    }
    router.put(
      `/admin/orders/${order.id}`,
      { status: newStatus },
      { preserveScroll: true },
    );
  };

  const handlePaymentStatusChange = (newStatus: string) => {
    router.put(
      `/admin/orders/${order.id}`,
      { payment_status: newStatus },
      { preserveScroll: true },
    );
  };

  const handleShip = () => {
    router.put(
      `/admin/orders/${order.id}`,
      {
        status: 'shipped',
        tracking_number: trackingNumber,
      },
      {
        preserveScroll: true,
        onSuccess: () => setShowShipModal(false),
      },
    );
  };

  const handleCancel = () => {
    router.put(
      `/admin/orders/${order.id}`,
      {
        status: 'cancelled',
        cancellation_reason: cancelReason,
      },
      {
        preserveScroll: true,
        onSuccess: () => setShowCancelModal(false),
      },
    );
  };

  const canConfirmPayment = paymentStatus.value === 'pending';
  const canProcess =
    status.value === 'pending' && paymentStatus.value === 'paid';
  const canShip = status.value === 'confirmed' || status.value === 'processing';
  const canDeliver = status.value === 'shipped';
  const canCancel = !['cancelled', 'delivered', 'refunded'].includes(
    status.value,
  );

  return (
    <AdminLayout
      breadcrumbs={[
        { title: 'Pesanan', href: '/admin/orders' },
        { title: order.order_number, href: `/admin/orders/${order.id}` },
      ]}
    >
      <Head title={`Pesanan ${order.order_number}`} />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/orders"
              className="rounded-lg p-2 text-terra-600 transition-colors hover:bg-terra-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-terra-900">
                {order.order_number}
              </h1>
              <p className="mt-1 text-terra-500">
                {new Date(order.created_at).toLocaleString('id-ID')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                status.value === 'pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : status.value === 'confirmed'
                    ? 'bg-blue-100 text-blue-700'
                    : status.value === 'processing'
                      ? 'bg-indigo-100 text-indigo-700'
                      : status.value === 'shipped'
                        ? 'bg-purple-100 text-purple-700'
                        : status.value === 'delivered'
                          ? 'bg-green-100 text-green-700'
                          : status.value === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
              }`}
            >
              {status.label}
            </span>
            <span
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                paymentStatus.value === 'paid'
                  ? 'bg-green-100 text-green-700'
                  : paymentStatus.value === 'pending'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-gray-100 text-gray-700'
              }`}
            >
              {paymentStatus.label}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Order Items */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-terra-100 bg-white shadow-sm">
              <div className="border-b border-terra-100 p-6">
                <h2 className="text-lg font-semibold text-terra-900">
                  Item Pesanan
                </h2>
              </div>
              <div className="divide-y divide-terra-100">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-terra-100">
                      {item.product?.images?.[0]?.image_url ? (
                        <img
                          src={item.product.images[0].image_url}
                          alt={item.product_name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package className="h-6 w-6 text-terra-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-terra-900">
                        {item.product_name}
                      </p>
                      <div className="text-sm text-terra-500">
                        {item.has_discount ? (
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="text-terra-400 line-through">
                              {item.original_price_formatted}
                            </span>
                            <span className="font-medium text-green-600">
                              {item.price_formatted}
                            </span>
                            <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700">
                              -{item.discount_percentage}%
                            </span>
                            <span className="text-terra-400">
                              × {item.quantity}
                            </span>
                          </span>
                        ) : (
                          <span>
                            {item.price_formatted} × {item.quantity}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="font-medium text-terra-900">
                      {item.subtotal_formatted}
                    </p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 bg-sand-50 p-6">
                <div className="flex justify-between text-sm">
                  <span className="text-terra-600">Subtotal</span>
                  <span className="text-terra-900">
                    {order.subtotal_formatted}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-terra-600">Ongkir</span>
                  <span className="text-terra-900">
                    {order.shipping_cost_formatted}
                  </span>
                </div>
                {order.discount_formatted && (
                  <div className="flex justify-between text-sm">
                    <span className="text-terra-600">Diskon</span>
                    <span className="text-green-600">
                      -{order.discount_formatted}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t border-terra-200 pt-2 text-lg font-semibold">
                  <span className="text-terra-900">Total</span>
                  <span className="text-terra-900">
                    {order.total_formatted}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="rounded-2xl border border-terra-200 bg-gradient-to-br from-terra-50 to-terra-100/50 p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 font-semibold text-terra-900">
                <AlertCircle className="h-5 w-5" />
                Aksi Cepat
              </h2>
              <div className="space-y-3">
                {/* Confirm Payment Button */}
                {canConfirmPayment && (
                  <button
                    onClick={() => handlePaymentStatusChange('paid')}
                    disabled={processing}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                  >
                    <Banknote className="h-5 w-5" />
                    Konfirmasi Pembayaran
                  </button>
                )}

                {/* Process Order Button */}
                {canProcess && (
                  <button
                    onClick={() => handleStatusChange('processing')}
                    disabled={processing}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Clock className="h-5 w-5" />
                    Proses Pesanan
                  </button>
                )}

                {/* Ship Order Button */}
                {canShip && (
                  <button
                    onClick={() => handleStatusChange('shipped')}
                    disabled={processing}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
                  >
                    <Truck className="h-5 w-5" />
                    Kirim Pesanan
                  </button>
                )}

                {/* Mark Delivered Button */}
                {canDeliver && (
                  <button
                    onClick={() => handleStatusChange('delivered')}
                    disabled={processing}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                  >
                    <CheckCircle className="h-5 w-5" />
                    Tandai Selesai
                  </button>
                )}

                {/* Cancel Button */}
                {canCancel && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    disabled={processing}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-100 px-4 py-3 font-medium text-red-700 transition-colors hover:bg-red-200 disabled:opacity-50"
                  >
                    <XCircle className="h-5 w-5" />
                    Batalkan Pesanan
                  </button>
                )}

                {/* Show completed status */}
                {status.value === 'delivered' && (
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-green-100 px-4 py-3 font-medium text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    Pesanan Selesai
                  </div>
                )}

                {status.value === 'cancelled' && (
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-red-100 px-4 py-3 font-medium text-red-700">
                    <XCircle className="h-5 w-5" />
                    Pesanan Dibatalkan
                  </div>
                )}
              </div>
            </div>

            {/* Status Selects */}
            <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-semibold text-terra-900">Ubah Status</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm text-terra-600">
                    Status Pesanan
                  </label>
                  <select
                    value={status.value}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={processing}
                    className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-2.5 text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none disabled:opacity-50"
                  >
                    {statuses.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm text-terra-600">
                    Status Pembayaran
                  </label>
                  <select
                    value={paymentStatus.value}
                    onChange={(e) => handlePaymentStatusChange(e.target.value)}
                    disabled={processing}
                    className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-2.5 text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none disabled:opacity-50"
                  >
                    {paymentStatuses.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <User className="h-5 w-5 text-terra-500" />
                <h2 className="font-semibold text-terra-900">Pelanggan</h2>
              </div>
              <div className="space-y-2 text-sm">
                <p className="font-medium text-terra-900">
                  {order.shipping_name}
                </p>
                <p className="text-terra-600">{order.shipping_email}</p>
                <p className="text-terra-600">{order.shipping_phone}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <MapPin className="h-5 w-5 text-terra-500" />
                <h2 className="font-semibold text-terra-900">
                  Alamat Pengiriman
                </h2>
              </div>
              <div className="space-y-1 text-sm text-terra-600">
                <p>{order.shipping_address}</p>
                <p>
                  {order.shipping_city}, {order.shipping_province}{' '}
                  {order.shipping_postal_code}
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-terra-500" />
                <h2 className="font-semibold text-terra-900">Pembayaran</h2>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-terra-600">Metode</span>
                  <span className="text-terra-900">{paymentMethod.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-terra-600">Status</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${paymentStatus.value === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}
                  >
                    {paymentStatus.label}
                  </span>
                </div>
              </div>
            </div>
            {order.tracking_number && (
              <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                <h2 className="mb-2 font-semibold text-terra-900">No. Resi</h2>
                <p className="font-mono text-sm text-terra-900">
                  {order.tracking_number}
                </p>
              </div>
            )}
            {order.customer_notes && (
              <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                <h2 className="mb-2 font-semibold text-terra-900">
                  Catatan Pelanggan
                </h2>
                <p className="text-sm text-terra-600">{order.customer_notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ship Modal */}
      {showShipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                <Truck className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-terra-900">
                Kirim Pesanan
              </h3>
            </div>
            <p className="mb-4 text-sm text-terra-600">
              Masukkan nomor resi untuk pesanan{' '}
              <strong>{order.order_number}</strong>
            </p>
            <div className="mb-4">
              <label className="mb-1 block text-sm text-terra-600">
                Nomor Resi (Opsional)
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Contoh: JNE1234567890"
                className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-2.5 font-mono text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
              />
              <p className="mt-1 text-xs text-terra-500">
                Nomor resi bisa ditambahkan nanti jika belum tersedia
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowShipModal(false)}
                className="flex-1 rounded-xl border border-terra-200 px-4 py-2.5 text-terra-700 transition-colors hover:bg-terra-50"
              >
                Batal
              </button>
              <button
                onClick={handleShip}
                disabled={processing}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
              >
                <Truck className="h-4 w-4" />
                Kirim Pesanan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-terra-900">
                Batalkan Pesanan
              </h3>
            </div>
            <p className="mb-4 text-sm text-terra-600">
              Apakah Anda yakin ingin membatalkan pesanan{' '}
              <strong>{order.order_number}</strong>?
            </p>
            <div className="mb-4">
              <label className="mb-1 block text-sm text-terra-600">
                Alasan Pembatalan
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Masukkan alasan pembatalan..."
                rows={3}
                className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-2.5 text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 rounded-xl border border-terra-200 px-4 py-2.5 text-terra-700 transition-colors hover:bg-terra-50"
              >
                Batal
              </button>
              <button
                onClick={handleCancel}
                disabled={processing}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                Ya, Batalkan
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
