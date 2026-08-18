import AdminLayout from '@/layouts/admin/admin-layout';
import { compressImage } from '@/utils/image-compress';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
  BookOpen,
  ChevronLeft,
  Eye,
  EyeOff,
  Film,
  Globe,
  Home,
  ArrowDown,
  ArrowUp,
  Image,
  LayoutGrid,
  Link as LinkIcon,
  Loader2,
  Mail,
  MessageSquare,
  Plus,
  Quote,
  Save,
  ShoppingBag,
  SlidersHorizontal,
  Trash2,
  Type,
  Upload,
  Users,
  X,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

interface CarouselBanner {
  id: string;
  image_url: string;
  link?: string;
  sort_order: number;
}

interface HomepageSettingsProps {
  locale: string;
  settings: {
    site_logo?: string;
    hero_badge: string;
    hero_title: string;
    hero_title_highlight: string;
    hero_description: string;
    hero_image_main: string;
    hero_media_type: 'image' | 'video';
    hero_product_name: string;
    trust_logos: string;
    home_values: string;
    carousel_banners: string;
    // Section visibility
    section_carousel_banners_visible: boolean;
    section_hero_visible: boolean;
    section_trust_visible: boolean;
    section_categories_visible: boolean;
    section_catalog_visible: boolean;
    section_values_visible: boolean;
    section_products_visible: boolean;
    section_testimonials_visible: boolean;
    section_newsletter_visible: boolean;
  };
}

interface ValueItem {
  icon: string;
  title: string;
  desc: string;
}

interface TrustLogo {
  name: string;
  logo_url?: string;
}

const SECTIONS = [
  { key: 'logo', label: 'Logo Website', icon: Image, desc: 'Logo toko & header' },
  { key: 'hero', label: 'Hero', icon: Home, desc: 'Banner utama' },
  { key: 'carousel_banners', label: 'Carousel Banner', icon: SlidersHorizontal, desc: 'Banner carousel' },
  { key: 'trust', label: 'Trust Logos', icon: Users, desc: 'Logo media/brand' },
  {
    key: 'categories',
    label: 'Kategori',
    icon: LayoutGrid,
    desc: 'Kategori produk',
  },
  { key: 'catalog', label: 'Katalog', icon: BookOpen, desc: 'Flipbook PDF' },
  { key: 'values', label: 'Nilai Unggulan', icon: Quote, desc: 'Fitur/USP' },
  {
    key: 'products',
    label: 'Produk Unggulan',
    icon: ShoppingBag,
    desc: 'Produk pilihan',
  },
  {
    key: 'testimonials',
    label: 'Testimoni',
    icon: MessageSquare,
    desc: 'Review pelanggan',
  },
  {
    key: 'newsletter',
    label: 'Newsletter',
    icon: Mail,
    desc: 'Form subscribe',
  },
];

export default function HomepageSettings({ settings, locale }: HomepageSettingsProps) {
  // Parse JSON strings
  const initialTrustLogos: TrustLogo[] = (() => {
    try {
      const parsed = JSON.parse(settings.trust_logos || '[]');
      // Handle old format (array of strings)
      if (Array.isArray(parsed) && typeof parsed[0] === 'string') {
        return parsed.map((name: string) => ({ name, logo_url: '' }));
      }
      return parsed;
    } catch {
      return [];
    }
  })();
  const initialValues = JSON.parse(settings.home_values || '[]');

  const initialCarouselBanners: CarouselBanner[] = (() => {
    try {
      return JSON.parse(settings.carousel_banners || '[]');
    } catch {
      return [];
    }
  })();

  const [trustLogos, setTrustLogos] = useState<TrustLogo[]>(initialTrustLogos);
  const [values, setValues] = useState<ValueItem[]>(initialValues);
  const [carouselBanners, setCarouselBanners] = useState<CarouselBanner[]>(initialCarouselBanners);
  const [bannerFiles, setBannerFiles] = useState<Map<number, File>>(new Map());
  const [bannerPreviews, setBannerPreviews] = useState<Map<number, string>>(new Map());
  const [newLogoName, setNewLogoName] = useState('');
  const [newLogoUrl, setNewLogoUrl] = useState('');

  // Site logo state
  const initialSiteLogo = settings.site_logo || '/ronica.png';
  const [siteLogoPreview, setSiteLogoPreview] = useState<string>(initialSiteLogo);
  const [siteLogoFile, setSiteLogoFile] = useState<File | null>(null);
  const [logoCompressing, setLogoCompressing] = useState(false);
  const [logoDragging, setLogoDragging] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Silakan pilih file gambar (PNG, JPG, WEBP, SVG)');
      return;
    }
    setLogoCompressing(true);
    try {
      const compressed = await compressImage(file, { maxSizeMB: 1.5, maxWidthOrHeight: 1024 });
      setSiteLogoFile(compressed);
      setSiteLogoPreview(URL.createObjectURL(compressed));
    } catch {
      setSiteLogoFile(file);
      setSiteLogoPreview(URL.createObjectURL(file));
    } finally {
      setLogoCompressing(false);
    }
  }, []);

  const resetLogoToDefault = () => {
    setSiteLogoFile(null);
    setSiteLogoPreview('/ronica.png');
    if (logoInputRef.current) logoInputRef.current.value = '';
  };

  // Hero media state
  const isUploadedFile = settings.hero_image_main.startsWith('/storage/settings/hero/');
  const [heroMediaMode, setHeroMediaMode] = useState<'upload' | 'url'>(isUploadedFile ? 'upload' : 'url');
  const [heroMediaFile, setHeroMediaFile] = useState<File | null>(null);
  const [heroMediaPreview, setHeroMediaPreview] = useState<string>(isUploadedFile ? settings.hero_image_main : '');
  const [heroMediaType, setHeroMediaType] = useState<'image' | 'video'>(settings.hero_media_type ?? 'image');
  const [compressing, setCompressing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, setData, processing: _formProcessing } = useForm({
    hero_badge: settings.hero_badge,
    hero_title: settings.hero_title,
    hero_title_highlight: settings.hero_title_highlight,
    hero_description: settings.hero_description,
    hero_image_main: settings.hero_image_main,
    hero_product_name: settings.hero_product_name,
    trust_logos: settings.trust_logos,
    home_values: settings.home_values,
    carousel_banners: settings.carousel_banners,
    // Section visibility
    section_carousel_banners_visible: settings.section_carousel_banners_visible ?? true,
    section_hero_visible: settings.section_hero_visible ?? true,
    section_trust_visible: settings.section_trust_visible ?? true,
    section_categories_visible: settings.section_categories_visible ?? true,
    section_catalog_visible: settings.section_catalog_visible ?? true,
    section_values_visible: settings.section_values_visible ?? true,
    section_products_visible: settings.section_products_visible ?? true,
    section_testimonials_visible: settings.section_testimonials_visible ?? true,
    section_newsletter_visible: settings.section_newsletter_visible ?? true,
  });

  const [processing, setProcessing] = useState(false);

  const detectMediaType = (file: File): 'image' | 'video' => {
    return file.type.startsWith('video/') ? 'video' : 'image';
  };

  const detectMediaTypeFromUrl = (url: string): 'image' | 'video' => {
    const ext = url.split('?')[0].split('.').pop()?.toLowerCase() ?? '';
    return ['mp4', 'webm'].includes(ext) ? 'video' : 'image';
  };

  const handleFileSelect = useCallback(async (file: File) => {
    const type = detectMediaType(file);
    setHeroMediaType(type);

    if (type === 'image') {
      setCompressing(true);
      try {
        const compressed = await compressImage(file, { maxSizeMB: 2, maxWidthOrHeight: 1920 });
        setHeroMediaFile(compressed);
        setHeroMediaPreview(URL.createObjectURL(compressed));
      } finally {
        setCompressing(false);
      }
    } else {
      if (file.size > 50 * 1024 * 1024) {
        alert('Video file must be under 50MB');
        return;
      }
      setHeroMediaFile(file);
      setHeroMediaPreview(URL.createObjectURL(file));
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const removeMedia = () => {
    setHeroMediaFile(null);
    setHeroMediaPreview('');
    setHeroMediaType('image');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('hero_badge', data.hero_badge);
    formData.append('hero_title', data.hero_title);
    formData.append('hero_title_highlight', data.hero_title_highlight);
    formData.append('hero_description', data.hero_description);
    formData.append('hero_product_name', data.hero_product_name);
    formData.append('trust_logos', JSON.stringify(trustLogos));
    formData.append('home_values', JSON.stringify(values));
    formData.append('carousel_banners', JSON.stringify(carouselBanners));

    // Carousel banner files
    bannerFiles.forEach((file, index) => {
      formData.append(`carousel_banner_files[${index}]`, file);
    });

    // Section visibility
    formData.append('section_carousel_banners_visible', data.section_carousel_banners_visible ? '1' : '0');
    formData.append('section_hero_visible', data.section_hero_visible ? '1' : '0');
    formData.append('section_trust_visible', data.section_trust_visible ? '1' : '0');
    formData.append('section_categories_visible', data.section_categories_visible ? '1' : '0');
    formData.append('section_catalog_visible', data.section_catalog_visible ? '1' : '0');
    formData.append('section_values_visible', data.section_values_visible ? '1' : '0');
    formData.append('section_products_visible', data.section_products_visible ? '1' : '0');
    formData.append('section_testimonials_visible', data.section_testimonials_visible ? '1' : '0');
    formData.append('section_newsletter_visible', data.section_newsletter_visible ? '1' : '0');

    // Site logo
    formData.append('site_logo', siteLogoPreview);
    if (siteLogoFile) {
      formData.append('site_logo_file', siteLogoFile);
    }

    // Hero media
    if (heroMediaMode === 'upload' && heroMediaFile) {
      formData.append('hero_media_file', heroMediaFile);
      formData.append('hero_media_type', heroMediaType);
    } else {
      formData.append('hero_image_main', data.hero_image_main);
      formData.append('hero_media_type', detectMediaTypeFromUrl(data.hero_image_main));
    }

    router.post('/admin/settings/homepage', formData, {
      forceFormData: true,
      onStart: () => setProcessing(true),
      onFinish: () => setProcessing(false),
    });
  };

  // Carousel banner handlers
  const addBanner = () => {
    if (carouselBanners.length >= 10) return;
    const newBanner: CarouselBanner = {
      id: Date.now().toString(),
      image_url: '',
      link: '',
      sort_order: carouselBanners.length,
    };
    setCarouselBanners([...carouselBanners, newBanner]);
  };

  const removeBanner = (index: number) => {
    const updated = carouselBanners.filter((_, i) => i !== index);
    updated.forEach((b, i) => (b.sort_order = i));
    setCarouselBanners(updated);
    const newFiles = new Map(bannerFiles);
    const newPreviews = new Map(bannerPreviews);
    newFiles.delete(index);
    newPreviews.delete(index);
    // Re-index files/previews after removal
    const reindexedFiles = new Map<number, File>();
    const reindexedPreviews = new Map<number, string>();
    let newIdx = 0;
    for (let i = 0; i < carouselBanners.length; i++) {
      if (i === index) continue;
      if (bannerFiles.has(i)) reindexedFiles.set(newIdx, bannerFiles.get(i)!);
      if (bannerPreviews.has(i)) reindexedPreviews.set(newIdx, bannerPreviews.get(i)!);
      newIdx++;
    }
    setBannerFiles(reindexedFiles);
    setBannerPreviews(reindexedPreviews);
  };

  const updateBanner = (index: number, field: keyof CarouselBanner, value: string) => {
    const updated = [...carouselBanners];
    updated[index] = { ...updated[index], [field]: value };
    setCarouselBanners(updated);
  };

  const moveBanner = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= carouselBanners.length) return;
    const updated = [...carouselBanners];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updated.forEach((b, i) => (b.sort_order = i));
    setCarouselBanners(updated);
    // Swap files/previews too
    const newFiles = new Map(bannerFiles);
    const newPreviews = new Map(bannerPreviews);
    const fileA = newFiles.get(index);
    const fileB = newFiles.get(newIndex);
    const previewA = newPreviews.get(index);
    const previewB = newPreviews.get(newIndex);
    if (fileA) newFiles.set(newIndex, fileA); else newFiles.delete(newIndex);
    if (fileB) newFiles.set(index, fileB); else newFiles.delete(index);
    if (previewA) newPreviews.set(newIndex, previewA); else newPreviews.delete(newIndex);
    if (previewB) newPreviews.set(index, previewB); else newPreviews.delete(index);
    setBannerFiles(newFiles);
    setBannerPreviews(newPreviews);
  };

  const handleBannerFileSelect = async (index: number, file: File) => {
    const compressed = await compressImage(file, { maxSizeMB: 2, maxWidthOrHeight: 1920 });
    const newFiles = new Map(bannerFiles);
    newFiles.set(index, compressed);
    setBannerFiles(newFiles);
    const newPreviews = new Map(bannerPreviews);
    newPreviews.set(index, URL.createObjectURL(compressed));
    setBannerPreviews(newPreviews);
  };

  // Trust logos handlers
  const addTrustLogo = () => {
    if (newLogoName.trim()) {
      const updated = [
        ...trustLogos,
        { name: newLogoName.trim(), logo_url: newLogoUrl.trim() },
      ];
      setTrustLogos(updated);
      setData('trust_logos', JSON.stringify(updated));
      setNewLogoName('');
      setNewLogoUrl('');
    }
  };

  const removeTrustLogo = (index: number) => {
    const updated = trustLogos.filter((_, i) => i !== index);
    setTrustLogos(updated);
    setData('trust_logos', JSON.stringify(updated));
  };

  // Values handlers
  const updateValue = (
    index: number,
    field: keyof ValueItem,
    value: string,
  ) => {
    const updated = [...values];
    updated[index] = { ...updated[index], [field]: value };
    setValues(updated);
    setData('home_values', JSON.stringify(updated));
  };

  const addValue = () => {
    const updated = [...values, { icon: 'leaf', title: '', desc: '' }];
    setValues(updated);
    setData('home_values', JSON.stringify(updated));
  };

  const removeValue = (index: number) => {
    const updated = values.filter((_, i) => i !== index);
    setValues(updated);
    setData('home_values', JSON.stringify(updated));
  };

  const toggleSection = (key: string) => {
    const fieldName = `section_${key}_visible` as keyof typeof data;
    setData(fieldName, !data[fieldName]);
  };

  return (
    <AdminLayout
      breadcrumbs={[
        { title: 'Pengaturan', href: '/admin/settings' },
        { title: 'Homepage', href: '/admin/settings/homepage' },
      ]}
    >
      <Head title="Pengaturan Homepage" />

      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/settings"
              className="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                Pengaturan Homepage
              </h1>
              <p className="mt-1 text-neutral-500">
                Kelola tampilan halaman utama toko Anda
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section Visibility */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
                <Eye className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Visibilitas Section
                </h2>
                <p className="text-sm text-neutral-500">
                  Tampilkan atau sembunyikan section di homepage
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {SECTIONS.map((section) => {
                const fieldName =
                  `section_${section.key}_visible` as keyof typeof data;
                const isVisible = data[fieldName] as boolean;
                return (
                  <button
                    key={section.key}
                    type="button"
                    onClick={() => toggleSection(section.key)}
                    className={`flex items-center gap-3 rounded-xl border p-4 transition-all ${
                      isVisible
                        ? 'border-teal-200 bg-teal-50'
                        : 'border-neutral-200 bg-neutral-50 opacity-60'
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        isVisible ? 'bg-teal-100' : 'bg-neutral-200'
                      }`}
                    >
                      <section.icon
                        className={`h-5 w-5 ${isVisible ? 'text-teal-600' : 'text-neutral-400'}`}
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <p
                        className={`text-sm font-medium ${isVisible ? 'text-neutral-900' : 'text-neutral-500'}`}
                      >
                        {section.label}
                      </p>
                      <p className="text-xs text-neutral-400">{section.desc}</p>
                    </div>
                    {isVisible ? (
                      <Eye className="h-4 w-4 text-teal-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-neutral-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Site Logo Section Settings */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
                  <Image className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Logo Website (Ronica)
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Kelola logo utama yang ditampilkan di Header, Mobile Menu, dan Footer
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Logo Preview Cards */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Preview Logo
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center justify-center rounded-lg border border-neutral-200 bg-white p-4 text-center">
                    <span className="mb-2 text-xs font-medium text-neutral-400">Tampilan Terang</span>
                    <img
                      src={siteLogoPreview}
                      alt="Logo Preview Light"
                      className="h-10 w-auto max-w-[160px] object-contain"
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 p-4 text-center">
                    <span className="mb-2 text-xs font-medium text-neutral-400">Tampilan Gelap</span>
                    <img
                      src={siteLogoPreview}
                      alt="Logo Preview Dark"
                      className="h-10 w-auto max-w-[160px] object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Unggah Logo Baru
                </label>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleLogoFileSelect(file);
                  }}
                  className="hidden"
                />

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setLogoDragging(true);
                  }}
                  onDragLeave={() => setLogoDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setLogoDragging(false);
                    const file = e.dataTransfer.files[0];
                    if (file) handleLogoFileSelect(file);
                  }}
                  onClick={() => logoInputRef.current?.click()}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-all ${
                    logoDragging
                      ? 'border-teal-500 bg-teal-50/50'
                      : 'border-neutral-200 bg-neutral-50 hover:border-teal-400 hover:bg-neutral-100/50'
                  }`}
                >
                  {logoCompressing ? (
                    <div className="flex items-center gap-2 text-sm text-teal-600">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Memproses gambar...</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="mb-2 h-6 w-6 text-neutral-400" />
                      <p className="text-sm font-medium text-neutral-700">
                        Klik atau seret logo baru ke sini
                      </p>
                      <p className="mt-1 text-xs text-neutral-400">
                        Format: PNG, WEBP, SVG, JPG (Maks 10MB)
                      </p>
                    </>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-neutral-500 truncate max-w-[200px]">
                    {siteLogoFile ? `File baru: ${siteLogoFile.name}` : `Logo aktif: ${siteLogoPreview}`}
                  </span>
                  <button
                    type="button"
                    onClick={resetLogoToDefault}
                    className="text-xs font-medium text-neutral-500 hover:text-teal-600 underline"
                  >
                    Reset ke /ronica.png
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Section Settings */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Home className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Hero Section
                </h2>
                <p className="text-sm text-neutral-500">
                  Editing: <span className="font-medium text-teal-600">{locale === 'id' ? 'Bahasa Indonesia' : 'English'}</span> — switch language to edit the other version
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={data.hero_badge}
                  onChange={(e) => setData('hero_badge', e.target.value)}
                  placeholder="Koleksi Terbaru 2025"
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Product Name (Hero)
                </label>
                <input
                  type="text"
                  value={data.hero_product_name}
                  onChange={(e) => setData('hero_product_name', e.target.value)}
                  placeholder="Kursi Santai Premium"
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Judul Utama
                </label>
                <input
                  type="text"
                  value={data.hero_title}
                  onChange={(e) => setData('hero_title', e.target.value)}
                  placeholder="Desain yang"
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Judul Highlight
                </label>
                <input
                  type="text"
                  value={data.hero_title_highlight}
                  onChange={(e) =>
                    setData('hero_title_highlight', e.target.value)
                  }
                  placeholder="bernafas."
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Deskripsi Hero
                </label>
                <textarea
                  value={data.hero_description}
                  onChange={(e) => setData('hero_description', e.target.value)}
                  rows={3}
                  placeholder="Furniture minimalis dari bahan berkelanjutan..."
                  className="w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Hero Media */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <Image className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Media Hero
                </h2>
                <p className="text-sm text-neutral-500">
                  Upload gambar/video atau masukkan URL
                </p>
              </div>
            </div>

            {/* Mode Tabs */}
            <div className="mb-4 flex gap-1 rounded-lg bg-neutral-100 p-1">
              <button
                type="button"
                onClick={() => setHeroMediaMode('upload')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                  heroMediaMode === 'upload'
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                <Upload size={16} />
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setHeroMediaMode('url')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                  heroMediaMode === 'url'
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                <LinkIcon size={16} />
                URL
              </button>
            </div>

            {/* Upload Mode */}
            {heroMediaMode === 'upload' && (
              <div>
                {!heroMediaPreview ? (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-all ${
                      dragging
                        ? 'border-teal-400 bg-teal-50'
                        : 'border-neutral-300 bg-neutral-50 hover:border-neutral-400 hover:bg-neutral-100'
                    }`}
                  >
                    {compressing ? (
                      <>
                        <Loader2 className="mb-3 h-10 w-10 animate-spin text-teal-500" />
                        <p className="text-sm font-medium text-neutral-600">Mengompresi gambar...</p>
                      </>
                    ) : (
                      <>
                        <Upload className="mb-3 h-10 w-10 text-neutral-400" />
                        <p className="text-sm font-medium text-neutral-600">
                          Drag & drop file di sini, atau klik untuk memilih
                        </p>
                        <p className="mt-1 text-xs text-neutral-400">
                          Gambar (JPG, PNG, WebP, GIF) atau Video (MP4, WebM, maks 50MB)
                        </p>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                      }}
                    />
                  </div>
                ) : (
                  <div className="relative overflow-hidden rounded-lg">
                    {heroMediaType === 'video' ? (
                      <video
                        src={heroMediaPreview}
                        controls
                        className="h-48 w-full rounded-lg object-cover"
                      />
                    ) : (
                      <img
                        src={heroMediaPreview}
                        alt="Preview"
                        className="h-48 w-full rounded-lg object-cover"
                      />
                    )}
                    <div className="absolute top-2 right-2 flex gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                        heroMediaType === 'video'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {heroMediaType === 'video' ? <Film size={12} /> : <Image size={12} />}
                        {heroMediaType === 'video' ? 'Video' : 'Image'}
                      </span>
                      <button
                        type="button"
                        onClick={removeMedia}
                        className="rounded-full bg-red-500 p-1 text-white shadow-sm transition-colors hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* URL Mode */}
            {heroMediaMode === 'url' && (
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  URL Gambar / Video
                </label>
                <input
                  type="url"
                  value={data.hero_image_main}
                  onChange={(e) => {
                    setData('hero_image_main', e.target.value);
                    setHeroMediaType(detectMediaTypeFromUrl(e.target.value));
                  }}
                  placeholder="https://example.com/hero.jpg atau .mp4"
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
                {data.hero_image_main && (
                  <div className="mt-3">
                    {detectMediaTypeFromUrl(data.hero_image_main) === 'video' ? (
                      <video
                        src={data.hero_image_main}
                        controls
                        className="h-48 w-full rounded-lg object-cover"
                      />
                    ) : (
                      <img
                        src={data.hero_image_main}
                        alt="Preview"
                        className="h-48 w-full rounded-lg object-cover"
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Carousel Banners */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                  <SlidersHorizontal className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Carousel Banner
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Banner carousel di bawah hero section (maks 10)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={addBanner}
                disabled={carouselBanners.length >= 10}
                className="inline-flex items-center gap-2 rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200 disabled:opacity-50"
              >
                <Plus size={16} />
                Tambah Banner
              </button>
            </div>

            {carouselBanners.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed border-neutral-200 py-12 text-center">
                <Image className="mx-auto mb-3 h-10 w-10 text-neutral-300" />
                <p className="text-sm text-neutral-400">
                  Belum ada banner. Klik "Tambah Banner" untuk memulai.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {carouselBanners.map((banner, index) => {
                  const preview = bannerPreviews.get(index);
                  const displayImage = preview || banner.image_url;
                  return (
                    <div
                      key={banner.id}
                      className="rounded-xl border border-neutral-100 bg-neutral-50 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-medium text-neutral-500">
                          Banner {index + 1}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveBanner(index, 'up')}
                            disabled={index === 0}
                            className="rounded p-1 text-neutral-400 transition-colors hover:bg-neutral-200 hover:text-neutral-600 disabled:opacity-30"
                            title="Pindah ke atas"
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveBanner(index, 'down')}
                            disabled={index === carouselBanners.length - 1}
                            className="rounded p-1 text-neutral-400 transition-colors hover:bg-neutral-200 hover:text-neutral-600 disabled:opacity-30"
                            title="Pindah ke bawah"
                          >
                            <ArrowDown size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeBanner(index)}
                            className="rounded p-1 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500"
                            title="Hapus banner"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Image upload / preview */}
                        <div>
                          <label className="mb-1 block text-xs text-neutral-500">
                            Gambar
                          </label>
                          {displayImage ? (
                            <div className="relative">
                              <img
                                src={displayImage}
                                alt={`Banner ${index + 1}`}
                                className="h-32 w-full rounded-lg object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  updateBanner(index, 'image_url', '');
                                  const newFiles = new Map(bannerFiles);
                                  newFiles.delete(index);
                                  setBannerFiles(newFiles);
                                  const newPreviews = new Map(bannerPreviews);
                                  newPreviews.delete(index);
                                  setBannerPreviews(newPreviews);
                                }}
                                className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white shadow-sm hover:bg-red-600"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ) : (
                            <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-white transition-colors hover:border-neutral-400 hover:bg-neutral-100">
                              <Upload className="mb-1 h-6 w-6 text-neutral-400" />
                              <span className="text-xs text-neutral-500">
                                Upload gambar
                              </span>
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleBannerFileSelect(index, file);
                                }}
                              />
                            </label>
                          )}
                          {/* URL fallback */}
                          {!displayImage && (
                            <input
                              type="url"
                              value={banner.image_url}
                              onChange={(e) => updateBanner(index, 'image_url', e.target.value)}
                              placeholder="Atau masukkan URL gambar"
                              className="mt-2 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                            />
                          )}
                        </div>

                        {/* Link input */}
                        <div>
                          <label className="mb-1 block text-xs text-neutral-500">
                            Link (opsional)
                          </label>
                          <input
                            type="url"
                            value={banner.link || ''}
                            onChange={(e) => updateBanner(index, 'link', e.target.value)}
                            placeholder="https://example.com/promo"
                            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                          />
                          <p className="mt-1 text-xs text-neutral-400">
                            Klik banner akan membuka link ini di tab baru
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Trust Logos */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                <Globe className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Trust Logos / Press
                </h2>
                <p className="text-sm text-neutral-500">
                  Logo media/brand yang pernah memuat
                </p>
              </div>
            </div>

            {/* Existing Logos */}
            <div className="mb-4 space-y-3">
              {trustLogos.map((logo, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg border border-neutral-100 bg-neutral-50 p-3"
                >
                  {logo.logo_url ? (
                    <img
                      src={logo.logo_url}
                      alt={logo.name}
                      className="h-8 w-auto object-contain"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-neutral-200">
                      <Type className="h-4 w-4 text-neutral-400" />
                    </div>
                  )}
                  <span className="flex-1 text-sm font-medium text-neutral-700">
                    {logo.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeTrustLogo(index)}
                    className="text-neutral-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Logo */}
            <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-4">
              <p className="mb-3 text-sm font-medium text-neutral-700">
                Tambah Logo Baru
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  value={newLogoName}
                  onChange={(e) => setNewLogoName(e.target.value)}
                  placeholder="Nama brand/media"
                  className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
                <input
                  type="url"
                  value={newLogoUrl}
                  onChange={(e) => setNewLogoUrl(e.target.value)}
                  placeholder="URL logo (opsional)"
                  className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={addTrustLogo}
                disabled={!newLogoName.trim()}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
              >
                <Plus size={16} />
                Tambah
              </button>
            </div>
          </div>

          {/* Values / Features */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                  <Quote className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Nilai / Fitur Unggulan
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Editing: <span className="font-medium text-teal-600">{locale === 'id' ? 'Bahasa Indonesia' : 'English'}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={addValue}
                className="inline-flex items-center gap-2 rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200"
              >
                <Plus size={16} />
                Tambah
              </button>
            </div>
            <div className="space-y-4">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-neutral-100 bg-neutral-50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-500">
                      Item {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeValue(index)}
                      className="text-neutral-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs text-neutral-500">
                        Icon
                      </label>
                      <select
                        value={value.icon}
                        onChange={(e) =>
                          updateValue(index, 'icon', e.target.value)
                        }
                        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-neutral-900 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                      >
                        <option value="leaf">🌿 Leaf</option>
                        <option value="truck">🚚 Truck</option>
                        <option value="shield-check">🛡️ Shield Check</option>
                        <option value="heart">❤️ Heart</option>
                        <option value="star">⭐ Star</option>
                        <option value="clock">⏰ Clock</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-xs text-neutral-500">
                        Judul
                      </label>
                      <input
                        type="text"
                        value={value.title}
                        onChange={(e) =>
                          updateValue(index, 'title', e.target.value)
                        }
                        placeholder="Bahan Berkelanjutan"
                        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-neutral-900 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="mb-1 block text-xs text-neutral-500">
                        Deskripsi
                      </label>
                      <textarea
                        value={value.desc}
                        onChange={(e) =>
                          updateValue(index, 'desc', e.target.value)
                        }
                        rows={2}
                        placeholder="Setiap produk menggunakan kayu dari hutan yang dikelola secara bertanggung jawab..."
                        className="w-full resize-none rounded-lg border border-neutral-200 bg-white px-3 py-2 text-neutral-900 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={processing}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 font-medium text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
