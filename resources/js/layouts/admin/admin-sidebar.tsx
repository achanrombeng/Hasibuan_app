import { useTranslation } from '@/hooks/use-translation';
import { Link, usePage } from '@inertiajs/react';
import {
  Briefcase,
  ChevronLeft,
  FileText,
  FolderTree,
  Info,
  LayoutDashboard,
  LayoutTemplate,
  Megaphone,
  Package,
  PanelBottom,
  Settings,
  Star,
  Store,
  UserCog,
  Users,
  X,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { SharedData, SiteSettings } from '@/types';

interface NavItem {
  titleKey: string;
  href: string;
  icon: React.ElementType;
  permission?: string;
}

const mainNavItems: NavItem[] = [
  {
    titleKey: 'admin.sidebar.dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    titleKey: 'admin.sidebar.products',
    href: '/admin/products',
    icon: Package,
    permission: 'view products',
  },
  {
    titleKey: 'admin.sidebar.categories',
    href: '/admin/categories',
    icon: FolderTree,
    permission: 'view categories',
  },
  {
    titleKey: 'admin.sidebar.dealer_inquiries',
    href: '/admin/dealer-inquiries',
    icon: Briefcase,
  },
  {
    titleKey: 'admin.sidebar.customers',
    href: '/admin/customers',
    icon: Users,
    permission: 'view users',
  },
  {
    titleKey: 'admin.sidebar.reviews',
    href: '/admin/reviews',
    icon: Star,
    permission: 'view reviews',
  },
  {
    titleKey: 'admin.sidebar.articles',
    href: '/admin/articles',
    icon: FileText,
    permission: 'view articles',
  },
];

const settingsNavItems: NavItem[] = [
  {
    titleKey: 'admin.sidebar.user_management',
    href: '/admin/users',
    icon: UserCog,
    permission: 'manage roles',
  },
  {
    titleKey: 'admin.sidebar.promo_banners',
    href: '/admin/promo-banners',
    icon: Megaphone,
    permission: 'manage settings',
  },
  {
    titleKey: 'admin.sidebar.homepage_settings',
    href: '/admin/settings/homepage',
    icon: LayoutTemplate,
    permission: 'manage settings',
  },
  {
    titleKey: 'admin.sidebar.about_page',
    href: '/admin/settings/about',
    icon: Info,
    permission: 'manage settings',
  },
  {
    titleKey: 'admin.sidebar.footer_settings',
    href: '/admin/settings/footer',
    icon: PanelBottom,
    permission: 'manage settings',
  },
  {
    titleKey: 'admin.sidebar.my_profile',
    href: '/admin/profile',
    icon: Users,
    permission: '',
  },
  {
    titleKey: 'admin.sidebar.settings',
    href: '/admin/settings',
    icon: Settings,
    permission: 'manage settings',
  },
];

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function AdminSidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: AdminSidebarProps) {
  // Get current URL path
  const currentPath =
    typeof window !== 'undefined' ? window.location.pathname : '';

  // Get site settings & notifications count
  const { siteSettings, newDealerInquiriesCount } =
    usePage<SharedData>().props;
  const siteName = siteSettings?.site_name || 'Ronica';

  // Check if user has permission (simplified - will be enhanced later)
  const hasPermission = (permission?: string) => {
    if (!permission) return true;
    // For now, return true. Will be connected to actual permissions later
    return true;
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return currentPath === '/admin' || currentPath === '/admin/';
    }
    if (href === '/admin/settings') {
      return (
        currentPath === '/admin/settings' || currentPath === '/admin/settings/'
      );
    }
    return currentPath.startsWith(href);
  };

  const handleNavClick = () => {
    // Close mobile sidebar when navigating
    setMobileOpen(false);
  };

  const { t } = useTranslation();

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        <Link
          href="/admin"
          className="flex items-center gap-3"
          onClick={handleNavClick}
        >
          <img
            src="/assets/images/logo.webp"
            alt={siteName}
            className={cn(
              'h-8 w-auto object-contain brightness-0 invert transition-all',
              !isMobile && collapsed && 'hidden h-10',
            )}
          />
          {(isMobile || !collapsed) && (
            <span className="text-lg font-semibold text-white">Admin</span>
          )}
        </Link>
        {isMobile ? (
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        ) : (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white',
              collapsed && 'mx-auto',
            )}
          >
            <ChevronLeft
              className={cn(
                'h-5 w-5 transition-transform',
                collapsed && 'rotate-180',
              )}
            />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-x-hidden overflow-y-auto px-4 py-4">
        {/* Main Menu */}
        <div className="space-y-1">
          {(isMobile || !collapsed) && (
            <p className="mb-2 px-3 text-xs font-medium tracking-wider text-white/40 uppercase">
              {t('admin.sidebar.main_menu')}
            </p>
          )}
          {mainNavItems
            .filter((item) => hasPermission(item.permission))
            .map((item) => {
              const isDealerInquiries = item.href === '/admin/dealer-inquiries';
              const hasNewInquiries =
                isDealerInquiries && (newDealerInquiriesCount ?? 0) > 0;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition-all',
                    !isMobile && collapsed ? 'justify-center px-2' : 'px-3',
                    isActive(item.href)
                      ? 'bg-white/15 text-white shadow-lg'
                      : 'text-white/70 hover:bg-white/10 hover:text-white',
                  )}
                  title={
                    !isMobile && collapsed && hasNewInquiries
                      ? `${t(item.titleKey)} (${newDealerInquiriesCount} new)`
                      : undefined
                  }
                >
                  <div className="relative flex items-center justify-center">
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!isMobile && collapsed && hasNewInquiries && (
                      <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-[#705335]"></span>
                      </span>
                    )}
                  </div>
                  {(isMobile || !collapsed) && (
                    <span className="flex-1 truncate">{t(item.titleKey)}</span>
                  )}
                  {(isMobile || !collapsed) && hasNewInquiries && (
                    <span className="ml-auto inline-flex items-center justify-center rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-white shadow-sm ring-1 ring-amber-400/40">
                      {newDealerInquiriesCount}
                    </span>
                  )}
                </Link>
              );
            })}
        </div>

        {/* Settings Menu */}
        <div className="mt-8 space-y-1">
          {(isMobile || !collapsed) && (
            <p className="mb-2 px-3 text-xs font-medium tracking-wider text-white/40 uppercase">
              {t('admin.sidebar.settings_section')}
            </p>
          )}
          {settingsNavItems
            .filter((item) => hasPermission(item.permission))
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={cn(
                  'flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition-all',
                  !isMobile && collapsed ? 'justify-center px-2' : 'px-3',
                  isActive(item.href)
                    ? 'bg-white/15 text-white shadow-lg'
                    : 'text-white/70 hover:bg-white/10 hover:text-white',
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {(isMobile || !collapsed) && (
                  <span className="truncate">{t(item.titleKey)}</span>
                )}
              </Link>
            ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-4">
        <Link
          href="/"
          onClick={handleNavClick}
          className={cn(
            'flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white',
            !isMobile && collapsed ? 'justify-center px-2' : 'px-3',
          )}
        >
          <Store className="h-5 w-5 flex-shrink-0" />
          {(isMobile || !collapsed) && (
            <span className="truncate">{t('admin.sidebar.view_store')}</span>
          )}
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-gradient-to-b from-teal-900 via-teal-800 to-teal-950 transition-transform duration-300 lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <SidebarContent isMobile />
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 hidden flex-col bg-gradient-to-b from-teal-900 via-teal-800 to-teal-950 transition-all duration-300 lg:flex',
          collapsed ? 'w-20' : 'w-72',
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
