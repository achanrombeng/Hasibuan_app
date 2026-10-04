import { AlertDialog, useAlertDialog } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { home as shopHome } from '@/routes/shop';
import { index as shopOrdersIndex } from '@/routes/shop/orders';
import { index as shopProductsIndex } from '@/routes/shop/products';
import { Order } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
  CheckCircle2,
  ChevronRight,
  Copy,
  CreditCard,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { useEffect } from 'react';

interface Props {
  order: Order | null;
}

export default function Success({ order }: Props) {
  const { flash } = usePage().props;
  const { t } = useTranslation();
  const { state: alertState, showAlert, closeAlert } = useAlertDialog();

  useEffect(() => {
    // Auto-trigger Midtrans if applicable
    if (
      order?.payment_method.value === 'midtrans' &&
      order.payment_status.value === 'pending' &&
      order.snap_token
    ) {
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
            showAlert('Payment failed!', 'error', 'Failed');
          },
          onClose: function () {
            // User closed popup
          },
        });
      }
    }
  }, [flash, order]);

  if (!order) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-4 rounded-full bg-red-100 p-4">
          <ShoppingBag className="h-12 w-12 text-red-600" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">
          {t('shop.orders.no_orders')}
        </h1>
        <p className="mb-8 text-gray-600">
          Sorry, we could not find your order details.
        </p>
        <Link href={shopHome.url()}>
          <Button>{t('common.home')}</Button>
        </Link>
      </div>
    );
  }

  const handlePay = () => {
    if (order.snap_token) {
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
          showAlert('Payment failed!', 'error', 'Failed');
        },
        onClose: function () {
          // Closed
        },
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <Head title={t('shop.checkout_success.title')} />

      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-teal-100">
            <CheckCircle2 className="h-10 w-10 text-teal-600" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            {t('shop.checkout_success.thank_you')}
          </h1>
          <p className="text-lg text-gray-600">
            Your order has been placed successfully.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>{t('shop.orders.order_items')}</CardTitle>
                <CardDescription>
                  Order ID: {order.order_number}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium bg-${order.status.color}-100 text-${order.status.color}-800`}
                >
                  {order.status.label}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium bg-${order.payment_status.color}-100 text-${order.payment_status.color}-800`}
                >
                  {order.payment_status.label}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Payment Method Instructions */}
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-2 flex items-center gap-2 font-semibold">
                <CreditCard className="h-4 w-4" />
                {t('shop.checkout.payment_method')}
              </h3>
              <p className="mb-2 text-sm text-gray-600">
                {order.payment_method.label}
              </p>

              {order.payment_method.value === 'midtrans' &&
                order.payment_status.value === 'pending' && (
                  <div className="mt-4">
                    <Button
                      onClick={handlePay}
                      className="w-full bg-teal-600 text-white hover:bg-teal-700"
                    >
                      Pay Now
                    </Button>
                    <p className="mt-2 text-center text-xs text-gray-500">
                      Click the button above to complete automatic payment via Midtrans.
                    </p>
                  </div>
                )}

              {order.payment_method.value === 'bank_transfer' &&
                order.payment_status.value === 'unpaid' && (
                  <div className="mt-4 rounded border border-gray-200 bg-white p-4">
                    <p className="mb-2 text-sm font-medium">
                      Please wire payment to the following account:
                    </p>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-gray-600">Bank Transfer</span>
                      <div className="flex items-center gap-2">
                        <code className="rounded bg-gray-100 px-2 py-1 font-mono text-sm">
                          1234567890
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => {
                            navigator.clipboard.writeText('1234567890');
                            showAlert(
                              'Account number copied',
                              'success',
                              'Success',
                            );
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Account Beneficiary</span>
                      <span className="text-sm font-medium">
                        PT Ronica Indonesia
                      </span>
                    </div>
                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <p className="text-xs text-gray-500">
                        Please confirm your payment with support via WhatsApp after the transfer is complete.
                      </p>
                    </div>
                  </div>
                )}
            </div>

            {/* Shipping Info */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 flex items-center gap-2 font-semibold">
                  <Truck className="h-4 w-4" />
                  Shipping Address
                </h3>
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900">
                    {order.shipping_name}
                  </p>
                  <p>{order.shipping_phone}</p>
                  <p className="mt-1">{order.shipping_address}</p>
                  <p>
                    {order.shipping_city}, {order.shipping_province}{' '}
                    {order.shipping_postal_code}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Cost Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{order.subtotal_formatted}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{order.shipping_cost_formatted}</span>
                  </div>
                  {order.discount_amount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{order.discount_formatted}</span>
                    </div>
                  )}
                  <div className="mt-2 flex justify-between border-t pt-2 font-bold text-gray-900">
                    <span>Total</span>
                    <span>{order.total_formatted}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col justify-center gap-3 border-t py-6 sm:flex-row">
            <Link href={shopProductsIndex.url()} className="w-full sm:w-auto">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
            <Link href={shopOrdersIndex.url()} className="w-full sm:w-auto">
              <Button className="w-full gap-2">
                View My Orders
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <AlertDialog
        open={alertState.open}
        onOpenChange={closeAlert}
        title={alertState.title}
        description={alertState.description}
        type={alertState.type}
      />
    </div>
  );
}
