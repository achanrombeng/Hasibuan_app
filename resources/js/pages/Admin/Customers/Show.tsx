import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link } from '@inertiajs/react';
import {
  ArrowLeft,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  User,
} from 'lucide-react';

interface Order {
  id: number;
  order_number: string;
  total_formatted: string;
  status: { value: string; label: string };
  created_at: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  orders_count: number;
  total_spent: string;
  created_at: string;
  orders: Order[];
}

interface ShowCustomerProps {
  customer: Customer;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function ShowCustomer({ customer }: ShowCustomerProps) {
  return (
    <AdminLayout
      breadcrumbs={[
        { title: 'Pelanggan', href: '/admin/customers' },
        { title: customer.name, href: `/admin/customers/${customer.id}` },
      ]}
    >
      <Head title={`Pelanggan: ${customer.name}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/admin/customers"
            className="rounded-lg p-2 text-terra-600 transition-colors hover:bg-terra-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-terra-100">
              <User className="h-8 w-8 text-terra-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-terra-900">
                {customer.name}
              </h1>
              <p className="mt-1 text-terra-500">
                Bergabung sejak {customer.created_at}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Customer Info */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-terra-900">
                Informasi Kontak
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-terra-400" />
                  <span className="text-terra-700">{customer.email}</span>
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-terra-400" />
                    <span className="text-terra-700">{customer.phone}</span>
                  </div>
                )}
                {customer.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-terra-400" />
                    <div className="text-terra-700">
                      <p>{customer.address}</p>
                      <p>
                        {customer.city}, {customer.province}{' '}
                        {customer.postal_code}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-terra-900">
                Statistik
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-terra-600">Total Pesanan</span>
                  <span className="font-semibold text-terra-900">
                    {customer.orders_count}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-terra-600">Total Belanja</span>
                  <span className="font-semibold text-terra-900">
                    {customer.total_spent}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Orders History */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-terra-100 bg-white shadow-sm">
              <div className="border-b border-terra-100 p-6">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-5 w-5 text-terra-600" />
                  <h2 className="text-lg font-semibold text-terra-900">
                    Riwayat Pesanan
                  </h2>
                </div>
              </div>
              {customer.orders.length > 0 ? (
                <div className="divide-y divide-terra-100">
                  {customer.orders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/admin/orders/${order.id}`}
                      className="flex items-center justify-between p-4 transition-colors hover:bg-sand-50"
                    >
                      <div>
                        <p className="font-medium text-terra-900">
                          {order.order_number}
                        </p>
                        <p className="text-sm text-terra-500">
                          {order.created_at}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-terra-900">
                          {order.total_formatted}
                        </p>
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${statusColors[order.status.value] || 'bg-gray-100 text-gray-700'}`}
                        >
                          {order.status.label}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-terra-500">
                  Belum ada pesanan
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
