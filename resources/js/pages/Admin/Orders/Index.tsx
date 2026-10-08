import Pagination from '@/components/pagination';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import {
  CheckCircle,
  Clock,
  Eye,
  Filter,
  Package,
  Search,
  Truck,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface Order {
  id: number;
  order_number: string;
  user: { id: number; name: string; email: string } | null;
  total: number;
  total_formatted: string;
  status: { value: string; label: string; color: string };
  payment_status: { value: string; label: string; color: string };
  items: Array<{ id: number }>;
  created_at: string;
}

interface OrdersIndexProps {
  orders: {
    data: Order[];
    links: {
      first?: string;
      last?: string;
      prev?: string;
      next?: string;
    };
    meta: {
      current_page: number;
      last_page: number;
      from: number;
      to: number;
      total: number;
      links: Array<{ url: string | null; label: string; active: boolean }>;
    };
  };
  filters?: { filter?: Record<string, string> };
  statuses: Array<{ value: string; name: string }>;
  paymentStatuses: Array<{ value: string; name: string }>;
}

const statusIcons: Record<string, React.ElementType> = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  completed: CheckCircle,
  cancelled: XCircle,
};

export default function OrdersIndex({
  orders,
  filters,
  statuses,
}: OrdersIndexProps) {
  // Safely get filter values - check if filter is an object
  const filterObj =
    filters?.filter && typeof filters.filter === 'object' ? filters.filter : {};
  const [search, setSearch] = useState(filterObj.order_number || '');
  const [statusFilter, setStatusFilter] = useState(filterObj.status || '');
  const [showFilters, setShowFilters] = useState(false);
  const orderData = orders.data;

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params: Record<string, string> = {};
    if (search) params['filter[order_number]'] = search;
    if (statusFilter) params['filter[status]'] = statusFilter;
    router.get('/admin/orders', params, { preserveState: true });
  };

  const handleReset = () => {
    setSearch('');
    setStatusFilter('');
    router.get('/admin/orders', {}, { preserveState: true });
  };

  return (
    <AdminLayout breadcrumbs={[{ title: 'Orders', href: '/admin/orders' }]}>
      <Head title="Manage Orders" />

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-terra-900">Manage Orders</h1>
          <p className="mt-1 text-terra-500">
            Manage and track all customer orders
          </p>
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
                placeholder="Search order number or customer name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 py-2.5 pr-4 pl-10 text-sm text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-wood focus:bg-white focus:ring-2 focus:ring-wood/20 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium shadow-sm transition-colors ${
                  showFilters
                    ? 'border-neutral-300 bg-neutral-100 text-neutral-900'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <Filter className="h-4 w-4 text-neutral-600" /> Filter
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-black active:scale-[0.98]"
              >
                Search
              </button>
            </div>
          </form>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 gap-4 border-t border-neutral-100 pt-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                  Order Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full cursor-pointer rounded-xl border border-neutral-200 bg-neutral-50/50 p-2.5 text-sm text-neutral-900 focus:border-wood focus:bg-white focus:ring-2 focus:ring-wood/20 focus:outline-none"
                >
                  <option value="">All Statuses</option>
                  {statuses.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={() => handleSearch()}
                  className="flex-1 rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-black sm:flex-none"
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 sm:flex-none"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Orders Table */}
        <div className="overflow-hidden rounded-2xl border border-terra-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-terra-100 bg-sand-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-terra-600">
                    Order No.
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-terra-600">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-terra-600">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-terra-600">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-terra-600">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-terra-600">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-terra-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-terra-100">
                {orderData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 text-center text-terra-500"
                    >
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orderData.map((order) => {
                    const StatusIcon = statusIcons[order.status.value] || Clock;
                    return (
                      <tr
                        key={order.id}
                        className="transition-colors hover:bg-sand-50/50"
                      >
                        <td className="px-6 py-4">
                          <p className="font-medium text-terra-900">
                            {order.order_number}
                          </p>
                          <p className="text-sm text-terra-500">
                            {order.items?.length || 0} items
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-terra-900">
                            {order.user?.name || 'Guest'}
                          </p>
                          <p className="text-sm text-terra-500">
                            {order.user?.email || '-'}
                          </p>
                        </td>
                        <td className="px-6 py-4 font-medium text-terra-900">
                          {order.total_formatted}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap bg-${order.status.color}-100 text-${order.status.color}-700`}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />
                            {order.status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap bg-${order.payment_status.color}-100 text-${order.payment_status.color}-700`}
                          >
                            {order.payment_status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-terra-600">
                          {new Date(order.created_at).toLocaleDateString(
                            'en-US',
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="inline-flex rounded-lg p-2 text-terra-500 transition-colors hover:bg-terra-100"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {orders.meta && (
            <Pagination
              links={orders.meta.links}
              meta={orders.meta}
              className="border-t border-terra-100 px-6 py-4"
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
