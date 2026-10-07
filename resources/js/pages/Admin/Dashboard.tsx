import { useTranslation } from '@/hooks/use-translation';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link } from '@inertiajs/react';
import {
  ArrowUpRight,
  BookOpen,
  Briefcase,
  ExternalLink,
  FileText,
  FolderTree,
  Globe,
  Home,
  Info,
  Package,
  Phone,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';

interface DashboardProps {
  stats: {
    totalProducts: number;
    totalCategories?: number;
    activeBanners?: number;
    totalInquiries?: number;
    totalArticles?: number;
    totalReviews?: number;
    totalOrders?: number;
    totalCustomers?: number;
    totalRevenue?: number;
    ordersGrowth?: number;
    revenueGrowth?: number;
  };
  recentOrders?: {
    data: Array<{
      id: number;
      order_number: string;
      customer: string;
      total: string;
      status: string;
      created_at: string;
    }>;
    links: Array<{ url: string | null; label: string; active: boolean }>;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
  };
}

export default function Dashboard({ stats }: DashboardProps) {
  const { t } = useTranslation();

  const pageMenuItems = [
    {
      title: 'Home',
      desc: 'Hero banner, lookbook carousel, trust logos, Vitruvian values, and craftsmanship pillars.',
      href: '/admin/settings/homepage',
      icon: Home,
      tag: 'HERO & LOOKBOOK',
    },
    {
      title: 'About Us',
      desc: 'Brand heritage, artisanal philosophy, showroom spaces, and craft milestones.',
      href: '/admin/settings/about',
      icon: Info,
      tag: 'HERITAGE & VISION',
    },
    {
      title: 'Products',
      desc: 'Architectural furniture collection, specs, dimensions, high-res photos, and teak finishes.',
      href: '/admin/products',
      icon: Package,
      tag: 'CATALOG & FINISHES',
    },
    {
      title: 'Blog / Journal',
      desc: 'Architectural case studies, design publications, editorial notes, and press coverage.',
      href: '/admin/articles',
      icon: FileText,
      tag: 'JOURNAL & PRESS',
    },
    {
      title: 'Dealer & Trade',
      desc: 'Hospitality inquiries, contract design proposals, trade discounts, and B2B requests.',
      href: '/admin/dealer-inquiries',
      icon: Briefcase,
      tag: 'TRADE & CONTRACTS',
    },
    {
      title: 'Contacts & Showroom',
      desc: 'Flagship showroom location, Jepara factory address, interactive maps, and WhatsApp desk.',
      href: '/admin/settings',
      icon: Phone,
      tag: 'SHOWROOM & CONTACTS',
    },
  ];

  return (
    <AdminLayout>
      <Head title={t('admin.dashboard.title') || 'Dashboard Showcase'} />

      <div className="space-y-10">
        {/* Page Monumental Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-neutral-200/80 pb-8 md:flex-row md:items-end">
          <div>
            <div className="mb-2.5 flex items-center gap-2.5">
              <span className="text-[10px] font-light tracking-[0.35em] text-neutral-400 uppercase">
                RH ARCHITECTURAL CURATION CONSOLE
              </span>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-[10px] font-medium tracking-[0.2em] text-emerald-700 uppercase">
                Live Storefront
              </span>
            </div>
            <h1 className="font-serif text-3xl font-light tracking-[0.06em] text-neutral-900 uppercase sm:text-4xl lg:text-5xl">
              {t('admin.dashboard.showcase_title') || 'Dashboard Showcase'}
            </h1>
            <p className="mt-2.5 max-w-2xl text-xs font-light tracking-wide text-neutral-500 sm:text-sm">
              Vitruvian proportion, architectural teak lookbooks, and luxury showroom catalog management.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/settings/homepage"
              className="inline-flex items-center gap-2 border border-neutral-300 bg-white px-4 py-2.5 text-xs font-light tracking-[0.2em] text-neutral-800 uppercase transition-all hover:border-neutral-900 hover:bg-neutral-50"
            >
              <SlidersHorizontal size={14} strokeWidth={1.5} />
              <span>Homepage Settings</span>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 border border-neutral-950 bg-neutral-950 px-4 py-2.5 text-xs font-light tracking-[0.2em] text-white uppercase transition-all hover:bg-neutral-800"
            >
              <ExternalLink size={14} strokeWidth={1.5} />
              <span>View Storefront</span>
            </Link>
          </div>
        </div>

        {/* 1. Metric Stat Pillars */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Stat 1: Products */}
          <Link
            href="/admin/products"
            className="group flex flex-col justify-between border border-neutral-200/80 bg-white p-6 shadow-sm transition-all hover:border-neutral-900 hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium tracking-[0.25em] text-neutral-400 uppercase">
                  SHOWCASE PRODUCTS
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition-colors group-hover:bg-neutral-900 group-hover:text-white">
                  <Package size={15} strokeWidth={1.5} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-serif text-3xl font-light tracking-tight text-neutral-900 sm:text-4xl">
                  {stats.totalProducts ?? 0}
                </span>
                <span className="text-xs font-light text-neutral-400">items</span>
              </div>
              <p className="mt-1 text-xs font-light text-neutral-500">
                Active luxury furniture catalog
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 border-t border-neutral-100 pt-3 text-[11px] font-medium tracking-[0.15em] text-neutral-600 uppercase transition-colors group-hover:text-black">
              <span>Manage Products</span>
              <ArrowUpRight size={13} strokeWidth={1.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </Link>

          {/* Stat 2: Categories */}
          <Link
            href="/admin/categories"
            className="group flex flex-col justify-between border border-neutral-200/80 bg-white p-6 shadow-sm transition-all hover:border-neutral-900 hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium tracking-[0.25em] text-neutral-400 uppercase">
                  CATEGORIES ARCHITECTURE
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition-colors group-hover:bg-neutral-900 group-hover:text-white">
                  <FolderTree size={15} strokeWidth={1.5} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-serif text-3xl font-light tracking-tight text-neutral-900 sm:text-4xl">
                  {stats.totalCategories ?? 11}
                </span>
                <span className="text-xs font-light text-neutral-400">spaces</span>
              </div>
              <p className="mt-1 text-xs font-light text-neutral-500">
                Curated room & outdoor collections
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 border-t border-neutral-100 pt-3 text-[11px] font-medium tracking-[0.15em] text-neutral-600 uppercase transition-colors group-hover:text-black">
              <span>Organize Categories</span>
              <ArrowUpRight size={13} strokeWidth={1.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </Link>

          {/* Stat 3: Lookbook Banners */}
          <Link
            href="/admin/settings/homepage"
            className="group flex flex-col justify-between border border-neutral-200/80 bg-white p-6 shadow-sm transition-all hover:border-neutral-900 hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium tracking-[0.25em] text-neutral-400 uppercase">
                  MONUMENTAL LOOKBOOKS
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition-colors group-hover:bg-neutral-900 group-hover:text-white">
                  <SlidersHorizontal size={15} strokeWidth={1.5} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-serif text-3xl font-light tracking-tight text-neutral-900 sm:text-4xl">
                  4
                </span>
                <span className="text-xs font-light text-neutral-400">curated slides</span>
              </div>
              <p className="mt-1 text-xs font-light text-neutral-500">
                RH Outdoor 2026 signature hero lookbook
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 border-t border-neutral-100 pt-3 text-[11px] font-medium tracking-[0.15em] text-neutral-600 uppercase transition-colors group-hover:text-black">
              <span>Customize Hero</span>
              <ArrowUpRight size={13} strokeWidth={1.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </Link>

          {/* Stat 4: Dealer Inquiries */}
          <Link
            href="/admin/dealer-inquiries"
            className="group flex flex-col justify-between border border-neutral-200/80 bg-white p-6 shadow-sm transition-all hover:border-neutral-900 hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium tracking-[0.25em] text-neutral-400 uppercase">
                  DEALER & TRADE DESK
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition-colors group-hover:bg-neutral-900 group-hover:text-white">
                  <Briefcase size={15} strokeWidth={1.5} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-serif text-3xl font-light tracking-tight text-neutral-900 sm:text-4xl">
                  {stats.totalInquiries ?? 0}
                </span>
                <span className="text-xs font-light text-neutral-400">inquiries</span>
              </div>
              <p className="mt-1 text-xs font-light text-neutral-500">
                Trade, architects & hospitality leads
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 border-t border-neutral-100 pt-3 text-[11px] font-medium tracking-[0.15em] text-neutral-600 uppercase transition-colors group-hover:text-black">
              <span>Review Inquiries</span>
              <ArrowUpRight size={13} strokeWidth={1.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </Link>
        </div>

        {/* 2. Hero Lookbook Showcase Hub */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Main Lookbook Showcase Card */}
          <div className="relative overflow-hidden border border-neutral-800 bg-[#111110] p-8 text-white shadow-lg lg:col-span-8">
            {/* Background subtle image */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity filter transition-all duration-700 hover:scale-105"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop")',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent" />

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="border border-[#c5a880]/40 bg-[#1f1a14] px-2.5 py-1 text-[9px] font-medium tracking-[0.3em] text-[#d6b78d] uppercase">
                    ACTIVE STOREFRONT THEME
                  </span>
                  <span className="text-[10px] font-light tracking-[0.25em] text-neutral-400 uppercase">
                    RH OUTDOOR 2026
                  </span>
                </div>

                <h2 className="mt-4 font-serif text-2xl font-light tracking-[0.06em] text-white uppercase sm:text-3xl md:text-4xl">
                  THE ARCHITECTURAL TEAK & ROPE COLLECTION
                </h2>
                <p className="mt-2 max-w-xl text-xs font-light leading-relaxed tracking-wide text-neutral-300 sm:text-sm">
                  Vitruvian Balance, Enduring Proportion & Master Craftsmanship from Jepara.
                </p>

                <div className="mt-6 flex flex-wrap gap-2 text-[10px] font-light tracking-[0.2em] text-neutral-400 uppercase">
                  <span className="border border-white/10 bg-white/5 px-2.5 py-1">
                    4 Lookbook Slides
                  </span>
                  <span className="border border-white/10 bg-white/5 px-2.5 py-1">
                    6 Press Accreditations
                  </span>
                  <span className="border border-white/10 bg-white/5 px-2.5 py-1">
                    3 Vitruvian Values
                  </span>
                  <span className="border border-white/10 bg-white/5 px-2.5 py-1">
                    2 Material Pillars
                  </span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/admin/settings/homepage"
                  className="inline-flex items-center gap-2 border border-white bg-white px-5 py-2.5 text-xs font-light tracking-[0.2em] text-neutral-950 uppercase transition-all hover:bg-neutral-200"
                >
                  <SlidersHorizontal size={13} strokeWidth={1.5} />
                  <span>Edit Homepage Content</span>
                </Link>
                <Link
                  href="/"
                  target="_blank"
                  className="inline-flex items-center gap-2 border border-white/30 bg-white/10 px-5 py-2.5 text-xs font-light tracking-[0.2em] text-white uppercase transition-all hover:bg-white/20"
                >
                  <ExternalLink size={13} strokeWidth={1.5} />
                  <span>Preview Live</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Side Architectural Highlights */}
          <div className="flex flex-col justify-between gap-5 lg:col-span-4">
            {/* Card A: Flipbook & Source Books */}
            <div className="flex flex-1 flex-col justify-between border border-neutral-200/80 bg-white p-6 shadow-sm">
              <div>
                <span className="text-[10px] font-medium tracking-[0.25em] text-neutral-400 uppercase">
                  SOURCE BOOKS & 3D FLIPBOOK
                </span>
                <h3 className="mt-2 font-serif text-lg font-light tracking-[0.06em] text-neutral-900 uppercase">
                  The 2026 Source Books
                </h3>
                <p className="mt-1.5 text-xs font-light leading-relaxed text-neutral-500">
                  Interactive flipbook modal, print catalogue PDF, and architectural design files.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100">
                <Link
                  href="/admin/settings"
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.18em] text-neutral-800 uppercase hover:text-black"
                >
                  <BookOpen size={13} strokeWidth={1.5} />
                  <span>Configure Catalog</span>
                  <ArrowUpRight size={13} strokeWidth={1.5} />
                </Link>
              </div>
            </div>

            {/* Card B: Material Provenance */}
            <div className="flex flex-1 flex-col justify-between border border-neutral-200/80 bg-white p-6 shadow-sm">
              <div>
                <span className="text-[10px] font-medium tracking-[0.25em] text-neutral-400 uppercase">
                  MATERIAL PROVENANCE
                </span>
                <h3 className="mt-2 font-serif text-lg font-light tracking-[0.06em] text-neutral-900 uppercase">
                  Craftsmanship & Teak
                </h3>
                <p className="mt-1.5 text-xs font-light leading-relaxed text-neutral-500">
                  All-weather hand-weaving by Cirebon masters and Grade-A certified Blora teak wood.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100">
                <Link
                  href="/admin/settings/homepage#craftsmanship"
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.18em] text-neutral-800 uppercase hover:text-black"
                >
                  <Sparkles size={13} strokeWidth={1.5} />
                  <span>Edit Craftsmanship</span>
                  <ArrowUpRight size={13} strokeWidth={1.5} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Flat Page Management Hub ("Menu Per Halaman") */}
        <div className="space-y-6">
          <div className="flex items-end justify-between border-b border-neutral-200/80 pb-4">
            <div>
              <span className="text-[10px] font-light tracking-[0.3em] text-neutral-400 uppercase">
                CONTENT ARCHITECTURE
              </span>
              <h2 className="font-serif text-2xl font-light tracking-[0.06em] text-neutral-900 uppercase">
                Storefront Pages Hub
              </h2>
            </div>
            <span className="text-xs font-light text-neutral-400">
              6 Active Architectural Pages
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {pageMenuItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group flex flex-col justify-between border border-neutral-200/80 bg-white p-6 shadow-sm transition-all hover:border-neutral-900 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium tracking-[0.25em] text-[#917248] uppercase">
                      {item.tag}
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-50 text-neutral-600 transition-colors group-hover:bg-neutral-900 group-hover:text-white">
                      <item.icon size={15} strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3 className="mt-3 font-serif text-xl font-light tracking-[0.06em] text-neutral-900 uppercase group-hover:text-black">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs font-light leading-relaxed text-neutral-500">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-3.5 text-[11px] font-medium tracking-[0.18em] text-neutral-700 uppercase transition-colors group-hover:text-black">
                  <span>Manage {item.title}</span>
                  <ArrowUpRight size={13} strokeWidth={1.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 4. Architectural System Status Overview */}
        <div className="border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#917248]" />
                <span className="text-[10px] font-medium tracking-[0.25em] text-neutral-400 uppercase">
                  STOREFRONT SYSTEM ENGINE
                </span>
              </div>
              <h3 className="font-serif text-lg font-light tracking-wide text-neutral-900 uppercase">
                Restoration Hardware Luxury Edition 2026
              </h3>
              <p className="text-xs font-light text-neutral-500">
                Responsive architectural layout, dual-language Indonesian & English support, high-density WebP imagery.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-light tracking-wider text-neutral-600 uppercase">
              <div className="border-l border-neutral-200 pl-4">
                <p className="text-[10px] text-neutral-400">LANGUAGE</p>
                <p className="font-medium text-neutral-900">EN / ID Active</p>
              </div>
              <div className="border-l border-neutral-200 pl-4">
                <p className="text-[10px] text-neutral-400">SPEED ENGINE</p>
                <p className="font-medium text-neutral-900">Vite + Inertia</p>
              </div>
              <div className="border-l border-neutral-200 pl-4">
                <p className="text-[10px] text-neutral-400">STOREFRONT STATUS</p>
                <p className="font-medium text-emerald-700">Healthy (200 OK)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
