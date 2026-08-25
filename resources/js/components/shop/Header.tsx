import LanguageSwitcher from '@/components/LanguageSwitcher';
import { NAV_ITEMS } from '@/data/constants';
import { useTranslation } from '@/hooks/use-translation';
import { SiteSettings } from '@/types';
import { ApiCategory } from '@/types/shop';
import { Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ChevronDown,
    Heart,
    LayoutDashboard,
    LogOut,
    Menu,
    Package,
    Search,
    Settings,
    ShieldCheck,
    ShoppingBag,
    User,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface AuthUser {
    id: number;
    name: string;
    email: string;
    avatar_url?: string;
    roles?: string[];
}

interface HeaderProps {
    cartCount: number;
    onCartClick: () => void;
    onLogoClick: () => void;
    bannerVisible?: boolean;
    featuredCategories?: ApiCategory[];
}

const PRODUCT_SUB_MENU = [
    { name: 'Accessories', href: '/shop/products?category=accessories' },
    { name: 'Bar Sets', href: '/shop/products?category=bar-sets' },
    { name: 'Chairs', href: '/shop/products?category=chairs' },
    { name: 'Collections', href: '/shop/products?category=collections' },
    { name: 'Comfort Products', href: '/shop/products?category=comfort-products' },
    { name: 'Corner Sets', href: '/shop/products?category=corner-sets' },
    { name: 'Dining Sets', href: '/shop/products?category=dining-sets' },
    { name: 'Flooring', href: '/shop/products?category=flooring' },
    { name: 'Natural Rattan', href: '/shop/products?category=natural-rattan' },
    { name: 'Sun Loungers', href: '/shop/products?category=sun-loungers' },
    { name: 'Tables', href: '/shop/products?category=tables' },
];

export const Header: React.FC<HeaderProps> = ({
    cartCount,
    onCartClick,
    onLogoClick,
    bannerVisible = false,
    featuredCategories = [],
}) => {
    const { auth, wishlistCount, siteSettings, featuredCategories: sharedCategories } = usePage<{
        auth?: { user?: AuthUser };
        wishlistCount?: number;
        siteSettings?: SiteSettings;
        featuredCategories?: ApiCategory[];
    }>().props;
    const siteName = siteSettings?.site_name || 'Ronica Outdoor Furniture';
    const siteLogo = siteSettings?.site_logo || '/logo-top.png';
    const user = auth?.user;
    const isAdmin = user?.roles?.some((role: string) =>
        ['admin', 'super-admin', 'manager', 'staff'].includes(role),
    ) ?? false;
    const { t } = useTranslation();

    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(e.target as Node)
            ) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (searchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(true);
            }
            if (e.key === 'Escape') {
                setSearchOpen(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const rawCategories =
        featuredCategories && featuredCategories.length > 0
            ? featuredCategories
            : (sharedCategories || []);

    const categoriesArray = Array.isArray(rawCategories)
        ? rawCategories
        : (rawCategories as any)?.data || [];

    const activeCategoriesList =
        categoriesArray && categoriesArray.length > 0
            ? categoriesArray.map((c: any) => ({
                  id: c.id,
                  name:
                      typeof c.name === 'object' && c.name !== null
                          ? c.name.id || c.name.en || Object.values(c.name)[0]
                          : c.name,
                  slug: c.slug,
                  href: `/shop/products?filter[category]=${c.slug}`,
              }))
            : [];

    const handleLogout = () => {
        router.post('/logout');
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.visit(
                `/shop/products?filter[name]=${encodeURIComponent(searchQuery.trim())}`,
            );
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    return (
        <header className="relative sticky top-0 z-40 w-full bg-white shadow-sm">
            {/* Main Navigation */}
            <nav className="py-4">
                <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 md:px-12">
                    {/* Logo */}
                    <div
                        className="group flex cursor-pointer items-center"
                        onClick={onLogoClick}
                    >
                        <img
                            src={siteLogo}
                            alt={siteName}
                            className="h-10 md:h-11 w-auto max-w-[220px] object-contain transition-all"
                        />
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden flex-1 items-center justify-center gap-6 xl:gap-14 lg:flex">
                        {NAV_ITEMS.map((item: any) => {
                            if (item.hasDropdown) {
                                const categoriesList = activeCategoriesList;

                                return (
                                    <div
                                        key={item.labelKey}
                                        className="group relative py-2"
                                    >
                                        <Link
                                            href={item.href}
                                            className="flex items-center gap-1 text-base xl:text-lg font-medium text-neutral-800 transition-colors hover:text-teal-500"
                                        >
                                            {t(item.labelKey)}
                                            <span className="ml-0.5 text-sm font-light text-neutral-400 transition-colors group-hover:text-teal-500">
                                                +
                                            </span>
                                        </Link>

                                        {/* Submenu Dropdown */}
                                        <div className="invisible absolute top-full left-0 z-50 w-60 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                                            <div className="mt-2 rounded-sm border border-neutral-100 bg-white py-3 shadow-xl">
                                                {categoriesList.map((subItem: any) => (
                                                    <Link
                                                        key={
                                                            subItem.id ||
                                                            subItem.href ||
                                                            subItem.name
                                                        }
                                                        href={
                                                            subItem.slug
                                                                ? `/shop/products?filter[category]=${subItem.slug}`
                                                                : subItem.href
                                                        }
                                                        className="block px-6 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-teal-500"
                                                    >
                                                        {subItem.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <Link
                                    key={item.labelKey}
                                    href={item.href}
                                    className="text-base xl:text-lg font-medium text-neutral-800 transition-colors hover:text-teal-500"
                                >
                                    {t(item.labelKey)}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Side Icons */}
                    <div className="flex items-center justify-end gap-1 md:gap-2">
                        {/* Language Switcher */}
                        <LanguageSwitcher variant="toggle" className="hidden md:flex" />

                        {/* Cart hidden for product showcase site */}

                        {/* Admin Panel Quick Access Button */}
                        {user && isAdmin && (
                            <Link
                                href="/admin"
                                className="hidden items-center gap-1.5 rounded-sm bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-neutral-800 md:flex"
                            >
                                <ShieldCheck size={16} className="text-teal-400" />
                                <span>{t('shop.header.admin_panel')}</span>
                            </Link>
                        )}

                        {/* User Menu */}
                        {user ? (
                            <div
                                className="relative hidden md:block"
                                ref={userMenuRef}
                            >
                                <button
                                    onClick={() =>
                                        setUserMenuOpen(!userMenuOpen)
                                    }
                                    className="flex items-center gap-2 rounded-sm p-2 text-neutral-700 transition-colors hover:bg-neutral-100"
                                >
                                    {user.avatar_url ? (
                                        <img
                                            src={user.avatar_url}
                                            alt={user.name}
                                            className="h-8 w-8 rounded-sm object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-teal-500/20">
                                            <User
                                                size={18}
                                                className="text-teal-500"
                                            />
                                        </div>
                                    )}
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 z-50 mt-2 w-56 rounded-sm border border-neutral-100 bg-white py-2 shadow-lg">
                                        <div className="border-b border-neutral-100 px-4 py-3">
                                            <p className="truncate font-medium text-neutral-800">
                                                {user.name}
                                            </p>
                                            <p className="truncate text-sm text-neutral-500">
                                                {user.email}
                                            </p>
                                        </div>
                                        {isAdmin && (
                                            <Link
                                                href="/admin"
                                                className="flex items-center gap-3 px-4 py-2.5 font-medium text-teal-600 transition-colors hover:bg-teal-50"
                                            >
                                                <LayoutDashboard size={18} />
                                                <span>{t('shop.header.admin_panel')}</span>
                                            </Link>
                                        )}

                                        <Link
                                            href={
                                                (user as any).roles?.includes(
                                                    'super-admin',
                                                ) ||
                                                    (user as any).roles?.includes(
                                                        'admin',
                                                    )
                                                    ? '/admin/settings'
                                                    : '/settings/profile'
                                            }
                                            className="flex items-center gap-3 px-4 py-2.5 text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-teal-500"
                                        >
                                            <Settings size={18} />
                                            <span>{t('shop.header.settings')}</span>
                                        </Link>
                                        <div className="mt-2 border-t border-neutral-100 pt-2">
                                            <button
                                                onClick={handleLogout}
                                                className="flex w-full items-center gap-3 px-4 py-2.5 text-red-600 transition-colors hover:bg-red-50"
                                            >
                                                <LogOut size={18} />
                                                <span>{t('common.logout')}</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="hidden items-center gap-2 rounded-sm bg-teal-500 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-teal-600 md:flex"
                            >
                                <User size={16} />
                                <span>{t('shop.header.sign_in')}</span>
                            </Link>
                        )}

                        {/* Mobile Menu */}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="p-2.5 text-neutral-700 lg:hidden"
                        >
                            <Menu size={22} />
                        </button>
                    </div>
                </div>
            </nav>


            {/* Search Modal */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-24 backdrop-blur-sm"
                        onClick={() => setSearchOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="mx-4 w-full max-w-2xl overflow-hidden rounded-sm bg-white shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <form
                                onSubmit={handleSearch}
                                className="flex items-center gap-4 p-5"
                            >
                                <Search
                                    size={22}
                                    className="flex-shrink-0 text-neutral-400"
                                />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder={t('shop.header.search_placeholder')}
                                    className="flex-1 text-lg outline-none placeholder:text-neutral-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setSearchOpen(false)}
                                    className="rounded-sm p-2 transition-colors hover:bg-neutral-100"
                                >
                                    <X size={20} className="text-neutral-500" />
                                </button>
                            </form>
                            <div className="border-t border-neutral-100 bg-neutral-50 px-5 py-3">
                                <p className="text-xs text-neutral-500">
                                    {t('shop.header.search_hint', { key: 'Enter', esc: 'Esc' })}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Sidebar Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
                        />
                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{
                                type: 'spring',
                                damping: 25,
                                stiffness: 200,
                            }}
                            className="fixed top-0 left-0 z-50 flex h-full w-full max-w-xs flex-col bg-white shadow-2xl lg:hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-neutral-100 p-5">
                                <img
                                    src={siteLogo}
                                    alt={siteName}
                                    className="h-7 w-auto object-contain"
                                />
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-sm p-2 text-neutral-500 hover:bg-neutral-100"
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-5">
                                {/* Navigation Links */}
                                <div className="mb-6">
                                    <h3 className="mb-3 text-xs font-semibold tracking-wide text-neutral-400 uppercase">
                                        {t('shop.header.menu')}
                                    </h3>
                                    <div className="space-y-1">
                                        {NAV_ITEMS.map((item) => (
                                            <Link
                                                key={item.labelKey}
                                                href={item.href}
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                                className="block rounded-sm px-3 py-2.5 font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-teal-500"
                                            >
                                                {t(item.labelKey)}
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Categories */}
                                <div className="mb-6">
                                    <h3 className="mb-3 text-xs font-semibold tracking-wide text-neutral-400 uppercase">
                                        {t('shop.header.categories')}
                                    </h3>
                                    <div className="space-y-1">
                                        {activeCategoriesList.map(
                                            (subItem: any) => (
                                                <Link
                                                    key={subItem.name}
                                                    href={subItem.href}
                                                    onClick={() =>
                                                        setMobileMenuOpen(
                                                            false,
                                                        )
                                                    }
                                                    className="block rounded-sm px-3 py-2.5 text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-teal-500"
                                                >
                                                    {subItem.name}
                                                </Link>
                                            ),
                                        )}
                                    </div>
                                </div>

                                {/* User Section */}
                                {user ? (
                                    <div className="border-t border-neutral-100 pt-6">
                                        <div className="mb-4 flex items-center gap-3 px-3">
                                            {user.avatar_url ? (
                                                <img
                                                    src={user.avatar_url}
                                                    alt={user.name}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500/20">
                                                    <User
                                                        size={20}
                                                        className="text-teal-500"
                                                    />
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-medium text-neutral-800">
                                                    {user.name}
                                                </p>
                                                <p className="truncate text-sm text-neutral-500">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            {isAdmin && (
                                                <Link
                                                    href="/admin"
                                                    onClick={() =>
                                                        setMobileMenuOpen(false)
                                                    }
                                                    className="flex items-center gap-3 rounded-sm bg-teal-50 px-3 py-2.5 font-medium text-teal-700 hover:bg-teal-100"
                                                >
                                                    <LayoutDashboard size={18} />
                                                    <span>{t('shop.header.admin_panel')}</span>
                                                </Link>
                                            )}

                                            <Link
                                                href={
                                                    (
                                                        user as any
                                                    ).roles?.includes(
                                                        'super-admin',
                                                    ) ||
                                                        (
                                                            user as any
                                                        ).roles?.includes('admin')
                                                        ? '/admin/settings'
                                                        : '/settings/profile'
                                                }
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                                className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-neutral-600 hover:bg-neutral-50 hover:text-teal-500"
                                            >
                                                <Settings size={18} />
                                                <span>{t('shop.header.settings')}</span>
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setMobileMenuOpen(false);
                                                    handleLogout();
                                                }}
                                                className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-red-600 hover:bg-red-50"
                                            >
                                                <LogOut size={18} />
                                                <span>{t('common.logout')}</span>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="border-t border-neutral-100 pt-6">
                                        <Link
                                            href="/login"
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                            className="flex w-full items-center justify-center gap-2 rounded-sm bg-teal-500 px-5 py-3 font-medium text-white transition-colors hover:bg-teal-600"
                                        >
                                            <User size={18} />
                                            <span>{t('shop.header.sign_in_register')}</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
