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
  Phone,
  Settings,
  Star,
  Store,
  UserCog,
  Users,
  X,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { SharedData } from '@/types';

export interface NavItem {
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
  // --- MENU PER HALAMAN (Direct flat links) ---
  {
    titleKey: 'admin.sidebar.page_home',
    href: '/admin/settings/homepage',
    icon: LayoutTemplate,
    permission: 'manage settings',
  },
  {
    titleKey: 'admin.sidebar.page_about',
    href: '/admin/settings/about',
    icon: Info,
    permission: 'manage settings',
  },
  {
    titleKey: 'admin.sidebar.page_products',
    href: '/admin/products',
    icon: Package,
    permission: 'view products',
  },
  {
    titleKey: 'admin.sidebar.page_blog',
    href: '/admin/articles',
    icon: FileText,
    permission: 'view articles',
  },
  {
    titleKey: 'admin.sidebar.page_dealer',
    href: '/admin/dealer-inquiries',
    icon: Briefcase,
  },
  {
    titleKey: 'admin.sidebar.page_contacts',
    href: '/admin/settings',
    icon: Phone,
    permission: 'manage settings',
  },
  // --- GENERAL SETTINGS ---
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
  const { siteSettings, newDealerInquiriesCount } = usePage<SharedData>().props;
  const siteName = siteSettings?.site_name || 'Hasibuan Design';

  // Check if user has permission
  const hasPermission = (permission?: string) => {
    if (!permission) return true;
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
    setMobileOpen(false);
  };

  const { t } = useTranslation();

  const renderNavItem = (item: NavItem, isMobile: boolean) => {
    const isDealerInquiries =
      item.href === '/admin/dealer-inquiries' ||
      item.titleKey === 'admin.sidebar.page_dealer';
    const hasNewInquiries =
      isDealerInquiries && (newDealerInquiriesCount ?? 0) > 0;

    return (
      <Link
        key={item.href + item.titleKey}
        href={item.href}
        onClick={handleNavClick}
        className={cn(
          'group relative flex items-center gap-3 py-2.5 text-xs font-light tracking-[0.1em] uppercase transition-all',
          !isMobile && collapsed ? 'justify-center px-2' : 'px-3.5',
          isActive(item.href)
            ? 'border-l-2 border-white bg-neutral-900 text-white shadow-sm'
            : 'text-neutral-400 hover:bg-neutral-900/80 hover:text-white',
        )}
        title={
          !isMobile && collapsed
            ? `${t(item.titleKey)}${
                hasNewInquiries ? ` (${newDealerInquiriesCount} new)` : ''
              }`
            : undefined
        }
      >
        <div className="relative flex items-center justify-center">
          <item.icon className="h-4 w-4 flex-shrink-0" />
          {!isMobile && collapsed && hasNewInquiries && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white ring-2 ring-[#111110]"></span>
            </span>
          )}
        </div>

        {(isMobile || !collapsed) && (
          <span className="flex-1 truncate">{t(item.titleKey)}</span>
        )}

        {(isMobile || !collapsed) && hasNewInquiries && (
          <span className="ml-auto inline-flex items-center justify-center rounded border border-neutral-700 bg-neutral-800 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-neutral-200">
            {newDealerInquiriesCount}
          </span>
        )}
      </Link>
    );
  };

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-neutral-800/80 px-4">
        <Link
          href="/admin"
          className="flex items-center gap-3"
          onClick={handleNavClick}
        >
          {!isMobile && collapsed ? (
            <span className="font-serif text-lg font-light tracking-[0.2em] text-white">
              HD
            </span>
          ) : (
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-light tracking-[0.2em] text-white">
                  HASIBUAN
                </span>
                <span className="border border-neutral-700 bg-neutral-800 px-1.5 py-0.5 text-[9px] font-medium tracking-[0.25em] text-neutral-300 uppercase">
                  ADMIN
                </span>
              </div>
              <span className="mt-0.5 text-[8px] font-light tracking-[0.35em] text-neutral-400 uppercase">
                {siteName}
              </span>
            </div>
          )}
        </Link>
        {isMobile ? (
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        ) : (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-white cursor-pointer',
              collapsed && 'mx-auto',
            )}
          >
            <ChevronLeft
              className={cn(
                'h-4 w-4 transition-transform',
                collapsed && 'rotate-180',
              )}
            />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-x-hidden overflow-y-auto px-3 py-4">
        {/* Main Menu */}
        <div className="space-y-0.5">
          {(isMobile || !collapsed) && (
            <p className="mb-2 px-3 text-[10px] font-medium tracking-[0.25em] text-neutral-500 uppercase">
              {t('admin.sidebar.main_menu')}
            </p>
          )}
          {mainNavItems
            .filter((item) => hasPermission(item.permission))
            .map((item) => renderNavItem(item, isMobile))}
        </div>

        {/* Settings Menu */}
        <div className="mt-8 space-y-0.5">
          {(isMobile || !collapsed) && (
            <p className="mb-2 px-3 text-[10px] font-medium tracking-[0.25em] text-neutral-500 uppercase">
              {t('admin.sidebar.settings_section')}
            </p>
          )}
          {settingsNavItems
            .filter((item) => hasPermission(item.permission))
            .map((item) => renderNavItem(item, isMobile))}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-neutral-800/80 p-4">
        <Link
          href="/"
          target="_blank"
          onClick={handleNavClick}
          className={cn(
            'flex items-center gap-3 py-2.5 text-xs font-light tracking-[0.12em] text-neutral-400 uppercase transition-all hover:bg-neutral-900 hover:text-white',
            !isMobile && collapsed ? 'justify-center px-2' : 'px-3',
          )}
        >
          <Store className="h-4 w-4 flex-shrink-0" />
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
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-neutral-800/80 bg-[#111110] transition-transform duration-300 lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <SidebarContent isMobile />
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 hidden flex-col border-r border-neutral-800/80 bg-[#111110] transition-all duration-300 lg:flex',
          collapsed ? 'w-20' : 'w-72',
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
