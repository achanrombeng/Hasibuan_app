import Pagination from '@/components/pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Info,
  Package,
  ShoppingCart,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface Notification {
  id: string;
  type: string;
  data: any;
  read_at: string | null;
  created_at: string;
}

interface Props {
  notifications: {
    data: Notification[];
    links: any[];
    current_page: number;
    last_page: number;
  };
}

export default function NotificationsIndex({ notifications }: Props) {
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const markAllRead = () => {
    router.post('/admin/notifications/mark-all-read');
  };

  const handleClearAll = () => {
    setIsClearing(true);
    router.delete('/admin/notifications/clear-all', {
      onFinish: () => {
        setIsClearing(false);
        setShowClearDialog(false);
      },
    });
  };

  const markAsRead = (id: string) => {
    router.patch(`/admin/notifications/${id}/read`);
  };

  const getIcon = (type: string) => {
    if (type.includes('Order'))
      return <ShoppingCart className="h-5 w-5 text-blue-600" />;
    if (type.includes('Product'))
      return <Package className="h-5 w-5 text-orange-600" />;
    if (type.includes('Stock'))
      return <AlertTriangle className="h-5 w-5 text-red-600" />;
    return <Info className="h-5 w-5 text-gray-600" />;
  };

  return (
    <AdminLayout
      breadcrumbs={[{ title: 'Notifikasi', href: '/admin/notifications' }]}
    >
      <Head title="Notifikasi" />

      <div className="mb-6">
        {/* Header - Responsive */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <Link
              href="/admin"
              className="mt-1 rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">
                Notifikasi
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                Lihat dan kelola semua aktivitas toko Anda.
              </p>
            </div>
          </div>

          {/* Action Buttons - Stack on mobile */}
          <div className="flex gap-2 sm:flex-shrink-0">
            <button
              onClick={() => setShowClearDialog(true)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 sm:flex-none sm:px-4 sm:py-2.5"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Hapus Semua</span>
              <span className="sm:hidden">Hapus</span>
            </button>
            <button
              onClick={markAllRead}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 sm:flex-none sm:px-4 sm:py-2.5"
            >
              <Check className="h-4 w-4" />
              <span className="hidden sm:inline">Tandai Semua Dibaca</span>
              <span className="sm:hidden">Dibaca</span>
            </button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Notifikasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {notifications.data.length > 0 ? (
              notifications.data.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex gap-3 p-3 transition-colors hover:bg-sand-50 sm:gap-4 sm:p-4 ${!notification.read_at ? 'bg-blue-50/50' : ''}`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10 ${!notification.read_at ? 'bg-white shadow-sm' : 'bg-sand-100'}`}
                  >
                    {getIcon(notification.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <p
                        className={`text-sm font-medium ${!notification.read_at ? 'text-neutral-900' : 'text-neutral-600'}`}
                      >
                        {notification.data.title || 'Notifikasi Baru'}
                      </p>
                      <span className="text-xs text-neutral-400">
                        {new Date(notification.created_at).toLocaleString(
                          'id-ID',
                        )}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-neutral-500">
                      {notification.data.message ||
                        'Anda memiliki notifikasi baru.'}
                    </p>
                    {!notification.read_at && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="mt-2 text-xs text-blue-600 hover:underline"
                      >
                        Tandai dibaca
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-neutral-400">
                Tidak ada notifikasi saat ini.
              </div>
            )}
          </div>

          {/* Pagination */}
          {notifications.last_page > 1 && (
            <Pagination
              links={notifications.links}
              meta={{
                current_page: notifications.current_page,
                last_page: notifications.last_page,
                from: 0,
                to: 0,
                total: 0,
              }}
              className="mt-6 border-t border-neutral-100"
              showPerPage={false}
            />
          )}
        </CardContent>
      </Card>

      {/* Clear All Dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle className="text-center">
              Hapus Semua Notifikasi
            </DialogTitle>
            <DialogDescription className="text-center">
              Apakah Anda yakin ingin menghapus semua notifikasi? Tindakan ini
              tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <DialogClose asChild>
              <button
                type="button"
                className="flex-1 rounded-xl border border-neutral-200 px-4 py-2.5 font-medium text-neutral-700 transition-colors hover:bg-neutral-50 sm:flex-none"
              >
                Batal
              </button>
            </DialogClose>
            <button
              type="button"
              onClick={handleClearAll}
              disabled={isClearing}
              className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50 sm:flex-none"
            >
              {isClearing ? 'Menghapus...' : 'Ya, Hapus Semua'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
