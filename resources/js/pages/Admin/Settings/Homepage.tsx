import AdminLayout from '@/layouts/admin/admin-layout';
import { compressImage } from '@/utils/image-compress';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  ChevronLeft,
  Home,
  Image,
  LayoutGrid,
  Loader2,
  Mail,
  MessageSquare,
  Plus,
  Quote,
  Save,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Upload,
  Users,
  X,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

interface CarouselBanner {
  id: string;
  image_url: string;
  media_type?: 'image' | 'video';
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
    values_badge?: string;
    values_title?: string;
    home_values: string;
    carousel_banners: string;
    // Craftsmanship Section
    craftsmanship_title_1?: string;
    craftsmanship_desc_1?: string;
    craftsmanship_images_1?: string;
    craftsmanship_title_2?: string;
    craftsmanship_desc_2?: string;
    craftsmanship_images_2?: string;
    // Section visibility
    section_carousel_banners_visible: boolean;
    section_hero_visible: boolean;
    section_trust_visible: boolean;
    section_categories_visible: boolean;
    section_craftsmanship_visible?: boolean;
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
  {
    key: 'logo',
    label: 'Website Logo',
    icon: Image,
    desc: 'Store logo & header',
  },
  { key: 'hero', label: 'Hero', icon: Home, desc: 'Main hero banner' },
  {
    key: 'carousel_banners',
    label: 'Carousel Banners',
    icon: SlidersHorizontal,
    desc: 'Carousel banners',
  },
  { key: 'trust', label: 'Trust Logos', icon: Users, desc: 'Media & brand logos' },
  {
    key: 'categories',
    label: 'Categories',
    icon: LayoutGrid,
    desc: 'Product categories',
  },
  {
    key: 'craftsmanship',
    label: 'Craftsmanship',
    icon: Sparkles,
    desc: 'Craft & materials',
  },
  { key: 'catalog', label: 'Catalog', icon: BookOpen, desc: 'Flipbook PDF' },
  { key: 'values', label: 'Core Values', icon: Quote, desc: 'Features & USP' },
  {
    key: 'products',
    label: 'Featured Products',
    icon: ShoppingBag,
    desc: 'Selected products',
  },
  {
    key: 'testimonials',
    label: 'Testimonials',
    icon: MessageSquare,
    desc: 'Customer reviews',
  },
  {
    key: 'newsletter',
    label: 'Newsletter',
    icon: Mail,
    desc: 'Subscribe form',
  },
];

export default function HomepageSettings({
  settings,
  locale,
}: HomepageSettingsProps) {
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

  const initialCraftsmanshipImages1: string[] = (() => {
    try {
      return JSON.parse(settings.craftsmanship_images_1 || '[]');
    } catch {
      return [];
    }
  })();

  const initialCraftsmanshipImages2: string[] = (() => {
    try {
      return JSON.parse(settings.craftsmanship_images_2 || '[]');
    } catch {
      return [];
    }
  })();

  const [trustLogos, setTrustLogos] = useState<TrustLogo[]>(initialTrustLogos);
  const [values, setValues] = useState<ValueItem[]>(initialValues);
  const [carouselBanners, setCarouselBanners] = useState<CarouselBanner[]>(
    initialCarouselBanners,
  );
  const [bannerFiles, setBannerFiles] = useState<Map<number, File>>(new Map());
  const [bannerPreviews, setBannerPreviews] = useState<Map<number, string>>(
    new Map(),
  );
  const [craftsmanshipImages1, setCraftsmanshipImages1] = useState<string[]>(
    initialCraftsmanshipImages1,
  );
  const [craftsmanshipImages2, setCraftsmanshipImages2] = useState<string[]>(
    initialCraftsmanshipImages2,
  );
  const [craftsmanshipFiles1, setCraftsmanshipFiles1] = useState<
    Map<number, File>
  >(new Map());
  const [craftsmanshipFiles2, setCraftsmanshipFiles2] = useState<
    Map<number, File>
  >(new Map());
  const [craftsmanshipPreviews1, setCraftsmanshipPreviews1] = useState<
    Map<number, string>
  >(new Map());
  const [craftsmanshipPreviews2, setCraftsmanshipPreviews2] = useState<
    Map<number, string>
  >(new Map());
  const [newCraft1Url, setNewCraft1Url] = useState('');
  const [newCraft2Url, setNewCraft2Url] = useState('');
  const [newLogoName, setNewLogoName] = useState('');
  const [newLogoUrl, setNewLogoUrl] = useState('');

  // Site logo state
  const initialSiteLogo = settings.site_logo || '/ronica.png';
  const [siteLogoPreview, setSiteLogoPreview] =
    useState<string>(initialSiteLogo);
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
      const compressed = await compressImage(file, {
        maxSizeMB: 1.5,
        maxWidthOrHeight: 1024,
      });
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
  const isUploadedFile = settings.hero_image_main.startsWith(
    '/storage/settings/hero/',
  );
  const [heroMediaMode, setHeroMediaMode] = useState<'upload' | 'url'>(
    isUploadedFile ? 'upload' : 'url',
  );
  const [heroMediaFile, setHeroMediaFile] = useState<File | null>(null);
  const [heroMediaPreview, setHeroMediaPreview] = useState<string>(
    isUploadedFile ? settings.hero_image_main : '',
  );
  const [heroMediaType, setHeroMediaType] = useState<'image' | 'video'>(
    settings.hero_media_type ?? 'image',
  );
  const [compressing, setCompressing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    data,
    setData,
    processing: _formProcessing,
  } = useForm({
    hero_badge: settings.hero_badge,
    hero_title: settings.hero_title,
    hero_title_highlight: settings.hero_title_highlight,
    hero_description: settings.hero_description,
    hero_image_main: settings.hero_image_main,
    hero_product_name: settings.hero_product_name,
    trust_logos: settings.trust_logos,
    values_badge:
      settings.values_badge ||
      (locale === 'en' ? 'WHY CHOOSE US' : 'MENGAPA MEMILIH KAMI'),
    values_title:
      settings.values_title ||
      (locale === 'en' ? 'Our Philosophy' : 'Filosofi Kami'),
    home_values: settings.home_values,
    carousel_banners: settings.carousel_banners,
    // Craftsmanship Section
    craftsmanship_title_1: settings.craftsmanship_title_1 || '',
    craftsmanship_desc_1: settings.craftsmanship_desc_1 || '',
    craftsmanship_title_2: settings.craftsmanship_title_2 || '',
    craftsmanship_desc_2: settings.craftsmanship_desc_2 || '',
    // Section visibility
    section_carousel_banners_visible:
      settings.section_carousel_banners_visible ?? true,
    section_hero_visible: settings.section_hero_visible ?? true,
    section_trust_visible: settings.section_trust_visible ?? true,
    section_categories_visible: settings.section_categories_visible ?? true,
    section_craftsmanship_visible:
      settings.section_craftsmanship_visible ?? true,
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
        const compressed = await compressImage(file, {
          maxSizeMB: 2,
          maxWidthOrHeight: 1920,
        });
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

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect],
  );

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

    // Craftsmanship Section
    formData.append('craftsmanship_title_1', data.craftsmanship_title_1);
    formData.append('craftsmanship_desc_1', data.craftsmanship_desc_1);
    formData.append(
      'craftsmanship_images_1',
      JSON.stringify(craftsmanshipImages1),
    );
    formData.append('craftsmanship_title_2', data.craftsmanship_title_2);
    formData.append('craftsmanship_desc_2', data.craftsmanship_desc_2);
    formData.append(
      'craftsmanship_images_2',
      JSON.stringify(craftsmanshipImages2),
    );
    craftsmanshipFiles1.forEach((file, index) => {
      formData.append(`craftsmanship_images_1_files[${index}]`, file);
    });
    craftsmanshipFiles2.forEach((file, index) => {
      formData.append(`craftsmanship_images_2_files[${index}]`, file);
    });

    // Section visibility
    formData.append(
      'section_carousel_banners_visible',
      data.section_carousel_banners_visible ? '1' : '0',
    );
    formData.append(
      'section_hero_visible',
      data.section_hero_visible ? '1' : '0',
    );
    formData.append(
      'section_trust_visible',
      data.section_trust_visible ? '1' : '0',
    );
    formData.append(
      'section_categories_visible',
      data.section_categories_visible ? '1' : '0',
    );
    formData.append(
      'section_craftsmanship_visible',
      data.section_craftsmanship_visible ? '1' : '0',
    );
    formData.append(
      'section_catalog_visible',
      data.section_catalog_visible ? '1' : '0',
    );
    formData.append(
      'section_values_visible',
      data.section_values_visible ? '1' : '0',
    );
    formData.append(
      'section_products_visible',
      data.section_products_visible ? '1' : '0',
    );
    formData.append(
      'section_testimonials_visible',
      data.section_testimonials_visible ? '1' : '0',
    );
    formData.append(
      'section_newsletter_visible',
      data.section_newsletter_visible ? '1' : '0',
    );

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
      formData.append(
        'hero_media_type',
        detectMediaTypeFromUrl(data.hero_image_main),
      );
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
      if (bannerPreviews.has(i))
        reindexedPreviews.set(newIdx, bannerPreviews.get(i)!);
      newIdx++;
    }
    setBannerFiles(reindexedFiles);
    setBannerPreviews(reindexedPreviews);
  };

  const updateBanner = (
    index: number,
    field: keyof CarouselBanner,
    value: string,
  ) => {
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
    if (fileA) newFiles.set(newIndex, fileA);
    else newFiles.delete(newIndex);
    if (fileB) newFiles.set(index, fileB);
    else newFiles.delete(index);
    if (previewA) newPreviews.set(newIndex, previewA);
    else newPreviews.delete(newIndex);
    if (previewB) newPreviews.set(index, previewB);
    else newPreviews.delete(index);
    setBannerFiles(newFiles);
    setBannerPreviews(newPreviews);
  };

  const handleBannerFileSelect = async (index: number, file: File) => {
    const isVideo = file.type.startsWith('video/');
    let processedFile = file;

    if (!isVideo) {
      processedFile = await compressImage(file, {
        maxSizeMB: 2,
        maxWidthOrHeight: 1920,
      });
    }

    const newFiles = new Map(bannerFiles);
    newFiles.set(index, processedFile);
    setBannerFiles(newFiles);

    const newPreviews = new Map(bannerPreviews);
    newPreviews.set(index, URL.createObjectURL(processedFile));
    setBannerPreviews(newPreviews);

    updateBanner(index, 'media_type', isVideo ? 'video' : 'image');
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

  // Craftsmanship image handlers
  const addCraftsmanshipImage1 = () => {
    if (newCraft1Url.trim()) {
      setCraftsmanshipImages1([...craftsmanshipImages1, newCraft1Url.trim()]);
      setNewCraft1Url('');
    }
  };
  const removeCraftsmanshipImage1 = (index: number) => {
    setCraftsmanshipImages1(craftsmanshipImages1.filter((_, i) => i !== index));
    const f = new Map(craftsmanshipFiles1);
    f.delete(index);
    setCraftsmanshipFiles1(f);
    const p = new Map(craftsmanshipPreviews1);
    p.delete(index);
    setCraftsmanshipPreviews1(p);
  };
  const handleCraftsmanshipFileSelect1 = async (index: number, file: File) => {
    const compressed = await compressImage(file, {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
    });
    const f = new Map(craftsmanshipFiles1);
    f.set(index, compressed);
    setCraftsmanshipFiles1(f);
    const p = new Map(craftsmanshipPreviews1);
    p.set(index, URL.createObjectURL(compressed));
    setCraftsmanshipPreviews1(p);
    const updated = [...craftsmanshipImages1];
    updated[index] = URL.createObjectURL(compressed);
    setCraftsmanshipImages1(updated);
  };

  const addCraftsmanshipImage2 = () => {
    if (newCraft2Url.trim()) {
      setCraftsmanshipImages2([...craftsmanshipImages2, newCraft2Url.trim()]);
      setNewCraft2Url('');
    }
  };
  const removeCraftsmanshipImage2 = (index: number) => {
    setCraftsmanshipImages2(craftsmanshipImages2.filter((_, i) => i !== index));
    const f = new Map(craftsmanshipFiles2);
    f.delete(index);
    setCraftsmanshipFiles2(f);
    const p = new Map(craftsmanshipPreviews2);
    p.delete(index);
    setCraftsmanshipPreviews2(p);
  };
  const handleCraftsmanshipFileSelect2 = async (index: number, file: File) => {
    const compressed = await compressImage(file, {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
    });
    const f = new Map(craftsmanshipFiles2);
    f.set(index, compressed);
    setCraftsmanshipFiles2(f);
    const p = new Map(craftsmanshipPreviews2);
    p.set(index, URL.createObjectURL(compressed));
    setCraftsmanshipPreviews2(p);
    const updated = [...craftsmanshipImages2];
    updated[index] = URL.createObjectURL(compressed);
    setCraftsmanshipImages2(updated);
  };

  const toggleSection = (key: string) => {
    const fieldName = `section_${key}_visible` as keyof typeof data;
    setData(fieldName, !data[fieldName]);
  };

  return (
    <AdminLayout
      breadcrumbs={[
        { title: 'Settings', href: '/admin/settings' },
        { title: 'Homepage', href: '/admin/settings/homepage' },
      ]}
    >
      <Head title="Homepage Settings" />

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
                Homepage Settings
              </h1>
              <p className="mt-1 text-neutral-500">
                Manage the look and content of your storefront homepage
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Site Logo Section Settings */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
                  <Image className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Website Logo
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Manage primary logo displayed in Header, Mobile Menu, and Footer
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Logo Preview Cards */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Logo Preview
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center justify-center rounded-lg border border-neutral-200 bg-white p-4 text-center">
                    <span className="mb-2 text-xs font-medium text-neutral-400">
                      Light Background
                    </span>
                    <img
                      src={siteLogoPreview}
                      alt="Logo Preview Light"
                      className="h-10 w-auto max-w-[160px] object-contain"
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 p-4 text-center">
                    <span className="mb-2 text-xs font-medium text-neutral-400">
                      Dark Background
                    </span>
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
                  Upload New Logo
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
                      <span>Processing image...</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="mb-2 h-6 w-6 text-neutral-400" />
                      <p className="text-sm font-medium text-neutral-700">
                        Click or drag new logo here
                      </p>
                      <p className="mt-1 text-xs text-neutral-400">
                        Format: PNG, WEBP, SVG, JPG (Max 10MB)
                      </p>
                      <span className="mt-2 inline-flex items-center rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-medium text-teal-700 border border-teal-100">
                        Recommended size: 300 × 80 px (transparent background)
                      </span>
                    </>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="max-w-[200px] truncate text-xs text-neutral-500">
                    {siteLogoFile
                      ? `New file: ${siteLogoFile.name}`
                      : `Active logo: ${siteLogoPreview}`}
                  </span>
                  <button
                    type="button"
                    onClick={resetLogoToDefault}
                    className="text-xs font-medium text-neutral-500 underline hover:text-teal-600"
                  >
                    Reset to default
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
                  Editing:{' '}
                  <span className="font-medium text-teal-600">
                    {locale === 'id' ? 'Indonesian' : 'English'}
                  </span>{' '}
                  — switch language to edit the other version
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
                  placeholder="Latest Collection 2025"
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
                  placeholder="Premium Lounge Chair"
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Main Title
                </label>
                <input
                  type="text"
                  value={data.hero_title}
                  onChange={(e) => setData('hero_title', e.target.value)}
                  placeholder="Designs that"
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Title Highlight
                </label>
                <input
                  type="text"
                  value={data.hero_title_highlight}
                  onChange={(e) =>
                    setData('hero_title_highlight', e.target.value)
                  }
                  placeholder="breathe."
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Hero Description
                </label>
                <textarea
                  value={data.hero_description}
                  onChange={(e) => setData('hero_description', e.target.value)}
                  rows={3}
                  placeholder="Minimalist furniture crafted from sustainable materials..."
                  className="w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
              </div>
            </div>
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
                    Carousel Banners
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Carousel banners displayed below hero section (max 10)
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
                Add Banner
              </button>
            </div>

            {carouselBanners.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed border-neutral-200 py-12 text-center">
                <Image className="mx-auto mb-3 h-10 w-10 text-neutral-300" />
                <p className="text-sm text-neutral-400">
                  No banners yet. Click "Add Banner" to get started.
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
                            title="Move up"
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveBanner(index, 'down')}
                            disabled={index === carouselBanners.length - 1}
                            className="rounded p-1 text-neutral-400 transition-colors hover:bg-neutral-200 hover:text-neutral-600 disabled:opacity-30"
                            title="Move down"
                          >
                            <ArrowDown size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeBanner(index)}
                            className="rounded p-1 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500"
                            title="Delete banner"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Media upload / preview */}
                        <div>
                          <div className="mb-1 flex items-center justify-between">
                            <label className="block text-xs text-neutral-500">
                              Image / Video
                            </label>
                            <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium border border-amber-200/60">
                              Recommended size: 1920 × 600 px (16:5 ratio)
                            </span>
                          </div>
                          {displayImage ? (
                            <div className="relative">
                              {banner.media_type === 'video' ||
                              detectMediaTypeFromUrl(displayImage) ===
                                'video' ? (
                                <video
                                  src={displayImage}
                                  controls
                                  className="h-32 w-full rounded-lg bg-neutral-900 object-cover"
                                />
                              ) : (
                                <img
                                  src={displayImage}
                                  alt={`Banner ${index + 1}`}
                                  className="h-32 w-full rounded-lg object-cover"
                                />
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  updateBanner(index, 'image_url', '');
                                  updateBanner(index, 'media_type', 'image');
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
                              <span className="text-xs font-medium text-neutral-600">
                                Upload image / video
                              </span>
                              <span className="mt-0.5 text-[10px] text-neutral-400">
                                JPG, PNG, WebP, MP4, WebM (max 50MB)
                              </span>
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/ogg"
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
                              onChange={(e) => {
                                const url = e.target.value;
                                updateBanner(index, 'image_url', url);
                                updateBanner(
                                  index,
                                  'media_type',
                                  detectMediaTypeFromUrl(url),
                                );
                              }}
                              placeholder="Or enter image / video URL"
                              className="mt-2 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                            />
                          )}
                        </div>

                        {/* Link input */}
                        <div>
                          <label className="mb-1 block text-xs text-neutral-500">
                            Target URL (optional)
                          </label>
                          <input
                            type="url"
                            value={banner.link || ''}
                            onChange={(e) =>
                              updateBanner(index, 'link', e.target.value)
                            }
                            placeholder="https://example.com/promo"
                            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                          />
                          <p className="mt-1 text-xs text-neutral-400">
                            Clicking banner will open this URL in a new tab
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Values / Features (Our Philosophy) Settings */}
          <div
            id="values"
            className="scroll-mt-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                  <Quote className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Core Values & Philosophy
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Manage sub-badge, title, and key philosophy points
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={addValue}
                className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700"
              >
                <Plus size={16} />
                Add Point
              </button>
            </div>

            {/* Header Inputs */}
            <div className="mb-6 grid grid-cols-1 gap-4 rounded-xl border border-neutral-100 bg-neutral-50 p-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-700">
                  Sub-Badge (optional)
                </label>
                <input
                  type="text"
                  value={data.values_badge || ''}
                  onChange={(e) => setData('values_badge', e.target.value)}
                  placeholder="WHY CHOOSE US"
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-700">
                  Main Title
                </label>
                <input
                  type="text"
                  value={data.values_title || ''}
                  onChange={(e) => setData('values_title', e.target.value)}
                  placeholder="Our Philosophy"
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
              </div>
            </div>

            {/* List of Value Items */}
            <div className="space-y-4">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-neutral-100 bg-neutral-50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-500">
                      Point {index + 1}
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
                        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                      >
                        <option value="leaf">🌿 Leaf (Materials/Eco)</option>
                        <option value="truck">🚚 Truck (Shipping)</option>
                        <option value="shield-check">
                          🛡️ Shield Check (Warranty)
                        </option>
                        <option value="heart">❤️ Heart (Quality)</option>
                        <option value="star">⭐ Star (Rating)</option>
                        <option value="clock">⏰ Clock (Durability)</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-xs text-neutral-500">
                        Point Title
                      </label>
                      <input
                        type="text"
                        value={value.title}
                        onChange={(e) =>
                          updateValue(index, 'title', e.target.value)
                        }
                        placeholder="Sustainable Materials"
                        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="mb-1 block text-xs text-neutral-500">
                        Description
                      </label>
                      <textarea
                        value={value.desc}
                        onChange={(e) =>
                          updateValue(index, 'desc', e.target.value)
                        }
                        rows={2}
                        placeholder="Every product uses wood from responsibly managed forests..."
                        className="w-full resize-none rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Craftsmanship Section Settings */}
          <div
            id="craftsmanship"
            className="scroll-mt-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                  <Sparkles className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Craftsmanship Section (Handcrafted & Materials)
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Manage artisan craftsmanship content, material descriptions, and photo sliders
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Row 1: Handcrafted Touch */}
              <div className="space-y-4 rounded-xl border border-neutral-100 bg-neutral-50/50 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold tracking-wider text-amber-900 uppercase">
                    Row 1: Craftsmanship / Rattan (Text Left, Slider Right)
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700">
                      Row 1 Title
                    </label>
                    <input
                      type="text"
                      value={data.craftsmanship_title_1}
                      onChange={(e) =>
                        setData('craftsmanship_title_1', e.target.value)
                      }
                      placeholder="Handcrafted, Unique Touch"
                      className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-neutral-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-neutral-700">
                      Row 1 Description
                    </label>
                    <textarea
                      value={data.craftsmanship_desc_1}
                      onChange={(e) =>
                        setData('craftsmanship_desc_1', e.target.value)
                      }
                      rows={3}
                      placeholder="Hand-woven traditional rattan forms the soul of Ronica furniture..."
                      className="w-full resize-none rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-neutral-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Images Manager Row 1 */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium text-neutral-700">
                      Row 1 Slider Images
                    </label>
                    <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium border border-amber-200/60">
                      Recommended size: 800 × 600 px (4:3 ratio)
                    </span>
                  </div>
                  <div className="space-y-3">
                    {craftsmanshipImages1.map((url, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm"
                      >
                        <img
                          src={craftsmanshipPreviews1.get(idx) || url}
                          alt={`Craft 1 Preview ${idx}`}
                          className="h-14 w-20 rounded-md border bg-neutral-100 object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <input
                            type="text"
                            value={url}
                            onChange={(e) => {
                              const updated = [...craftsmanshipImages1];
                              updated[idx] = e.target.value;
                              setCraftsmanshipImages1(updated);
                            }}
                            placeholder="Image URL (https://...)"
                            className="w-full rounded-md border border-neutral-200 px-3 py-1.5 text-xs text-neutral-800 focus:border-teal-500 focus:outline-none"
                          />
                        </div>
                        <label className="cursor-pointer rounded-md bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-200">
                          <Upload className="mr-1 inline-block h-3.5 w-3.5" />{' '}
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleCraftsmanshipFileSelect1(idx, f);
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => removeCraftsmanshipImage1(idx)}
                          className="rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newCraft1Url}
                        onChange={(e) => setNewCraft1Url(e.target.value)}
                        placeholder="Add new image URL..."
                        className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 focus:border-teal-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={addCraftsmanshipImage1}
                        className="inline-flex items-center gap-1 rounded-lg bg-neutral-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-neutral-800"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Image
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Strength of Nature */}
              <div className="space-y-4 rounded-xl border border-neutral-100 bg-neutral-50/50 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold tracking-wider text-amber-900 uppercase">
                    Row 2: Strength of Nature / Teak Wood (Slider Left, Text Right)
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700">
                      Row 2 Title
                    </label>
                    <input
                      type="text"
                      value={data.craftsmanship_title_2}
                      onChange={(e) =>
                        setData('craftsmanship_title_2', e.target.value)
                      }
                      placeholder="Strength of Nature, Timeless Elegance"
                      className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-neutral-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-neutral-700">
                      Row 2 Description
                    </label>
                    <textarea
                      value={data.craftsmanship_desc_2}
                      onChange={(e) =>
                        setData('craftsmanship_desc_2', e.target.value)
                      }
                      rows={3}
                      placeholder="The premium teak wood used in our furniture is one of nature's..."
                      className="w-full resize-none rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-neutral-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Images Manager Row 2 */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium text-neutral-700">
                      Row 2 Slider Images
                    </label>
                    <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium border border-amber-200/60">
                      Recommended size: 800 × 600 px (4:3 ratio)
                    </span>
                  </div>
                  <div className="space-y-3">
                    {craftsmanshipImages2.map((url, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm"
                      >
                        <img
                          src={craftsmanshipPreviews2.get(idx) || url}
                          alt={`Craft 2 Preview ${idx}`}
                          className="h-14 w-20 rounded-md border bg-neutral-100 object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <input
                            type="text"
                            value={url}
                            onChange={(e) => {
                              const updated = [...craftsmanshipImages2];
                              updated[idx] = e.target.value;
                              setCraftsmanshipImages2(updated);
                            }}
                            placeholder="Image URL (https://...)"
                            className="w-full rounded-md border border-neutral-200 px-3 py-1.5 text-xs text-neutral-800 focus:border-teal-500 focus:outline-none"
                          />
                        </div>
                        <label className="cursor-pointer rounded-md bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-200">
                          <Upload className="mr-1 inline-block h-3.5 w-3.5" />{' '}
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleCraftsmanshipFileSelect2(idx, f);
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => removeCraftsmanshipImage2(idx)}
                          className="rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newCraft2Url}
                        onChange={(e) => setNewCraft2Url(e.target.value)}
                        placeholder="Add new image URL..."
                        className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 focus:border-teal-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={addCraftsmanshipImage2}
                        className="inline-flex items-center gap-1 rounded-lg bg-neutral-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-neutral-800"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Image
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Submit Bar */}
          <div className="sticky bottom-6 z-30 flex items-center justify-between rounded-2xl border border-neutral-200/80 bg-white/90 px-6 py-4 shadow-xl backdrop-blur-md">
            <span className="hidden text-xs font-medium text-neutral-500 sm:inline">
              Please ensure changes are accurate before saving
            </span>
            <button
              type="submit"
              disabled={processing}
              className="ml-auto inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 font-medium text-white shadow-md transition-all hover:bg-teal-700 active:scale-[0.98] disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              {processing ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
