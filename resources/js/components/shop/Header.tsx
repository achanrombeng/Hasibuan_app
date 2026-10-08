import LanguageSwitcher from '@/components/LanguageSwitcher';
import { CatalogModal } from '@/components/shop/CatalogModal';
import { ConfirmDialog } from '@/components/ui/alert-dialog';
import { NAV_ITEMS } from '@/data/constants';
import { useTranslation } from '@/hooks/use-translation';
import { SiteSettings } from '@/types';
import { ApiCategory, ApiProduct } from '@/types/shop';
import { Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  Loader2,
  Menu,
  Search,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface AuthUser {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
  roles?: string[];
}

interface HeaderProps {
  onLogoClick: () => void;
  bannerVisible?: boolean;
  featuredCategories?: ApiCategory[];
}

export const Header: React.FC<HeaderProps> = ({
  onLogoClick,
  bannerVisible = false,
  featuredCategories = [],
}) => {
  const page = usePage<{
    auth?: { user?: AuthUser };
    wishlistCount?: number;
    siteSettings?: SiteSettings;
    featuredCategories?: ApiCategory[];
  }>();
  const {
    auth,
    wishlistCount = 0,
    siteSettings,
    featuredCategories: sharedCategories,
  } = page.props;
  const url = page.url;

  const siteName = siteSettings?.site_name || 'Hasibuan Design';
  const siteLogo = siteSettings?.site_logo;
  const user = auth?.user;
  const isAdmin =
    user?.roles?.some((role: string) =>
      ['admin', 'super-admin', 'manager', 'staff'].includes(role),
    ) ?? false;
  const { t } = useTranslation();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ApiProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catalogModalOpen, setCatalogModalOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [activeMegaCategory, setActiveMegaCategory] = useState<string | null>(
    null,
  );

  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close menus on outside click
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Autofocus search
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Live search debounced
  useEffect(() => {
    if (!searchOpen) {
      setSearchQuery('');
      setSearchResults([]);
      setIsSearching(false);
      setHasSearched(false);
      return;
    }

    const query = searchQuery.trim();
    if (!query) {
      setSearchResults([]);
      setIsSearching(false);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `/shop/products/search?q=${encodeURIComponent(query)}`,
          {
            signal: controller.signal,
            headers: { Accept: 'application/json' },
          },
        );
        if (response.ok) {
          const json = await response.json();
          setSearchResults(json.data || []);
          setHasSearched(true);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Search error:', err);
        }
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery, searchOpen]);

  // Keyboard shortcut cmd+k / esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setActiveMegaCategory(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const rawCategories =
    featuredCategories && featuredCategories.length > 0
      ? featuredCategories
      : sharedCategories || [];

  const categoriesArray = Array.isArray(rawCategories)
    ? rawCategories
    : (rawCategories as any)?.data || [];

  const activeCategoriesList =
    categoriesArray && categoriesArray.length > 0
      ? categoriesArray.map((c: any) => ({
          id: c.id,
          name:
            typeof c.name === 'object' && c.name !== null
              ? c.name.en || c.name.id || Object.values(c.name)[0]
              : c.name,
          slug: c.slug,
          href: `/shop/products?filter[category]=${c.slug}`,
        }))
      : [
          {
            id: '1',
            name: 'LIVING',
            slug: 'chairs',
            href: '/shop/products?filter[category]=chairs',
          },
          {
            id: '2',
            name: 'DINING',
            slug: 'dining-sets',
            href: '/shop/products?filter[category]=dining-sets',
          },
          {
            id: '3',
            name: 'OUTDOOR',
            slug: 'collections',
            href: '/shop/products?filter[category]=collections',
          },
          {
            id: '4',
            name: 'LOUNGERS',
            slug: 'sun-loungers',
            href: '/shop/products?filter[category]=sun-loungers',
          },
          {
            id: '5',
            name: 'BAR SETS',
            slug: 'bar-sets',
            href: '/shop/products?filter[category]=bar-sets',
          },
          {
            id: '6',
            name: 'NATURAL RATTAN',
            slug: 'natural-rattan',
            href: '/shop/products?filter[category]=natural-rattan',
          },
        ];

  const handleSearchSubmit = (e: React.FormEvent) => {
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
    <>
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white transition-all select-none">
        {/* BRAND IDENTITY BAR */}
        <div className="px-4 py-5 sm:px-8 md:py-6">
          <div className="mx-auto flex max-w-[1720px] items-center justify-between">
            {/* Left: Search Trigger (Minimalist Text Button) */}
            <div className="flex flex-1 items-center">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="group hidden cursor-pointer items-center gap-2 text-[11px] font-light tracking-[0.25em] text-neutral-700 uppercase transition-colors hover:text-black md:flex"
                aria-label="Search Collection"
              >
                <Search
                  size={14}
                  strokeWidth={1.5}
                  className="transition-transform group-hover:scale-110"
                />
                <span>SEARCH</span>
              </button>

              {/* Mobile Hamburger Menu */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 text-neutral-800 hover:text-black md:hidden"
                aria-label="Open Navigation"
              >
                <Menu size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* Center: Hasibuan Design Logo */}
            <div className="shrink-0 text-center">
              <Link
                href="/shop"
                onClick={onLogoClick}
                className="group inline-flex cursor-pointer flex-col items-center"
              >
                <img
                  src={siteLogo || '/images/hasibuan-logo.png'}
                  alt={siteName}
                  className="h-9 w-auto object-contain transition-opacity group-hover:opacity-85 sm:h-11 md:h-12"
                />
              </Link>
            </div>

            {/* Right: Saved, Language Switcher, Admin Panel, Sign In / Account */}
            <div className="flex flex-1 items-center justify-end gap-5 sm:gap-7">
              {/* Mobile Search Icon */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-1.5 text-neutral-800 md:hidden"
                aria-label="Search"
              >
                <Search size={18} strokeWidth={1.5} />
              </button>

              {/* Language Switcher */}
              <div className="hidden items-center sm:flex">
                <LanguageSwitcher className="cursor-pointer p-0 text-[11px] font-light tracking-[0.2em] text-neutral-700 hover:text-black" />
              </div>

              {/* Admin Panel Quick Access */}
              {user && isAdmin && (
                <Link
                  href="/admin"
                  className="hidden items-center gap-1 bg-neutral-100 px-2.5 py-1 text-[10px] font-medium tracking-[0.2em] text-neutral-900 transition-colors hover:bg-neutral-200 md:flex"
                >
                  <ShieldCheck size={12} className="text-amber-600" />
                  <span>ADMIN</span>
                </Link>
              )}

              {/* Account / Sign In */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex cursor-pointer items-center gap-1.5 text-[11px] font-light tracking-[0.25em] text-neutral-700 uppercase transition-colors hover:text-black"
                  >
                    <User size={13} strokeWidth={1.5} />
                    <span>{user.name.split(' ')[0]}</span>
                    <ChevronDown size={10} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute top-full right-0 z-50 mt-2 w-48 border border-neutral-200 bg-white py-2 text-neutral-900 shadow-xl">
                      <div className="border-b border-neutral-100 px-4 py-2 text-[11px] font-medium text-neutral-700">
                        {user.name}
                      </div>
                      <Link
                        href="/settings/profile"
                        className="block px-4 py-2 text-[11px] text-neutral-700 hover:bg-neutral-50"
                      >
                        ACCOUNT PROFILE
                      </Link>
                      <Link
                        href="/shop/wishlist"
                        className="block px-4 py-2 text-[11px] text-neutral-700 hover:bg-neutral-50"
                      >
                        SAVED PIECES ({wishlistCount})
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-[11px] font-medium text-neutral-700 hover:bg-neutral-50"
                        >
                          ADMIN DASHBOARD
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          setShowLogoutDialog(true);
                        }}
                        className="w-full cursor-pointer border-t border-neutral-100 px-4 py-2 text-left text-[11px] text-neutral-500 hover:bg-neutral-50 hover:text-black"
                      >
                        SIGN OUT
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 text-[11px] font-light tracking-[0.25em] text-neutral-700 uppercase transition-colors hover:text-black"
                >
                  <User size={13} strokeWidth={1.5} />
                  <span>SIGN IN</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 3. LOWER PRIMARY NAVIGATION BAR */}
        <nav className="hidden border-t border-neutral-200/80 bg-white lg:block">
          <div className="mx-auto max-w-[1720px] px-8">
            <div className="flex items-center justify-center gap-8 py-3.5 text-[11px] font-light tracking-[0.25em] text-neutral-800 uppercase xl:gap-14">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === '/shop'
                    ? url === '/shop' || url === '/'
                    : url.startsWith(item.href);

                if (item.hasDropdown) {
                  return (
                    <div
                      key={item.labelKey}
                      className="group relative py-1"
                      onMouseEnter={() => setActiveMegaCategory('products')}
                      onMouseLeave={() => setActiveMegaCategory(null)}
                    >
                      <Link
                        href={item.href}
                        className={`inline-flex items-center gap-1.5 border-b-2 pb-1 transition-colors ${
                          isActive
                            ? 'border-neutral-900 font-medium text-neutral-950'
                            : 'border-transparent text-neutral-800 hover:border-neutral-900 hover:text-neutral-950'
                        }`}
                      >
                        <span>{t(item.labelKey)}</span>
                        <ChevronDown
                          size={11}
                          className="opacity-60 transition-transform duration-200 group-hover:rotate-180 group-hover:opacity-100"
                        />
                      </Link>

                      {/* Products Mega-Menu Dropdown on Hover */}
                      {activeMegaCategory === 'products' && (
                        <div className="absolute top-full left-1/2 z-50 w-[480px] -translate-x-1/2 border border-neutral-200/90 bg-white p-7 text-left shadow-2xl">
                          <div className="space-y-4">
                            <span className="block border-b border-neutral-100 pb-2 text-[10px] font-light tracking-[0.3em] text-neutral-400 uppercase">
                              {t('shop.header.categories') !==
                              'shop.header.categories'
                                ? t('shop.header.categories')
                                : 'CATEGORIES & COLLECTIONS'}
                            </span>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[11px] font-light tracking-[0.18em] text-neutral-700">
                              {activeCategoriesList.map((cat: any) => (
                                <Link
                                  key={cat.id || cat.slug || cat.name}
                                  href={cat.href}
                                  className="py-1 transition-all hover:translate-x-1 hover:text-black"
                                >
                                  {cat.name}
                                </Link>
                              ))}
                            </div>
                            <div className="border-t border-neutral-100 pt-3">
                              <Link
                                href="/shop/products"
                                className="border-b border-neutral-900 pb-0.5 text-[10px] font-medium tracking-[0.25em] text-neutral-900 uppercase transition-colors hover:border-neutral-500 hover:text-neutral-500"
                              >
                                {t('shop.featured.view_all') !==
                                'shop.featured.view_all'
                                  ? t('shop.featured.view_all')
                                  : 'EXPLORE ALL PRODUCTS'}{' '}
                                &rarr;
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.labelKey}
                    href={item.href}
                    className={`border-b-2 pb-1 transition-colors ${
                      isActive
                        ? 'border-neutral-900 font-medium text-neutral-950'
                        : 'border-transparent text-neutral-800 hover:border-neutral-900 hover:text-neutral-950'
                    }`}
                  >
                    {t(item.labelKey)}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </header>

      {/* 4. HASIBUAN MINIMALIST SEARCH OVERLAY MODAL */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-16 backdrop-blur-sm sm:pt-24">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-3xl border border-neutral-200 bg-white p-6 shadow-2xl sm:p-10"
            >
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute top-6 right-6 text-neutral-400 transition-colors hover:text-black"
                aria-label="Close search"
              >
                <X size={20} strokeWidth={1.5} />
              </button>

              <form onSubmit={handleSearchSubmit} className="space-y-6">
                <span className="block text-[10px] font-light tracking-[0.35em] text-neutral-400 uppercase">
                  SEARCH THE COLLECTION
                </span>

                <div className="relative border-b-2 border-neutral-900 pb-2">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ENTER PRODUCT NAME, COLLECTION, OR MATERIAL..."
                    className="w-full bg-transparent pr-10 font-serif text-base tracking-[0.06em] text-neutral-900 uppercase placeholder:font-sans placeholder:text-neutral-300 focus:outline-none sm:text-xl"
                  />
                  {isSearching ? (
                    <Loader2
                      size={20}
                      className="absolute top-2 right-2 animate-spin text-neutral-400"
                    />
                  ) : (
                    <button
                      type="submit"
                      className="absolute top-1 right-2 text-neutral-900 hover:opacity-60"
                      aria-label="Submit"
                    >
                      <Search size={20} strokeWidth={1.5} />
                    </button>
                  )}
                </div>

                {/* Instant Search Results */}
                {searchResults.length > 0 && (
                  <div className="custom-scrollbar max-h-80 space-y-3 overflow-y-auto pr-2">
                    <span className="block text-[10px] font-light tracking-[0.25em] text-neutral-400 uppercase">
                      MATCHING PIECES ({searchResults.length})
                    </span>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {searchResults.slice(0, 6).map((item) => (
                        <Link
                          key={item.id}
                          href={`/shop/products/${item.slug}`}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center gap-3 border border-neutral-200/60 bg-[#fafaf9] p-2 transition-colors hover:border-neutral-900"
                        >
                          <div className="h-12 w-12 shrink-0 overflow-hidden border border-neutral-200 bg-white">
                            {item.primary_image?.image_url ? (
                              <img
                                src={item.primary_image.image_url}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-[8px] text-neutral-400">
                                Hasibuan
                              </div>
                            )}
                          </div>
                          <div className="overflow-hidden">
                            <h5 className="truncate font-serif text-xs tracking-wide text-neutral-900 uppercase">
                              {item.name}
                            </h5>
                            <span className="text-[10px] tracking-wider text-neutral-500 uppercase">
                              {item.category?.name || 'FURNITURE'}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {hasSearched && searchResults.length === 0 && (
                  <p className="py-4 text-center text-xs font-light tracking-wider text-neutral-500 uppercase">
                    NO PIECES FOUND MATCHING &ldquo;{searchQuery}&rdquo;
                  </p>
                )}

                {/* Quick Link Categories */}
                <div className="flex flex-wrap items-center gap-2 border-t border-neutral-100 pt-4 text-[10px] font-light tracking-[0.2em] text-neutral-600 uppercase">
                  <span className="text-neutral-400">POPULAR:</span>
                  {activeCategoriesList.slice(0, 5).map((cat: any) => (
                    <Link
                      key={cat.id}
                      href={cat.href}
                      onClick={() => setSearchOpen(false)}
                      className="bg-neutral-100 px-2.5 py-1 transition-colors hover:bg-neutral-900 hover:text-white"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. MOBILE DRAWER NAVIGATION */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60"
            />

            {/* Slide-out Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 p-6">
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-block"
                >
                  <img
                    src={siteLogo || '/images/hasibuan-logo.png'}
                    alt={siteName}
                    className="h-8 w-auto object-contain"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-neutral-500 hover:text-black"
                >
                  <X size={22} strokeWidth={1.5} />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex-1 space-y-6 p-6">
                <div className="space-y-4">
                  <span className="block text-[10px] font-light tracking-[0.3em] text-neutral-400 uppercase">
                    {t('shop.header.menu') !== 'shop.header.menu'
                      ? t('shop.header.menu')
                      : 'NAVIGATION'}
                  </span>
                  <div className="space-y-3">
                    {NAV_ITEMS.map((item) => {
                      if (item.hasDropdown) {
                        return (
                          <div key={item.labelKey} className="space-y-2">
                            <Link
                              href={item.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block font-serif text-lg tracking-[0.08em] text-neutral-900 uppercase hover:text-neutral-500"
                            >
                              {t(item.labelKey)}
                            </Link>
                            <div className="space-y-2.5 border-l border-neutral-200 py-1 pl-4">
                              {activeCategoriesList.map((cat: any) => (
                                <Link
                                  key={cat.id || cat.slug || cat.name}
                                  href={cat.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="block text-xs tracking-[0.18em] text-neutral-600 uppercase hover:text-black"
                                >
                                  {cat.name}
                                </Link>
                              ))}
                              <Link
                                href="/shop/products"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block pt-1 text-xs font-medium tracking-[0.18em] text-neutral-900 uppercase hover:text-neutral-500"
                              >
                                ALL PRODUCTS &rarr;
                              </Link>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <Link
                          key={item.labelKey}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block font-serif text-lg tracking-[0.08em] text-neutral-900 uppercase hover:text-neutral-500"
                        >
                          {t(item.labelKey)}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3 border-t border-neutral-100 pt-6">
                  <span className="block text-[10px] font-light tracking-[0.3em] text-neutral-400 uppercase">
                    SERVICES & CLIENT SERVICES
                  </span>
                  <Link
                    href="/shop/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-xs tracking-[0.2em] text-neutral-700 uppercase hover:text-black"
                  >
                    GALLERIES & ARCHITECTURE
                  </Link>
                  <Link
                    href="/shop/custom-order"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-xs tracking-[0.2em] text-neutral-700 uppercase hover:text-black"
                  >
                    INTERIOR DESIGN ATELIER
                  </Link>
                  <Link
                    href="/shop/dealer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-xs tracking-[0.2em] text-neutral-700 uppercase hover:text-black"
                  >
                    TRADE & B2B PROGRAM
                  </Link>
                  <Link
                    href="/shop/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-xs tracking-[0.2em] text-neutral-700 uppercase hover:text-black"
                  >
                    SAVED PIECES ({wishlistCount})
                  </Link>
                  <Link
                    href="/shop/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-xs tracking-[0.2em] text-neutral-700 uppercase hover:text-black"
                  >
                    CLIENT SERVICES / CONTACT
                  </Link>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="space-y-4 border-t border-neutral-200 bg-[#fafaf9] p-6">
                <div className="flex items-center justify-between border-b border-neutral-200/80 pb-3">
                  <span className="text-[10px] font-light tracking-[0.25em] text-neutral-400 uppercase">
                    LANGUAGE
                  </span>
                  <LanguageSwitcher className="p-0 text-xs font-medium" />
                </div>

                {user ? (
                  <div className="flex items-center justify-between text-xs tracking-wider">
                    <span className="font-medium text-neutral-900">
                      {user.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setShowLogoutDialog(true);
                      }}
                      className="text-neutral-500 hover:text-black"
                    >
                      SIGN OUT
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full border border-neutral-900 py-3 text-center text-[11px] font-medium tracking-[0.25em] text-neutral-900 uppercase transition-colors hover:bg-neutral-900 hover:text-white"
                  >
                    SIGN IN TO ACCOUNT
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3D Flipbook Source Books Modal */}
      <CatalogModal
        isOpen={catalogModalOpen}
        onClose={() => setCatalogModalOpen(false)}
        initialMode="3d"
      />

      {/* Logout confirmation dialog */}
      <ConfirmDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        title={
          t('auth.logout.title') !== 'auth.logout.title'
            ? t('auth.logout.title')
            : 'Sign Out'
        }
        description={
          t('auth.logout.description') !== 'auth.logout.description'
            ? t('auth.logout.description')
            : 'Are you sure you want to sign out of your account?'
        }
        confirmText={
          t('auth.logout.confirm') !== 'auth.logout.confirm'
            ? t('auth.logout.confirm')
            : 'Sign Out'
        }
        cancelText={
          t('common.cancel') !== 'common.cancel' ? t('common.cancel') : 'Cancel'
        }
        variant="danger"
        onConfirm={() => router.post('/logout')}
      />
    </>
  );
};

export default Header;
