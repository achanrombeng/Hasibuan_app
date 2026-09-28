import { ConfirmDialog } from '@/components/ui/alert-dialog';
import { useTranslation } from '@/hooks/use-translation';
import { SharedData, SiteSettings } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import {
  ChevronRight,
  Heart,
  Home,
  LogOut,
  MapPin,
  Package,
  ShoppingBag,
  User,
} from 'lucide-react';
import { ReactNode, useState } from 'react';

interface CustomerLayoutProps {
  children: ReactNode;
  title?: string;
}

interface MenuItem {
  name: string;
  href: string;
  icon: typeof Package;
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Pesanan Saya', href: '/shop/orders', icon: Package },
  { name: 'Wishlist', href: '/shop/wishlist', icon: Heart },
  { name: 'Alamat', href: '/shop/addresses', icon: MapPin },
  { name: 'Profil', href: '/settings/profile', icon: User },
];

export default function CustomerLayout({
  children,
  title,
}: CustomerLayoutProps) {
  const { auth } = usePage<SharedData>().props;
  const { t } = useTranslation();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const currentPath = window.location.pathname;

  const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
  const siteName = siteSettings?.site_name || 'Ronica';

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return currentPath === '/dashboard';
    }
    return currentPath.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-terra-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-terra-900">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-terra-900">
                {siteName}
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-terra-600">
                Halo, {auth.user.name}
              </span>
              <button
                type="button"
                onClick={() => setShowLogoutDialog(true)}
                className="cursor-pointer rounded-lg p-2 text-terra-500 transition-colors hover:bg-terra-50"
                title={t('common.logout')}
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        {title && (
          <div className="mb-6 flex items-center gap-2 text-sm text-terra-500">
            <Link href="/dashboard" className="hover:text-terra-700">
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-terra-900">{title}</span>
          </div>
        )}

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <aside className="flex-shrink-0 lg:w-64">
            <div className="rounded-2xl border border-terra-100 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center gap-3 rounded-xl bg-sand-50 p-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-terra-200">
                  <User className="h-6 w-6 text-terra-600" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium text-terra-900">
                    {auth.user.name}
                  </p>
                  <p className="truncate text-sm text-terra-500">
                    {auth.user.email}
                  </p>
                </div>
              </div>
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                        active
                          ? 'bg-terra-900 text-white'
                          : 'text-terra-600 hover:bg-sand-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>

      {/* Logout Confirmation Alert */}
      <ConfirmDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        title={t('common.logout_confirm_title')}
        description={t('common.logout_confirm_desc')}
        confirmText={t('common.logout_confirm_button')}
        cancelText={t('common.cancel')}
        variant="danger"
        onConfirm={() => router.post('/logout')}
      />
    </div>
  );
}
