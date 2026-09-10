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
  User,
  UserCheck,
  Users,
  Youtube,
} from 'lucide-react';
import {
  PLATFORM_PRESETS,
  PlatformIcon,
  getPlatformBadgeStyle,
  type SocialItem,
} from '@/lib/social-platforms';
import { useState } from 'react';

interface SettingsIndexProps {
  settings: {
    site_name: string;
    site_description: string;
    contact_email: string;
    contact_email_2?: string;
    contact_phone: string;
    contact_whatsapp: string;
    marketing_1_name?: string;
    marketing_1_email?: string;
    marketing_1_phone?: string;
    marketing_2_name?: string;
    marketing_2_email?: string;
    marketing_2_phone?: string;
    admin_1_name?: string;
    admin_1_email?: string;
    admin_1_phone?: string;
    admin_2_name?: string;
    admin_2_email?: string;
    admin_2_phone?: string;
    factory_name?: string;
    factory_address?: string;
    showroom_name?: string;
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
    marketing_1_name: settings.marketing_1_name ?? settings.admin_1_name ?? '',
    marketing_1_email: settings.marketing_1_email ?? settings.admin_1_email ?? settings.contact_email ?? '',
    marketing_1_phone: settings.marketing_1_phone ?? settings.admin_1_phone ?? settings.contact_whatsapp ?? settings.contact_phone ?? '',
    marketing_2_name: settings.marketing_2_name ?? settings.admin_2_name ?? '',
    marketing_2_email: settings.marketing_2_email ?? settings.admin_2_email ?? settings.contact_email_2 ?? '',
    marketing_2_phone: settings.marketing_2_phone ?? settings.admin_2_phone ?? '',
    admin_1_name: settings.marketing_1_name ?? settings.admin_1_name ?? '',
    admin_1_email: settings.marketing_1_email ?? settings.admin_1_email ?? settings.contact_email ?? '',
    admin_1_phone: settings.marketing_1_phone ?? settings.admin_1_phone ?? settings.contact_whatsapp ?? settings.contact_phone ?? '',
    admin_2_name: settings.marketing_2_name ?? settings.admin_2_name ?? '',
    admin_2_email: settings.marketing_2_email ?? settings.admin_2_email ?? settings.contact_email_2 ?? '',
    admin_2_phone: settings.marketing_2_phone ?? settings.admin_2_phone ?? '',
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
                  Contact Information (Marketing)
                </h2>
                <p className="text-sm text-neutral-500">
                  Manage marketing contact persons, email, WhatsApp, and showroom / factory locations
                </p>
              </div>
            </div>

            {/* Admin 1 & Admin 2 Options */}
            <div className="mb-8 space-y-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Admin 1 Card */}
                <div className="rounded-xl border border-teal-200 bg-teal-50/30 p-5 transition-all hover:border-teal-300">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white shadow-xs">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-neutral-900">
                          Admin 1 (Utama / Primary)
                        </h3>
                        <p className="text-[11px] text-neutral-500">
                          Kontak Admin 1 &amp; customer service utama
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-800">
                      Utama
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-neutral-700">
                        Nama Admin 1
                      </label>
                      <div className="relative">
                        <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                        <input
                          type="text"
                          value={data.admin_1_name ?? data.marketing_1_name ?? ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setData((prev) => ({
                              ...prev,
                              marketing_1_name: val,
                              admin_1_name: val,
                            }));
                          }}
                          placeholder="cth: Mr. Halit"
                          className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pr-4 pl-9 text-sm text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-neutral-700">
                        Email Admin 1
                      </label>
                      <div className="relative">
                        <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                        <input
                          type="email"
                          value={data.admin_1_email ?? data.marketing_1_email ?? ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setData((prev) => ({
                              ...prev,
                              marketing_1_email: val,
                              admin_1_email: val,
                              contact_email: val,
                            }));
                          }}
                          placeholder="info@ronica.com.tr"
                          className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pr-4 pl-9 text-sm text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-neutral-700">
                        Kontak / WhatsApp Admin 1
                      </label>
                      <div className="relative">
                        <MessageCircle className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                        <input
                          type="text"
                          value={data.admin_1_phone ?? data.marketing_1_phone ?? ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setData((prev) => ({
                              ...prev,
                              marketing_1_phone: val,
                              admin_1_phone: val,
                              contact_whatsapp: val,
                              contact_phone: val,
                            }));
                          }}
                          placeholder="+61415266787 / 6281234567890"
                          className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pr-4 pl-9 text-sm text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                        />
                      </div>
                      <p className="mt-1 text-[11px] text-neutral-500">
                        Nomor telepon / WhatsApp utama Admin 1
                      </p>
                    </div>
                  </div>
                </div>

                {/* Admin 2 Card */}
                <div className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-5 transition-all hover:border-neutral-300">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-700 text-white shadow-xs">
                        <UserCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-neutral-900">
                          Admin 2 (Cadangan / Opsional)
                        </h3>
                        <p className="text-[11px] text-neutral-500">
                          Kontak Admin 2 atau divisi customer service alternatif
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-neutral-200 px-2.5 py-0.5 text-xs font-medium text-neutral-700">
                      Opsional
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-neutral-700">
                        Nama Admin 2
                      </label>
                      <div className="relative">
                        <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                        <input
                          type="text"
                          value={data.admin_2_name ?? data.marketing_2_name ?? ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setData((prev) => ({
                              ...prev,
                              marketing_2_name: val,
                              admin_2_name: val,
                            }));
                          }}
                          placeholder="cth: Admin 2 / Support"
                          className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pr-4 pl-9 text-sm text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-neutral-700">
                        Email Admin 2
                      </label>
                      <div className="relative">
                        <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                        <input
                          type="email"
                          value={data.admin_2_email ?? data.marketing_2_email ?? ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setData((prev) => ({
                              ...prev,
                              marketing_2_email: val,
                              admin_2_email: val,
                              contact_email_2: val,
                            }));
                          }}
                          placeholder="sales@ronica.com.tr"
                          className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pr-4 pl-9 text-sm text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-neutral-700">
                        Kontak / WhatsApp Admin 2
                      </label>
                      <div className="relative">
                        <MessageCircle className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                        <input
                          type="text"
                          value={data.admin_2_phone ?? data.marketing_2_phone ?? ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setData((prev) => ({
                              ...prev,
                              marketing_2_phone: val,
                              admin_2_phone: val,
                            }));
                          }}
                          placeholder="6289876543210"
                          className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pr-4 pl-9 text-sm text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                        />
                      </div>
                      <p className="mt-1 text-[11px] text-neutral-500">
                        Nomor kontak alternatif Admin 2
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lokasi Pabrik & Showroom */}
            <div className="border-t border-neutral-200/80 pt-6">
              <div className="mb-4 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-teal-600" />
                <h3 className="text-sm font-semibold text-neutral-900">
                  Lokasi Pabrik &amp; Showroom (Factory &amp; Showroom)
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    Factory Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      value={data.factory_name ?? ''}
                      onChange={(e) => setData('factory_name', e.target.value)}
                      placeholder="PT. Eren Outdoor Furniture"
                      className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-3 pr-4 pl-10 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                    />
                  </div>
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
                    Showroom Name
                  </label>
                  <div className="relative">
                    <Store className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      value={data.showroom_name ?? ''}
                      onChange={(e) => setData('showroom_name', e.target.value)}
                      placeholder="Ronica Furniture"
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
                      placeholder="Jepara, Indonesia"
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
