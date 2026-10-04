import {
  AlertDialog,
  ConfirmDialog,
  useAlertDialog,
  useConfirmDialog,
} from '@/components/ui/alert-dialog';
import { ShopLayout } from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
  AlertCircle,
  ArrowLeft,
  Banknote,
  Building2,
  CheckCircle,
  Clock,
  Copy,
  CreditCard,
  MapPin,
  MessageCircle,
  Package,
  Truck,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

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
  unit_price_formatted?: string;
  original_price?: number;
  original_price_formatted?: string;
  discount_percentage?: number;
  has_discount?: boolean;
  subtotal: number;
  subtotal_formatted?: string;
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
  payment_method: { value: string; label: string };
  subtotal_formatted: string;
  discount_formatted: string;
  shipping_cost_formatted: string;
  total_formatted: string;
  total: number;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_province: string;
  shipping_postal_code: string;
  tracking_number?: string;
  customer_notes?: string;
  items: OrderItem[];
  created_at: string;
  shipped_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  snap_token?: string;
}

interface PaymentSettings {
  bank_name: string;
  bank_account_number: string;
  bank_account_name: string;
  cod_fee: number;
  payment_deadline_hours: number;
  whatsapp: string;
}

interface Props {
  order: Order;
  paymentSettings: PaymentSettings;
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock size={20} />,
  processing: <AlertCircle size={20} />,
  shipped: <Truck size={20} />,
  delivered: <CheckCircle size={20} />,
  cancelled: <XCircle size={20} />,
};

// Order Timeline Component
function OrderTimeline({
  order,
  status,
  paymentStatus,
}: {
  order: Order;
  status: { value: string; label: string };
  paymentStatus: { value: string; label: string };
}) {
  const isCancelled = status.value === 'cancelled';

  const isPaid = paymentStatus.value === 'paid';
  const isProcessing = ['processing', 'shipped', 'delivered'].includes(
    status.value,
  );
  const isShipped = ['shipped', 'delivered'].includes(status.value);
  const isDelivered = status.value === 'delivered';

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isCancelled) {
    return (
      <div className="mb-6 rounded-sm bg-red-50 p-6">
        <div className="flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="font-semibold text-red-800">Order Cancelled</p>
            {order.cancellation_reason && (
              <p className="text-sm text-red-600">
                {order.cancellation_reason}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    {
      key: 'created',
      label: 'Order Placed',
      icon: <Package size={18} />,
      completed: true,
      date: formatDate(order.created_at),
    },
    {
      key: 'paid',
      label: 'Payment',
      icon: <CreditCard size={18} />,
      completed: isPaid,
      date: isPaid ? 'Paid' : 'Pending',
    },
    {
      key: 'processing',
      label: 'Processing',
      icon: <AlertCircle size={18} />,
      completed: isProcessing,
    },
    {
      key: 'shipped',
      label: 'Shipped',
      icon: <Truck size={18} />,
      completed: isShipped,
      date: formatDate(order.shipped_at),
    },
    {
      key: 'delivered',
      label: 'Delivered',
      icon: <CheckCircle size={18} />,
      completed: isDelivered,
      date: formatDate(order.delivered_at),
    },
  ];

  return (
    <div className="mb-6 overflow-x-auto rounded-sm bg-white p-6">
      <h2 className="mb-6 text-center font-medium text-terra-900">
        Order Status
      </h2>
      <div className="flex min-w-[500px] items-start justify-center">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-start">
            {/* Step content */}
            <div className="flex w-24 flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  step.completed
                    ? 'border-teal-500 bg-teal-500 text-white'
                    : 'border-terra-300 bg-white text-terra-400'
                }`}
              >
                {step.completed ? <CheckCircle size={18} /> : step.icon}
              </div>
              <p
                className={`mt-2 text-center text-xs font-medium ${
                  step.completed ? 'text-teal-600' : 'text-terra-400'
                }`}
              >
                {step.label}
              </p>
              {step.date && (
                <p
                  className={`mt-0.5 text-center text-[10px] ${step.completed ? 'text-teal-500' : 'text-terra-400'}`}
                >
                  {step.date}
                </p>
              )}
            </div>
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={`mt-5 h-0.5 w-12 ${
                  step.completed && steps[index + 1].completed
                    ? 'bg-teal-500'
                    : step.completed
                      ? 'bg-gradient-to-r from-teal-500 to-terra-300'
                      : 'bg-terra-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OrderShow({ order, paymentSettings }: Props) {
  const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
  const siteName = siteSettings?.site_name || 'hasibuan_app';
  const [cancelling, setCancelling] = useState(false);
  const [copied, setCopied] = useState(false);
  const { state: alertState, showAlert, closeAlert } = useAlertDialog();
  const { state: confirmState, showConfirm, closeConfirm } = useConfirmDialog();

  const handleCancel = () => {
    showConfirm(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      () => {
        setCancelling(true);
        router.post(
          `/shop/orders/${order.id}/cancel`,
          {},
          {
            onFinish: () => setCancelling(false),
          },
        );
      },
      'danger',
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Safe access to status with fallback
  const status = order.status || {
    value: 'pending',
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800',
  };
  const paymentStatus = order.payment_status || {
    value: 'pending',
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800',
  };
  const paymentMethod = order.payment_method || {
    value: 'unknown',
    label: 'Unknown',
  };
  const items: OrderItem[] = Array.isArray(order.items) ? order.items : [];

  const canCancel = status.value === 'pending';
  const needsPayment =
    paymentStatus.value === 'pending' && status.value !== 'cancelled';
  const isBankTransfer = paymentMethod.value === 'bank_transfer';
  const isCOD = paymentMethod.value === 'cod';
  const isMidtrans = paymentMethod.value === 'midtrans';
  const isWhatsApp = paymentMethod.value === 'whatsapp';

  const handleMidtransPayment = () => {
    if (order.snap_token) {
      // @ts-ignore
      if (window.snap) {
        // @ts-ignore
        window.snap.pay(order.snap_token, {
          onSuccess: function (result: any) {
            window.location.reload();
          },
          onPending: function (result: any) {
            showAlert('Awaiting payment...', 'info', 'Payment Notice');
            window.location.reload();
          },
          onError: function (result: any) {
            showAlert('Payment failed!', 'error', 'Payment Failed');
          },
          onClose: function () {
            // Closed
          },
        });
      } else {
        showAlert(
          'Payment gateway failed to load. Please refresh the page.',
          'error',
          'Error',
        );
      }
    } else {
      showAlert('Payment token not found.', 'error', 'Error');
    }
  };

  // Generate WhatsApp message with product details
  const generateWhatsAppMessage = () => {
    const productList = items
      .map(
        (item) =>
          `• ${item.product_name} x${item.quantity} - ${item.subtotal_formatted || `$${item.subtotal.toLocaleString('en-US')}`}`,
      )
      .join('%0A');

    if (isWhatsApp) {
      return `Hello ${siteName}! 👋%0A%0AI would like to place an order:%0A%0A📦 *Order: %23${order.order_number}*%0A%0A*Items:*%0A${productList}%0A%0A🚚 *Delivery Details:*%0A${order.shipping_name}%0A${order.shipping_phone}%0A${order.shipping_address}%0A${order.shipping_city}, ${order.shipping_province} ${order.shipping_postal_code}%0A%0A💰 *Total: ${order.total_formatted}*%0A%0APlease confirm for payment and processing. Thank you! 🙏`;
    } else if (isBankTransfer) {
      return `Hello ${siteName}! 👋%0A%0AI have transferred payment for order:%0A📦 Order: %23${order.order_number}%0A💰 Total: ${order.total_formatted}%0A🏦 To: ${paymentSettings.bank_name} ${paymentSettings.bank_account_number}%0A%0APlease confirm. Thank you! 🙏`;
    } else {
      return `Hello ${siteName}! 👋%0A%0AI would like to confirm my order:%0A📦 Order: %23${order.order_number}%0A💰 Total: ${order.total_formatted}%0A📍 Address: ${order.shipping_address}, ${order.shipping_city}%0A%0APlease process. Thank you! 🙏`;
    }
  };

  const whatsappUrl = paymentSettings?.whatsapp
    ? `https://wa.me/${paymentSettings.whatsapp}?text=${generateWhatsAppMessage()}`
    : '#';

  return (
    <>
      <Head title={`Order #${order.order_number} - ${siteName}`} />
      <div className="bg-noise" />
      <ShopLayout>
        <main className="min-h-screen bg-sand-50 pb-20">
          <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-12">
            {/* Back Button */}
            <Link
              href="/shop/orders"
              className="mb-6 inline-flex items-center gap-2 text-terra-600 hover:text-terra-900"
            >
              <ArrowLeft size={18} />
              <span>Back to Orders</span>
            </Link>

            {/* Header */}
            <div className="mb-6 rounded-sm bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl text-terra-900">
                    Order #{order.order_number}
                  </h1>
                  <p className="mt-1 text-sm text-terra-500">
                    {new Date(order.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${status.color}`}
                  >
                    {STATUS_ICONS[status.value]}
                    {status.label}
                  </span>
                  {canCancel && (
                    <button
                      onClick={handleCancel}
                      disabled={cancelling}
                      className="rounded-full border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      {cancelling ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                  )}
                </div>
              </div>

              {order.tracking_number && (
                <div className="mt-4 rounded-sm bg-blue-50 p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Tracking No.:</strong> {order.tracking_number}
                  </p>
                </div>
              )}

              {order.cancellation_reason && (
                <div className="mt-4 rounded-sm bg-red-50 p-4">
                  <p className="text-sm text-red-800">
                    <strong>Cancellation Reason:</strong>{' '}
                    {order.cancellation_reason}
                  </p>
                </div>
              )}
            </div>

            {/* Order Timeline */}
            <OrderTimeline
              order={order}
              status={status}
              paymentStatus={paymentStatus}
            />

            <div className="grid gap-6 md:grid-cols-3">
              {/* Items */}
              <div className="rounded-sm bg-white p-6 md:col-span-2">
                <h2 className="mb-4 flex items-center gap-2 font-medium text-terra-900">
                  <Package size={18} />
                  Ordered Items
                </h2>
                <div className="space-y-4">
                  {items.map((item) => {
                    const imageUrl =
                      item.product?.images?.[0]?.image_url ||
                      '/images/placeholder-product.svg';
                    return (
                      <div
                        key={item.id}
                        className="flex gap-4 border-b border-terra-100 pb-4 last:border-0 last:pb-0"
                      >
                        <img
                          src={imageUrl}
                          alt={item.product_name}
                          className="h-20 w-20 rounded-lg bg-sand-100 object-cover"
                        />
                        <div className="flex-1">
                          {item.product ? (
                            <Link
                              href={`/shop/products/${item.product.slug}`}
                              className="font-medium text-terra-900 hover:text-wood"
                            >
                              {item.product_name}
                            </Link>
                          ) : (
                            <p className="font-medium text-terra-900">
                              {item.product_name}
                            </p>
                          )}
                          <p className="text-sm text-terra-500">
                            SKU: {item.product_sku}
                          </p>
                          {item.has_discount ? (
                            <div className="flex flex-wrap items-center gap-2 text-sm">
                              <span className="text-terra-400 line-through">
                                {item.original_price_formatted ||
                                  `$${(item.original_price || 0).toLocaleString('en-US')}`}
                              </span>
                              <span className="font-medium text-green-600">
                                {item.unit_price_formatted ||
                                  `$${item.unit_price.toLocaleString('en-US')}`}
                              </span>
                              <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700">
                                -{item.discount_percentage}%
                              </span>
                              <span className="text-terra-400">
                                × {item.quantity}
                              </span>
                            </div>
                          ) : (
                            <p className="text-sm text-terra-500">
                              {item.quantity} x{' '}
                              {item.unit_price_formatted || `$${item.unit_price.toLocaleString('en-US')}`}
                            </p>
                          )}
                        </div>
                        <p className="font-medium text-terra-900">
                          {item.subtotal_formatted ||
                            `$${item.subtotal.toLocaleString('en-US')}`}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Shipping */}
                <div className="rounded-sm bg-white p-6">
                  <h2 className="mb-4 flex items-center gap-2 font-medium text-terra-900">
                    <MapPin size={18} />
                    Shipping Address
                  </h2>
                  <p className="font-medium text-terra-900">
                    {order.shipping_name}
                  </p>
                  <p className="text-sm text-terra-600">
                    {order.shipping_phone}
                  </p>
                  <p className="mt-2 text-sm text-terra-600">
                    {order.shipping_address}
                  </p>
                  <p className="text-sm text-terra-600">
                    {order.shipping_city}, {order.shipping_province}{' '}
                    {order.shipping_postal_code}
                  </p>
                </div>

                {/* Payment */}
                <div className="rounded-sm bg-white p-6">
                  <h2 className="mb-4 flex items-center gap-2 font-medium text-terra-900">
                    <CreditCard size={18} />
                    Payment
                  </h2>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-terra-500">Method</span>
                    <span className="flex items-center gap-1 text-terra-900">
                      {isBankTransfer ? (
                        <Building2 size={14} />
                      ) : (
                        <Banknote size={14} />
                      )}
                      {paymentMethod.label}
                    </span>
                  </div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-terra-500">Status</span>
                    <span className={paymentStatus.color}>
                      {paymentStatus.label}
                    </span>
                  </div>
                  <div className="mt-3 space-y-2 border-t border-terra-100 pt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-terra-500">Subtotal</span>
                      <span>{order.subtotal_formatted}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-terra-500">Shipping Fee</span>
                      <span>{order.shipping_cost_formatted}</span>
                    </div>
                    <div className="flex justify-between border-t border-terra-100 pt-2 font-medium text-terra-900">
                      <span>Total</span>
                      <span>{order.total_formatted}</span>
                    </div>
                  </div>
                </div>

                {/* Midtrans Payment Action */}
                {needsPayment && isMidtrans && (
                  <div className="rounded-sm border border-blue-200 bg-blue-50 p-6 shadow-sm">
                    <h2 className="mb-2 font-semibold text-blue-900">
                      Complete Payment
                    </h2>
                    <p className="mb-4 text-sm text-blue-700">
                      Please complete your payment via Midtrans.
                    </p>
                    <button
                      onClick={handleMidtransPayment}
                      className="w-full rounded-sm bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                      Pay Now
                    </button>
                  </div>
                )}

                {/* Bank Transfer Info */}
                {needsPayment &&
                  isBankTransfer &&
                  paymentSettings?.bank_account_number && (
                    <div className="rounded-sm border border-terra-200 bg-gradient-to-br from-terra-50 to-terra-100/50 p-6 shadow-sm">
                      <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-terra-600">
                          <Building2 size={20} className="text-white" />
                        </div>
                        <div>
                          <h2 className="font-semibold text-terra-900">
                            Direct Bank Transfer
                          </h2>
                          <p className="text-xs text-terra-500">
                            Complete your wire payment
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="rounded-sm border border-terra-100 bg-white/80 p-4 backdrop-blur">
                          <p className="mb-1 text-xs text-terra-500">Bank Name</p>
                          <p className="font-semibold text-terra-900">
                            {paymentSettings.bank_name}
                          </p>
                        </div>
                        <div className="rounded-sm border border-terra-100 bg-white/80 p-4 backdrop-blur">
                          <p className="mb-1 text-xs text-terra-500">
                            Account Number
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="font-mono text-lg font-semibold tracking-wider text-terra-900">
                              {paymentSettings.bank_account_number}
                            </p>
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  paymentSettings.bank_account_number,
                                )
                              }
                              className="rounded-lg p-2 text-terra-500 transition-colors hover:bg-terra-100 hover:text-terra-700"
                              title="Copy account number"
                            >
                              <Copy size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="rounded-sm border border-terra-100 bg-white/80 p-4 backdrop-blur">
                          <p className="mb-1 text-xs text-terra-500">
                            Account Beneficiary
                          </p>
                          <p className="font-semibold text-terra-900">
                            {paymentSettings.bank_account_name}
                          </p>
                        </div>
                        <div className="rounded-sm bg-terra-600 p-4">
                          <p className="mb-1 text-xs text-terra-200">
                            Total Transfer Amount
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold text-white">
                              {order.total_formatted}
                            </p>
                            <button
                              onClick={() =>
                                copyToClipboard(String(order.total || 0))
                              }
                              className="rounded-lg p-2 text-terra-200 transition-colors hover:bg-terra-500 hover:text-white"
                              title="Copy amount"
                            >
                              <Copy size={16} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-center gap-2 rounded-sm bg-white/60 py-3 text-terra-600">
                        <Clock size={16} />
                        <p className="text-sm font-medium">
                          Payment deadline:{' '}
                          <span className="text-terra-800">
                            {paymentSettings.payment_deadline_hours} hours
                          </span>
                        </p>
                      </div>

                      {copied && (
                        <div className="mt-3 flex items-center justify-center gap-2 rounded-sm bg-green-50 py-2 text-green-600">
                          <CheckCircle size={16} />
                          <p className="text-sm font-medium">
                            Copied to clipboard!
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                {/* COD Info */}
                {needsPayment && isCOD && (
                  <div className="rounded-sm border border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100/50 p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-amber-500">
                        <Banknote size={20} className="text-white" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-amber-900">
                          Cash on Delivery (COD)
                        </h2>
                        <p className="text-xs text-amber-600">
                          Cash on Delivery
                        </p>
                      </div>
                    </div>
                    <div className="rounded-sm border border-amber-100 bg-white/80 p-4 backdrop-blur">
                      <p className="text-sm text-amber-800">
                        Please prepare exact cash amount:
                      </p>
                      <p className="mt-1 text-2xl font-bold text-amber-900">
                        {order.total_formatted}
                      </p>
                      <p className="mt-2 text-xs text-amber-600">
                        Payment is settled upon delivery
                      </p>
                    </div>
                  </div>
                )}

                {/* WhatsApp Order - Special Section */}
                {needsPayment && isWhatsApp && paymentSettings?.whatsapp && (
                  <div className="rounded-sm border border-green-200 bg-gradient-to-br from-green-50 to-green-100/50 p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-green-500">
                        <MessageCircle size={20} className="text-white" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-green-900">
                          Continue via WhatsApp
                        </h2>
                        <p className="text-xs text-green-600">
                          Contact support for payment & confirmation
                        </p>
                      </div>
                    </div>
                    <div className="mb-4 rounded-sm border border-green-100 bg-white/80 p-4 backdrop-blur">
                      <p className="text-sm text-green-800">
                        Click the button below to send your order details to support via WhatsApp. Our team will verify your order and provide payment instructions.
                      </p>
                    </div>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex w-full items-center justify-center gap-3 rounded-sm bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 font-semibold text-white shadow-lg shadow-green-500/25 transition-all duration-300 hover:scale-[1.02] hover:from-green-600 hover:to-green-700 hover:shadow-green-500/40"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-colors group-hover:bg-white/30">
                        <MessageCircle size={18} />
                      </div>
                      <span>Contact Support via WhatsApp</span>
                    </a>
                  </div>
                )}

                {/* WhatsApp Confirmation for other payment methods */}
                {needsPayment && !isWhatsApp && paymentSettings?.whatsapp && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex w-full items-center justify-center gap-3 rounded-sm bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 font-semibold text-white shadow-lg shadow-green-500/25 transition-all duration-300 hover:scale-[1.02] hover:from-green-600 hover:to-green-700 hover:shadow-green-500/40"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-colors group-hover:bg-white/30">
                      <MessageCircle size={18} />
                    </div>
                    <span>
                      {isBankTransfer
                        ? 'Confirm Transfer via WhatsApp'
                        : 'Confirm Order via WhatsApp'}
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </main>
      </ShopLayout>

      <AlertDialog
        open={alertState.open}
        onOpenChange={closeAlert}
        title={alertState.title}
        description={alertState.description}
        type={alertState.type}
      />

      <ConfirmDialog
        open={confirmState.open}
        onOpenChange={closeConfirm}
        title={confirmState.title}
        description={confirmState.description}
        variant={confirmState.variant}
        onConfirm={confirmState.onConfirm}
      />
    </>
  );
}
