import LanguageSwitcher from '@/components/LanguageSwitcher';
import { ConfirmDialog } from '@/components/ui/alert-dialog';
import { useInitials } from '@/hooks/use-initials';
import { useTranslation } from '@/hooks/use-translation';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { ChevronRight, LogOut, Menu, Settings, User } from 'lucide-react';
import { useState } from 'react';

interface AdminHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  onMobileMenuClick?: () => void;
}

export default function AdminHeader({
  breadcrumbs = [],
  onMobileMenuClick,
}: AdminHeaderProps) {
  const { auth } = usePage<SharedData>().props;
  const { t } = useTranslation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const getInitials = useInitials();

  const handleLogout = () => {
    setShowUserMenu(false);
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    router.post('/logout');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left side - Mobile menu + Breadcrumbs */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={onMobileMenuClick}
            className="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-50 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Breadcrumbs */}
          <nav className="hidden items-center gap-2 text-sm sm:flex">
            <Link
              href="/admin"
              className="text-neutral-500 transition-colors hover:text-neutral-900"
            >
              Dashboard
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-neutral-300" />
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-medium text-neutral-900">
                    {crumb.title}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-neutral-500 transition-colors hover:text-neutral-900"
                  >
                    {crumb.title}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Right side - Language Switcher + Log Out + User Profile */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <LanguageSwitcher variant="toggle" />

          {/* Log Out Button */}
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 hover:text-red-700"
            title={t('admin.header.logout')}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">{t('admin.header.logout')}</span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 rounded-xl p-1.5 pr-3 transition-colors hover:bg-neutral-50"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200">
                {auth.user.avatar ? (
                  <img
                    src={auth.user.avatar}
                    alt={auth.user.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium text-neutral-700">
                    {getInitials(auth.user.name)}
                  </span>
                )}
              </div>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium text-neutral-900">
                  {auth.user.name}
                </p>
                <p className="text-xs text-neutral-500">
                  {t('admin.header.administrator')}
                </p>
              </div>
            </button>

            {/* Dropdown */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute top-full right-0 z-50 mt-2 w-56 rounded-xl border border-neutral-100 bg-white py-2 shadow-lg">
                  <div className="border-b border-neutral-100 px-4 py-2">
                    <p className="text-sm font-medium text-neutral-900">
                      {auth.user.name}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {auth.user.email}
                    </p>
                  </div>
                  <Link
                    href="/admin/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
                  >
                    <User className="h-4 w-4" />
                    {t('admin.header.my_profile')}
                  </Link>
                  <Link
                    href="/admin/settings"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
                  >
                    <Settings className="h-4 w-4" />
                    {t('admin.sidebar.settings')}
                  </Link>
                  <div className="mt-2 border-t border-neutral-100 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      {t('admin.header.logout')}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
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
        onConfirm={confirmLogout}
      />
    </header>
  );
}
