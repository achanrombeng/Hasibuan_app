import { ConfirmDialog } from '@/components/ui/alert-dialog';
import { useTranslation } from '@/hooks/use-translation';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, router, useForm } from '@inertiajs/react';
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Building2,
  ExternalLink,
  Facebook,
  FileText,
  Globe,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  Save,
  Send,
  Store,
  Trash2,
  Upload,
  Youtube,
} from 'lucide-react';
import React, { useState } from 'react';

export interface SocialItem {
  id: string;
  platform: string;
  url: string;
  label?: string;
}

export const PLATFORM_PRESETS = [
  { id: 'instagram', name: 'Instagram', placeholder: 'https://instagram.com/username' },
  { id: 'facebook', name: 'Facebook', placeholder: 'https://facebook.com/page' },
  { id: 'tiktok', name: 'TikTok', placeholder: 'https://tiktok.com/@username' },
  { id: 'youtube', name: 'YouTube', placeholder: 'https://youtube.com/@channel' },
  { id: 'whatsapp', name: 'WhatsApp', placeholder: 'https://wa.me/6281234567890' },
  { id: 'twitter', name: 'X / Twitter', placeholder: 'https://x.com/username' },
  { id: 'pinterest', name: 'Pinterest', placeholder: 'https://pinterest.com/username' },
  { id: 'linkedin', name: 'LinkedIn', placeholder: 'https://linkedin.com/company/name' },
  { id: 'threads', name: 'Threads', placeholder: 'https://threads.net/@username' },
  { id: 'telegram', name: 'Telegram', placeholder: 'https://t.me/channel' },
  { id: 'custom', name: 'Custom / Lainnya', placeholder: 'https://...' },
];

export function PlatformIcon({
  platform,
  className = 'h-4 w-4',
}: {
  platform: string;
  className?: string;
}) {
  switch (platform) {
    case 'instagram':
      return <Instagram className={className} />;
    case 'facebook':
      return <Facebook className={className} />;
    case 'tiktok':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
        </svg>
      );
    case 'youtube':
      return <Youtube className={className} />;
    case 'whatsapp':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      );
    case 'twitter':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case 'pinterest':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
        </svg>
      );
    case 'linkedin':
      return <Linkedin className={className} />;
    case 'threads':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.186 24C5.452 24 0 18.548 0 11.814S5.452-.372 12.186-.372c3.487 0 6.643 1.396 8.948 3.654l-2.697 2.697C16.822 4.39 14.619 3.4 12.186 3.4 7.545 3.4 3.772 7.173 3.772 11.814c0 4.642 3.773 8.414 8.414 8.414 4.093 0 7.498-2.927 8.262-6.845H12.186v-3.772h12.06c.116.634.186 1.28.186 1.942 0 6.793-5.395 12.447-12.246 12.447z" />
        </svg>
      );
    case 'telegram':
      return <Send className={className} />;
    default:
      return <Globe className={className} />;
  }
}

export function getPlatformBadgeStyle(platform: string) {
  switch (platform) {
    case 'instagram':
      return 'text-pink-600 bg-pink-50 border-pink-200';
    case 'facebook':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'tiktok':
      return 'text-neutral-900 bg-neutral-100 border-neutral-200';
    case 'youtube':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'whatsapp':
      return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    case 'twitter':
      return 'text-neutral-900 bg-neutral-100 border-neutral-200';
    case 'pinterest':
      return 'text-red-700 bg-red-50 border-red-200';
    case 'linkedin':
      return 'text-blue-700 bg-blue-50 border-blue-200';
    case 'threads':
      return 'text-neutral-900 bg-neutral-100 border-neutral-200';
    case 'telegram':
      return 'text-sky-500 bg-sky-50 border-sky-200';
    default:
      return 'text-teal-600 bg-teal-50 border-teal-200';
  }
}

interface SettingsIndexProps {
  settings: {
    site_name: string;
    site_description: string;
    contact_email: string;
    contact_email_2?: string;
    contact_phone: string;
    contact_whatsapp: string;
    factory_address?: string;
    showroom_address?: string;
    maps_showroom_url?: string;
    maps_factory_url?: string;
    address: string;
    facebook_url: string;
    instagram_url: string;
    tiktok_url: string;
    linkedin_url?: string;
    social_links?: string;
    catalog_pdf_url?: string;
    catalog_docx_url?: string;
    catalog_title?: string;
  };
}

export default function SettingsIndex({ settings }: SettingsIndexProps) {
  // Parse initial social links
  const initialSocialLinks: SocialItem[] = (() => {
    try {
      if (settings.social_links) {
        const parsed = JSON.parse(settings.social_links);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: any, idx: number) => ({
            id: item.id || `social-${idx}-${Date.now()}`,
            platform: item.platform || 'instagram',
            url: item.url || '',
            label: item.label || '',
          }));
        }
      }
    } catch {
      // ignore
    }

    const items: SocialItem[] = [];
    if (settings.facebook_url) {
      items.push({ id: 'social-fb', platform: 'facebook', url: settings.facebook_url });
    }
    if (settings.instagram_url) {
      items.push({ id: 'social-ig', platform: 'instagram', url: settings.instagram_url });
    }
    if (settings.tiktok_url) {
      items.push({ id: 'social-tt', platform: 'tiktok', url: settings.tiktok_url });
    }
    if (settings.linkedin_url) {
      items.push({ id: 'social-li', platform: 'linkedin', url: settings.linkedin_url });
    }
    return items.length > 0
      ? items
      : [
        { id: '1', platform: 'facebook', url: '' },
        { id: '2', platform: 'instagram', url: '' },
        { id: '3', platform: 'tiktok', url: '' },
        { id: '4', platform: 'linkedin', url: '' },
      ];
  })();

  const [socialItems, setSocialItems] = useState<SocialItem[]>(initialSocialLinks);

  const { data, setData, post, processing } = useForm({
    ...settings,
    social_links: JSON.stringify(initialSocialLinks),
    catalog_title: settings.catalog_title || 'Ronica Product Catalogue 2026',
    catalog_pdf_file: null as File | null,
    catalog_docx_file: null as File | null,
    delete_catalog_pdf: false,
    delete_catalog_docx: false,
  });

  const updateSocialItems = (newItems: SocialItem[]) => {
    setSocialItems(newItems);

    let fb = '';
    let ig = '';
    let tt = '';
    let li = '';
    newItems.forEach((item) => {
      if (item.platform === 'facebook' && !fb) fb = item.url;
      if (item.platform === 'instagram' && !ig) ig = item.url;
      if (item.platform === 'tiktok' && !tt) tt = item.url;
      if (item.platform === 'linkedin' && !li) li = item.url;
    });

    setData((prev) => ({
      ...prev,
      social_links: JSON.stringify(
        newItems
          .filter((i) => i.url.trim().length > 0)
          .map(({ platform, url, label }) => ({ platform, url, label }))
      ),
      facebook_url: fb,
      instagram_url: ig,
      tiktok_url: tt,
      linkedin_url: li,
    }));
  };

  const handleAddSocial = (platform: string = 'instagram') => {
    const newItem: SocialItem = {
      id: `social-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      platform,
      url: '',
    };
    updateSocialItems([...socialItems, newItem]);
  };

  const handleRemoveSocial = (id: string) => {
    updateSocialItems(socialItems.filter((item) => item.id !== id));
  };

  const handleSocialChange = (
    id: string,
    field: 'platform' | 'url' | 'label',
    value: string
  ) => {
    updateSocialItems(
      socialItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleMoveSocial = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= socialItems.length) return;
    const newItems = [...socialItems];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    updateSocialItems(newItems);
  };

  const [deletingType, setDeletingType] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const handleDeleteCatalog = (type: 'pdf' | 'docx') => {
    if (confirm(`Are you sure you want to delete this ${type.toUpperCase()} catalog file?`)) {
      setDeletingType(type);
      router.post(
        '/admin/settings/delete-catalog',
        { type },
        {
          preserveScroll: true,
          onSuccess: () => {
            if (type === 'pdf') {
              setData((prev) => ({
                ...prev,
                catalog_pdf_url: '',
                catalog_pdf_file: null,
                delete_catalog_pdf: true,
              }));
            } else {
              setData((prev) => ({
                ...prev,
                catalog_docx_url: '',
                catalog_docx_file: null,
                delete_catalog_docx: true,
              }));
            }
            setDeletingType(null);
          },
          onError: () => {
            setDeletingType(null);
          },
        }
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const confirmSaveSettings = () => {
    setIsSubmitting(true);
    const cleaned = socialItems
      .filter((i) => i.url.trim().length > 0)
      .map(({ platform, url, label }) => ({ platform, url, label }));

    let fb = '';
    let ig = '';
    let tt = '';
    let li = '';
    cleaned.forEach((item) => {
      if (item.platform === 'facebook' && !fb) fb = item.url;
      if (item.platform === 'instagram' && !ig) ig = item.url;
      if (item.platform === 'tiktok' && !tt) tt = item.url;
      if (item.platform === 'linkedin' && !li) li = item.url;
    });

    data.social_links = JSON.stringify(cleaned);
    data.facebook_url = fb;
    data.instagram_url = ig;
    data.tiktok_url = tt;
    data.linkedin_url = li;

    post('/admin/settings', {
      forceFormData: true,
      onSuccess: () => {
        setShowConfirmDialog(false);
      },
      onError: () => {
        setIsSubmitting(false);
        setShowConfirmDialog(false);
      },
      onFinish: () => {
        setIsSubmitting(false);
      },
    });
  };

  return (
    <AdminLayout
      breadcrumbs={[{ title: 'Settings', href: '/admin/settings' }]}
    >
      <Head title="Site Settings" />

      <div className="w-full space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Site Settings
          </h1>
          <p className="mt-1 text-neutral-500">
            Manage general store settings
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Settings */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
                <Store className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Store Information
                </h2>
                <p className="text-sm text-neutral-500">
                  Your store name and description
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Store Name
                </label>
                <input
                  type="text"
                  value={data.site_name}
                  onChange={(e) => setData('site_name', e.target.value)}
                  placeholder="Ronica"
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Store Description
                </label>
                <textarea
                  value={data.site_description}
                  onChange={(e) => setData('site_description', e.target.value)}
                  rows={3}
                  placeholder="Premium furniture store with finest quality..."
                  className="w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
                <p className="mt-2 text-xs text-neutral-500">
                  Used for SEO and meta description
                </p>
              </div>
            </div>
          </div>

          {/* Contact Settings */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Contact Information
                </h2>
                <p className="text-sm text-neutral-500">
                  How customers reach you
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Email 1
                </label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    value={data.contact_email}
                    onChange={(e) => setData('contact_email', e.target.value)}
                    placeholder="info@ronica.com.tr"
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-3 pr-4 pl-10 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Email 2 (Optional)
                </label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    value={data.contact_email_2 ?? ''}
                    onChange={(e) => setData('contact_email_2', e.target.value)}
                    placeholder="sales@ronica.com.tr"
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-3 pr-4 pl-10 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={data.contact_phone}
                    onChange={(e) => setData('contact_phone', e.target.value)}
                    placeholder="(021) 1234-5678"
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-3 pr-4 pl-10 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  WhatsApp Number
                </label>
                <div className="relative">
                  <MessageCircle className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={data.contact_whatsapp}
                    onChange={(e) =>
                      setData('contact_whatsapp', e.target.value)
                    }
                    placeholder="6281234567890"
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-3 pr-4 pl-10 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  />
                </div>
                <p className="mt-2 text-xs text-neutral-500">
                  Without + prefix (e.g. 6281234567890)
                </p>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Factory Address
                </label>
                <div className="relative">
                  <Building2 className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={data.factory_address ?? ''}
                    onChange={(e) => setData('factory_address', e.target.value)}
                    placeholder="Cirebon, Indonesia"
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-3 pr-4 pl-10 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Showroom Address
                </label>
                <div className="relative">
                  <Store className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={data.showroom_address ?? ''}
                    onChange={(e) => setData('showroom_address', e.target.value)}
                    placeholder="İstanbul, Türkiye"
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-3 pr-4 pl-10 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Showroom Google Maps Embed URL
                </label>
                <input
                  type="text"
                  value={data.maps_showroom_url ?? ''}
                  onChange={(e) => setData('maps_showroom_url', e.target.value)}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
                <p className="mt-1 text-xs text-neutral-500">
                  Google Maps iframe embed URL for Showroom location
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Factory Google Maps Embed URL (Optional)
                </label>
                <input
                  type="text"
                  value={data.maps_factory_url ?? ''}
                  onChange={(e) => setData('maps_factory_url', e.target.value)}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
                <p className="mt-1 text-xs text-neutral-500">
                  Google Maps iframe embed URL for Factory location
                </p>
              </div>
            </div>
          </div>

          {/* Social Media (Adjustable) */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50">
                  <Globe className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-lg font-semibold text-neutral-900">
                      Social Media
                    </h2>
                    <span className="inline-flex items-center rounded-full border border-purple-100 bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                      {socialItems.length} Platform
                    </span>
                  </div>
                  <p className="text-sm text-neutral-500">
                    Choose the social media accounts you want to display
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAddSocial('instagram')}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-teal-700 active:scale-95"
                >
                  <Plus className="h-4 w-4" />
                  Add Social Media
                </button>
              </div>
            </div>

            {/* List of social media items */}
            {socialItems.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 p-8 text-center">
                <Globe className="mx-auto h-8 w-8 text-neutral-400" />
                <p className="mt-2 text-sm font-medium text-neutral-700">
                  No social media accounts have been added yet
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  Click the button below to add your preferred platforms
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  {['instagram', 'facebook', 'tiktok', 'linkedin', 'youtube', 'whatsapp'].map((p) => {
                    const preset = PLATFORM_PRESETS.find((x) => x.id === p);
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handleAddSocial(p)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-sm transition-all hover:border-teal-500 hover:text-teal-600"
                      >
                        <PlatformIcon platform={p} className="h-3.5 w-3.5" />
                        + {preset?.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {socialItems.map((item, index) => {
                  const currentPreset = PLATFORM_PRESETS.find((p) => p.id === item.platform) || {
                    id: 'custom',
                    name: 'Custom',
                    placeholder: 'https://...',
                  };
                  const badgeClass = getPlatformBadgeStyle(item.platform);

                  return (
                    <div
                      key={item.id}
                      className="group flex flex-col gap-3 rounded-xl border border-neutral-200 bg-neutral-50/60 p-4 transition-all hover:border-neutral-300 hover:bg-white hover:shadow-sm sm:flex-row sm:items-center"
                    >
                      {/* Move order buttons */}
                      <div className="flex shrink-0 items-center gap-1 self-start sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleMoveSocial(index, 'up')}
                          disabled={index === 0}
                          className="rounded p-1 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700 disabled:opacity-30 disabled:hover:bg-transparent"
                          title="Geser ke atas"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveSocial(index, 'down')}
                          disabled={index === socialItems.length - 1}
                          className="rounded p-1 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700 disabled:opacity-30 disabled:hover:bg-transparent"
                          title="Geser ke bawah"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Platform Select */}
                      <div className="relative w-full shrink-0 sm:w-56">
                        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded border ${badgeClass}`}
                          >
                            <PlatformIcon platform={item.platform} className="h-3.5 w-3.5" />
                          </span>
                        </div>
                        <select
                          value={item.platform}
                          onChange={(e) => handleSocialChange(item.id, 'platform', e.target.value)}
                          className="w-full appearance-none rounded-lg border border-neutral-200 bg-white py-2.5 pr-8 pl-11 text-sm font-medium text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                        >
                          {PLATFORM_PRESETS.map((preset) => (
                            <option key={preset.id} value={preset.id}>
                              {preset.name}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-neutral-400">
                          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* If custom, show label input */}
                      {item.platform === 'custom' && (
                        <div className="w-full shrink-0 sm:w-44">
                          <input
                            type="text"
                            value={item.label || ''}
                            onChange={(e) => handleSocialChange(item.id, 'label', e.target.value)}
                            placeholder="Nama Platform"
                            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                          />
                        </div>
                      )}

                      {/* URL Input */}
                      <div className="relative flex-1">
                        <input
                          type="url"
                          value={item.url}
                          onChange={(e) => handleSocialChange(item.id, 'url', e.target.value)}
                          placeholder={currentPreset.placeholder}
                          className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                        />
                      </div>

                      {/* Action buttons */}
                      <div className="flex shrink-0 items-center gap-1 self-end sm:self-center">
                        {item.url && item.url.startsWith('http') && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                            title="Buka tautan di tab baru"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveSocial(item.id)}
                          className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Hapus media sosial ini"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Quick Add Presets Row */}
                <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 text-xs text-neutral-500">
                  <span className="font-medium">Tambah cepat:</span>
                  {['instagram', 'facebook', 'tiktok', 'linkedin', 'youtube', 'whatsapp', 'twitter', 'pinterest'].map((p) => {
                    const preset = PLATFORM_PRESETS.find((x) => x.id === p);
                    const isAlreadyAdded = socialItems.some((i) => i.platform === p);
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handleAddSocial(p)}
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-1 transition-all ${isAlreadyAdded
                            ? 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-teal-50 hover:text-teal-700'
                          }`}
                      >
                        <PlatformIcon platform={p} className="h-3 w-3" />
                        + {preset?.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* E-Catalog Upload Section (Single Column Layout) */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
                <BookOpen className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  E-Catalog Product Document (PDF / Word)
                </h2>
                <p className="text-sm text-neutral-500">
                  Upload your official product catalogue document in PDF or Word format
                </p>
              </div>
            </div>

            <div className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 p-5 space-y-4">
              {/* Catalog Title Input */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-neutral-800">
                  Catalog Title
                </label>
                <input
                  type="text"
                  value={data.catalog_title}
                  onChange={(e) => setData('catalog_title', e.target.value)}
                  placeholder="e.g. Ronica Product Catalogue 2026"
                  className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-xs text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-neutral-500">
                  The title displayed at the top of the interactive catalog preview modal
                </p>
              </div>

              {/* Document File Section */}
              <div className="pt-2 border-t border-neutral-200/60">
                <label className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-neutral-800">
                  <FileText className="h-4 w-4 text-teal-600" />
                  Catalog Document File (.pdf / .docx / .doc)
                </label>

                {/* Current PDF file indicator */}
                {data.catalog_pdf_url && (
                  <div className="mb-3 flex items-center justify-between rounded-md bg-white p-3 text-xs border border-neutral-200 shadow-2xs">
                    <div className="flex items-center gap-2 truncate min-w-0">
                      <span className="rounded bg-teal-100 px-2 py-0.5 font-bold text-teal-800 text-[10px] uppercase shrink-0">
                        PDF
                      </span>
                      <span className="truncate font-medium text-neutral-700">
                        {data.catalog_pdf_url}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0 ml-2">
                      <a
                        href={data.catalog_pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-teal-600 hover:underline"
                      >
                        Preview
                      </a>
                      <button
                        type="button"
                        disabled={deletingType === 'pdf'}
                        onClick={() => handleDeleteCatalog('pdf')}
                        className="inline-flex items-center gap-1 font-semibold text-red-600 hover:text-red-700 hover:underline cursor-pointer disabled:opacity-50"
                        title="Delete PDF file"
                      >
                        {deletingType === 'pdf' ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                )}

                {/* Current Word file indicator */}
                {data.catalog_docx_url && (
                  <div className="mb-3 flex items-center justify-between rounded-md bg-white p-3 text-xs border border-neutral-200 shadow-2xs">
                    <div className="flex items-center gap-2 truncate min-w-0">
                      <span className="rounded bg-blue-100 px-2 py-0.5 font-bold text-blue-800 text-[10px] uppercase shrink-0">
                        Word
                      </span>
                      <span className="truncate font-medium text-neutral-700">
                        {data.catalog_docx_url}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0 ml-2">
                      <a
                        href={data.catalog_docx_url}
                        download
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        Download
                      </a>
                      <button
                        type="button"
                        disabled={deletingType === 'docx'}
                        onClick={() => handleDeleteCatalog('docx')}
                        className="inline-flex items-center gap-1 font-semibold text-red-600 hover:text-red-700 hover:underline cursor-pointer disabled:opacity-50"
                        title="Delete Word file"
                      >
                        {deletingType === 'docx' ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                )}

                {/* Single File Upload Input for PDF or Word */}
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (file) {
                        const ext = file.name.split('.').pop()?.toLowerCase();
                        if (ext === 'pdf') {
                          setData((prev) => ({
                            ...prev,
                            catalog_pdf_file: file,
                            catalog_docx_file: null,
                          }));
                        } else {
                          setData((prev) => ({
                            ...prev,
                            catalog_docx_file: file,
                            catalog_pdf_file: null,
                          }));
                        }
                      }
                    }}
                    className="block w-full text-xs text-neutral-500 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-600 file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-white hover:file:bg-teal-700 cursor-pointer"
                  />
                </div>
                <p className="mt-2.5 text-xs text-neutral-500">
                  Supported formats: <b>PDF (.pdf)</b> or <b>Word (.docx, .doc)</b>. Max file size: 50 MB.
                </p>
              </div>
            </div>
          </div>

          {/* Sticky Submit Bar */}
          <div className="sticky bottom-6 z-30 flex items-center justify-between rounded-2xl border border-neutral-200/80 bg-white/90 px-6 py-4 shadow-xl backdrop-blur-md">
            <span className="hidden text-xs font-medium text-neutral-500 sm:inline">
              Please ensure details are accurate before saving
            </span>
            <button
              type="submit"
              disabled={processing}
              className="ml-auto inline-flex items-center gap-2 rounded-xl bg-[#a67c52] px-6 py-3 font-medium text-white shadow-md transition-all hover:bg-[#8e6843] active:scale-[0.98] disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              {processing ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>

      {/* Confirm Save Settings Dialog */}
      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title={t('admin.settings.confirm_save_title')}
        description={t('admin.settings.confirm_save_desc')}
        confirmText={t('admin.settings.confirm_save_button')}
        cancelText={t('common.cancel')}
        variant="default"
        isLoading={isSubmitting}
        onConfirm={confirmSaveSettings}
      />
    </AdminLayout>
  );
}
