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
  BookOpen,
  ChevronDown,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Search,
  Settings,
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
          { id: '1', name: 'LIVING', slug: 'chairs', href: '/shop/products?filter[category]=chairs' },
          { id: '2', name: 'DINING', slug: 'dining-sets', href: '/shop/products?filter[category]=dining-sets' },
          { id: '3', name: 'OUTDOOR', slug: 'collections', href: '/shop/products?filter[category]=collections' },
          { id: '4', name: 'LOUNGERS', slug: 'sun-loungers', href: '/shop/products?filter[category]=sun-loungers' },
          { id: '5', name: 'BAR SETS', slug: 'bar-sets', href: '/shop/products?filter[category]=bar-sets' },
          { id: '6', name: 'NATURAL RATTAN', slug: 'natural-rattan', href: '/shop/products?filter[category]=natural-rattan' },
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
      <header className="sticky top-0 z-40 w-full bg-white border-b border-neutral-200/80 transition-all select-none">
        
        {/* BRAND IDENTITY BAR */}
        <div className="px-4 sm:px-8 py-5 md:py-6">
          <div className="max-w-[1720px] mx-auto flex items-center justify-between">
            {/* Left: Search Trigger (Minimalist Text Button) */}
            <div className="flex-1 flex items-center">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="hidden md:flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase font-light text-neutral-700 hover:text-black transition-colors cursor-pointer group"
                aria-label="Search Collection"
              >
                <Search size={14} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                <span>SEARCH</span>
              </button>

              {/* Mobile Hamburger Menu */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-1.5 text-neutral-800 hover:text-black"
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
                className="inline-flex flex-col items-center group cursor-pointer"
              >
                <img
                  src={siteLogo || '/images/hasibuan-logo.png'}
                  alt={siteName}
                  className="h-9 sm:h-11 md:h-12 w-auto object-contain transition-opacity group-hover:opacity-85"
                />
              </Link>
            </div>

            {/* Right: Saved, Language Switcher, Admin Panel, Sign In / Account */}
            <div className="flex-1 flex items-center justify-end gap-5 sm:gap-7">
              {/* Mobile Search Icon */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="md:hidden p-1.5 text-neutral-800"
                aria-label="Search"
              >
                <Search size={18} strokeWidth={1.5} />
              </button>


              {/* Language Switcher */}
              <div className="hidden sm:flex items-center">
                <LanguageSwitcher className="p-0 text-[11px] tracking-[0.2em] font-light text-neutral-700 hover:text-black cursor-pointer" />
              </div>

              {/* Admin Panel Quick Access */}
              {user && isAdmin && (
                <Link
                  href="/admin"
                  className="hidden md:flex items-center gap-1 text-[10px] tracking-[0.2em] font-medium text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1 transition-colors"
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
                    className="flex items-center gap-1.5 text-[11px] tracking-[0.25em] uppercase font-light text-neutral-700 hover:text-black transition-colors cursor-pointer"
                  >
                    <User size={13} strokeWidth={1.5} />
                    <span>{user.name.split(' ')[0]}</span>
                    <ChevronDown size={10} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white text-neutral-900 border border-neutral-200 shadow-xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-neutral-100 text-[11px] font-medium text-neutral-700">
                        {user.name}
                      </div>
                      <Link
                        href="/settings/profile"
                        className="block px-4 py-2 text-[11px] hover:bg-neutral-50 text-neutral-700"
                      >
                        ACCOUNT PROFILE
                      </Link>
                      <Link
                        href="/shop/wishlist"
                        className="block px-4 py-2 text-[11px] hover:bg-neutral-50 text-neutral-700"
                      >
                        SAVED PIECES ({wishlistCount})
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-[11px] hover:bg-neutral-50 text-neutral-700 font-medium"
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
                        className="w-full text-left px-4 py-2 text-[11px] hover:bg-neutral-50 text-neutral-500 hover:text-black border-t border-neutral-100 cursor-pointer"
                      >
                        SIGN OUT
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 text-[11px] tracking-[0.25em] uppercase font-light text-neutral-700 hover:text-black transition-colors"
                >
                  <User size={13} strokeWidth={1.5} />
                  <span>SIGN IN</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 3. LOWER PRIMARY NAVIGATION BAR */}
        <nav className="hidden lg:block border-t border-neutral-200/80 bg-white">
          <div className="max-w-[1720px] mx-auto px-8">
            <div className="flex items-center justify-center gap-8 xl:gap-14 py-3.5 text-[11px] tracking-[0.25em] uppercase font-light text-neutral-800">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === '/shop'
                    ? url === '/shop' || url === '/'
                    : url.startsWith(item.href);

                if (item.hasDropdown) {
                  return (
                    <div
                      key={item.labelKey}
                      className="relative group py-1"
                      onMouseEnter={() => setActiveMegaCategory('products')}
                      onMouseLeave={() => setActiveMegaCategory(null)}
                    >
                      <Link
                        href={item.href}
                        className={`transition-colors border-b-2 pb-1 inline-flex items-center gap-1.5 ${
                          isActive
                            ? 'border-neutral-900 text-neutral-950 font-medium'
                            : 'border-transparent text-neutral-800 hover:text-neutral-950 hover:border-neutral-900'
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
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-[760px] bg-white border border-neutral-200/90 shadow-2xl p-8 z-50 text-left">
                          <div className="grid grid-cols-12 gap-8 items-start">
                            {/* Categories Grid */}
                            <div className="col-span-7 space-y-4">
                              <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-light block border-b border-neutral-100 pb-2">
                                {t('shop.header.categories') !== 'shop.header.categories'
                                  ? t('shop.header.categories')
                                  : 'CATEGORIES & COLLECTIONS'}
                              </span>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] tracking-[0.18em] font-light text-neutral-700">
                                {activeCategoriesList.map((cat: any) => (
                                  <Link
                                    key={cat.id || cat.slug || cat.name}
                                    href={cat.href}
                                    className="hover:text-black hover:translate-x-1 transition-all py-1"
                                  >
                                    {cat.name}
                                  </Link>
                                ))}
                              </div>
                              <div className="pt-3 border-t border-neutral-100">
                                <Link
                                  href="/shop/products"
                                  className="text-[10px] tracking-[0.25em] font-medium text-neutral-900 uppercase border-b border-neutral-900 pb-0.5 hover:text-neutral-500 hover:border-neutral-500 transition-colors"
                                >
                                  {t('shop.featured.view_all') !== 'shop.featured.view_all'
                                    ? t('shop.featured.view_all')
                                    : 'EXPLORE ALL PRODUCTS'} &rarr;
                                </Link>
                              </div>
                            </div>

                            {/* Lookbook / Source Book Feature Column */}
                            <div className="col-span-5 bg-neutral-50 p-4 border border-neutral-100">
                              <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-200 mb-3">
                                <img
                                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop"
                                  alt="Catalog Feature"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="text-[9px] tracking-[0.25em] text-neutral-400 uppercase font-light block">
                                SOURCE BOOK
                              </span>
                              <p className="font-serif text-sm tracking-wide text-neutral-900 uppercase mt-1">
                                PRODUCT CATALOG
                              </p>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMegaCategory(null);
                                  setCatalogModalOpen(true);
                                }}
                                className="text-[10px] tracking-[0.2em] text-neutral-600 hover:text-black uppercase mt-2 block font-medium cursor-pointer"
                              >
                                DISCOVER CATALOG &rarr;
                              </button>
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
                    className={`transition-colors border-b-2 pb-1 ${
                      isActive
                        ? 'border-neutral-900 text-neutral-950 font-medium'
                        : 'border-transparent text-neutral-800 hover:text-neutral-950 hover:border-neutral-900'
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

      {/* 4. RH MINIMALIST SEARCH OVERLAY MODAL */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-3xl bg-white border border-neutral-200 shadow-2xl p-6 sm:p-10 relative"
            >
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute top-6 right-6 text-neutral-400 hover:text-black transition-colors"
                aria-label="Close search"
              >
                <X size={20} strokeWidth={1.5} />
              </button>

              <form onSubmit={handleSearchSubmit} className="space-y-6">
                <span className="text-[10px] tracking-[0.35em] uppercase text-neutral-400 font-light block">
                  SEARCH THE COLLECTION
                </span>

                <div className="relative border-b-2 border-neutral-900 pb-2">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ENTER PRODUCT NAME, COLLECTION, OR MATERIAL..."
                    className="w-full text-base sm:text-xl font-serif tracking-[0.06em] uppercase text-neutral-900 placeholder:text-neutral-300 placeholder:font-sans focus:outline-none bg-transparent pr-10"
                  />
                  {isSearching ? (
                    <Loader2
                      size={20}
                      className="absolute right-2 top-2 animate-spin text-neutral-400"
                    />
                  ) : (
                    <button
                      type="submit"
                      className="absolute right-2 top-1 text-neutral-900 hover:opacity-60"
                      aria-label="Submit"
                    >
                      <Search size={20} strokeWidth={1.5} />
                    </button>
                  )}
                </div>

                {/* Instant Search Results */}
                {searchResults.length > 0 && (
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                    <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-light block">
                      MATCHING PIECES ({searchResults.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {searchResults.slice(0, 6).map((item) => (
                        <Link
                          key={item.id}
                          href={`/shop/products/${item.slug}`}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center gap-3 p-2 bg-[#fafaf9] border border-neutral-200/60 hover:border-neutral-900 transition-colors"
                        >
                          <div className="w-12 h-12 bg-white overflow-hidden shrink-0 border border-neutral-200">
                            {item.primary_image?.image_url ? (
                              <img
                                src={item.primary_image.image_url}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-[8px] text-neutral-400">
                                RH
                              </div>
                            )}
                          </div>
                          <div className="overflow-hidden">
                            <h5 className="font-serif text-xs uppercase tracking-wide text-neutral-900 truncate">
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
                  <p className="text-xs text-neutral-500 tracking-wider uppercase font-light text-center py-4">
                    NO PIECES FOUND MATCHING &ldquo;{searchQuery}&rdquo;
                  </p>
                )}

                {/* Quick Link Categories */}
                <div className="pt-4 border-t border-neutral-100 flex flex-wrap items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-light text-neutral-600">
                  <span className="text-neutral-400">POPULAR:</span>
                  {activeCategoriesList.slice(0, 5).map((cat: any) => (
                    <Link
                      key={cat.id}
                      href={cat.href}
                      onClick={() => setSearchOpen(false)}
                      className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-900 hover:text-white transition-colors"
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
              className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
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
              <div className="p-6 space-y-6 flex-1">
                <div className="space-y-4">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-light block">
                    {t('shop.header.menu') !== 'shop.header.menu' ? t('shop.header.menu') : 'NAVIGATION'}
                  </span>
                  <div className="space-y-3">
                    {NAV_ITEMS.map((item) => {
                      if (item.hasDropdown) {
                        return (
                          <div key={item.labelKey} className="space-y-2">
                            <Link
                              href={item.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block font-serif text-lg tracking-[0.08em] uppercase text-neutral-900 hover:text-neutral-500"
                            >
                              {t(item.labelKey)}
                            </Link>
                            <div className="pl-4 border-l border-neutral-200 space-y-2.5 py-1">
                              {activeCategoriesList.map((cat: any) => (
                                <Link
                                  key={cat.id || cat.slug || cat.name}
                                  href={cat.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="block text-xs tracking-[0.18em] uppercase text-neutral-600 hover:text-black"
                                >
                                  {cat.name}
                                </Link>
                              ))}
                              <Link
                                href="/shop/products"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block text-xs tracking-[0.18em] uppercase font-medium text-neutral-900 hover:text-neutral-500 pt-1"
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
                          className="block font-serif text-lg tracking-[0.08em] uppercase text-neutral-900 hover:text-neutral-500"
                        >
                          {t(item.labelKey)}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-100 space-y-3">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-light block">
                    SERVICES & CLIENT SERVICES
                  </span>
                  <Link
                    href="/shop/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-xs tracking-[0.2em] uppercase text-neutral-700 hover:text-black"
                  >
                    GALLERIES & ARCHITECTURE
                  </Link>
                  <Link
                    href="/shop/custom-order"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-xs tracking-[0.2em] uppercase text-neutral-700 hover:text-black"
                  >
                    INTERIOR DESIGN ATELIER
                  </Link>
                  <Link
                    href="/shop/dealer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-xs tracking-[0.2em] uppercase text-neutral-700 hover:text-black"
                  >
                    TRADE & B2B PROGRAM
                  </Link>
                  <Link
                    href="/shop/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-xs tracking-[0.2em] uppercase text-neutral-700 hover:text-black"
                  >
                    SAVED PIECES ({wishlistCount})
                  </Link>
                  <Link
                    href="/shop/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-xs tracking-[0.2em] uppercase text-neutral-700 hover:text-black"
                  >
                    CLIENT SERVICES / CONTACT
                  </Link>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-neutral-200 bg-[#fafaf9] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200/80">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-light">
                    LANGUAGE
                  </span>
                  <LanguageSwitcher className="p-0 text-xs font-medium" />
                </div>

                {user ? (
                  <div className="flex items-center justify-between text-xs tracking-wider">
                    <span className="font-medium text-neutral-900">{user.name}</span>
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
                    className="block w-full py-3 text-center border border-neutral-900 text-[11px] tracking-[0.25em] uppercase font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
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
        title={t('auth.logout.title') !== 'auth.logout.title' ? t('auth.logout.title') : 'Sign Out'}
        description={
          t('auth.logout.description') !== 'auth.logout.description'
            ? t('auth.logout.description')
            : 'Are you sure you want to sign out of your account?'
        }
        confirmText={t('auth.logout.confirm') !== 'auth.logout.confirm' ? t('auth.logout.confirm') : 'Sign Out'}
        cancelText={t('common.cancel') !== 'common.cancel' ? t('common.cancel') : 'Cancel'}
        variant="danger"
        onConfirm={() => router.post('/logout')}
      />
    </>
  );
};

export default Header;
