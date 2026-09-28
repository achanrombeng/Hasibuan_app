import { ConfirmDialog } from '@/components/ui/alert-dialog';
import { useTranslation } from '@/hooks/use-translation';
import AdminLayout from '@/layouts/admin/admin-layout';
import {
  PLATFORM_PRESETS,
  PlatformIcon,
  getPlatformBadgeStyle,
  type SocialItem,
} from '@/lib/social-platforms';
import { Head, useForm } from '@inertiajs/react';
import {
  ArrowDown,
  ArrowUp,
  Building2,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  Link as LinkIcon,
  Mail,
  MessageCircle,
  PanelBottom,
  Phone,
  Plus,
  Save,
  ShieldCheck,
  Store,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface FooterLinkItem {
  label: string;
  url: string;
}

interface FooterSettingsProps {
  settings: {
    footer_description: string;
    footer_copyright: string;
    footer_col1_title: string;
    footer_col1_links: string; // JSON string
    footer_col2_title: string;
    footer_col2_links: string; // JSON string
    footer_contact_title: string;
    footer_show_factory: boolean;
    footer_show_showroom: boolean;
    footer_show_phone: boolean;
    footer_show_whatsapp: boolean;
    footer_show_email: boolean;
    footer_show_socials: boolean;
    footer_show_privacy?: boolean;
    footer_show_terms?: boolean;
    youtube_url: string;
    footer_privacy_url: string;
    footer_terms_url: string;
    // Site contacts for reference and social sync
    site_description: string;
    contact_email: string;
    contact_phone: string;
    contact_whatsapp: string;
    facebook_url: string;
    instagram_url: string;
    tiktok_url: string;
    linkedin_url?: string;
    social_links?: string;
  };
}

export default function FooterSettings({ settings }: FooterSettingsProps) {
  // Parse initial column links
  const initialCol1Links: FooterLinkItem[] = (() => {
    try {
      return JSON.parse(settings.footer_col1_links || '[]');
    } catch {
      return [];
    }
  })();

  const initialCol2Links: FooterLinkItem[] = (() => {
    try {
      return JSON.parse(settings.footer_col2_links || '[]');
    } catch {
      return [];
    }
  })();

  const [col1Links, setCol1Links] =
    useState<FooterLinkItem[]>(initialCol1Links);
  const [col2Links, setCol2Links] =
    useState<FooterLinkItem[]>(initialCol2Links);

  // Parse initial social links
  const initialSocialLinks: SocialItem[] = (() => {
    const list: SocialItem[] = [];
    const seenPlatforms = new Set<string>();

    if (settings.social_links) {
      try {
        const parsed = JSON.parse(settings.social_links);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach((item: any, idx: number) => {
            if (item && item.platform) {
              list.push({
                id: item.id || `social-${idx}-${Date.now()}`,
                platform: item.platform || 'instagram',
                url: item.url || '',
                label: item.label || '',
              });
              if (item.url && item.url.trim().length > 0) {
                seenPlatforms.add(item.platform.toLowerCase());
              }
            }
          });
        }
      } catch {
        // ignore
      }
    }

    // Merge standalone platforms if they have URLs and not yet in list
    const standalone: { id: string; platform: string; url?: string }[] = [
      { id: 'social-fb', platform: 'facebook', url: settings.facebook_url },
      { id: 'social-ig', platform: 'instagram', url: settings.instagram_url },
      { id: 'social-tt', platform: 'tiktok', url: settings.tiktok_url },
      { id: 'social-yt', platform: 'youtube', url: settings.youtube_url },
      { id: 'social-li', platform: 'linkedin', url: settings.linkedin_url },
    ];

    standalone.forEach(({ id, platform, url }) => {
      if (url && url.trim().length > 0 && !seenPlatforms.has(platform)) {
        list.push({ id, platform, url, label: '' });
        seenPlatforms.add(platform);
      }
    });

    return list.length > 0
      ? list
      : [
          { id: '1', platform: 'instagram', url: '' },
          { id: '2', platform: 'facebook', url: '' },
          { id: '3', platform: 'tiktok', url: '' },
          { id: '4', platform: 'youtube', url: '' },
        ];
  })();

  const [socialItems, setSocialItems] =
    useState<SocialItem[]>(initialSocialLinks);

  const { data, setData, post, processing } = useForm({
    footer_description: settings.footer_description,
    footer_copyright: settings.footer_copyright,
    footer_col1_title: settings.footer_col1_title,
    footer_col1_links: settings.footer_col1_links,
    footer_col2_title: settings.footer_col2_title,
    footer_col2_links: settings.footer_col2_links,
    footer_contact_title: settings.footer_contact_title,
    footer_show_factory: settings.footer_show_factory,
    footer_show_showroom: settings.footer_show_showroom,
    footer_show_phone: settings.footer_show_phone,
    footer_show_whatsapp: settings.footer_show_whatsapp,
    footer_show_email: settings.footer_show_email,
    footer_show_socials: settings.footer_show_socials,
    footer_show_privacy: settings.footer_show_privacy ?? true,
    footer_show_terms: settings.footer_show_terms ?? true,
    social_links: JSON.stringify(initialSocialLinks),
    facebook_url: settings.facebook_url || '',
    instagram_url: settings.instagram_url || '',
    tiktok_url: settings.tiktok_url || '',
    youtube_url: settings.youtube_url || '',
    linkedin_url: settings.linkedin_url || '',
    footer_privacy_url: settings.footer_privacy_url,
    footer_terms_url: settings.footer_terms_url,
  });

  const updateSocialItems = (newItems: SocialItem[]) => {
    setSocialItems(newItems);

    let fb = '';
    let ig = '';
    let tt = '';
    let yt = '';
    let li = '';
    newItems.forEach((item) => {
      if (item.platform === 'facebook' && !fb) fb = item.url;
      if (item.platform === 'instagram' && !ig) ig = item.url;
      if (item.platform === 'tiktok' && !tt) tt = item.url;
      if (item.platform === 'youtube' && !yt) yt = item.url;
      if (item.platform === 'linkedin' && !li) li = item.url;
    });

    setData((prev) => ({
      ...prev,
      social_links: JSON.stringify(
        newItems
          .filter((i) => i.url.trim().length > 0)
          .map(({ platform, url, label }) => ({ platform, url, label })),
      ),
      facebook_url: fb,
      instagram_url: ig,
      tiktok_url: tt,
      youtube_url: yt,
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
    value: string,
  ) => {
    updateSocialItems(
      socialItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
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

  // Column 1 Handlers
  const handleCol1Change = (
    index: number,
    field: 'label' | 'url',
    value: string,
  ) => {
    const updated = [...col1Links];
    updated[index][field] = value;
    setCol1Links(updated);
    setData('footer_col1_links', JSON.stringify(updated));
  };

  const addCol1Link = () => {
    const updated = [...col1Links, { label: '', url: '' }];
    setCol1Links(updated);
    setData('footer_col1_links', JSON.stringify(updated));
  };

  const removeCol1Link = (index: number) => {
    const updated = col1Links.filter((_, i) => i !== index);
    setCol1Links(updated);
    setData('footer_col1_links', JSON.stringify(updated));
  };

  // Column 2 Handlers
  const handleCol2Change = (
    index: number,
    field: 'label' | 'url',
    value: string,
  ) => {
    const updated = [...col2Links];
    updated[index][field] = value;
    setCol2Links(updated);
    setData('footer_col2_links', JSON.stringify(updated));
  };

  const addCol2Link = () => {
    const updated = [...col2Links, { label: '', url: '' }];
    setCol2Links(updated);
    setData('footer_col2_links', JSON.stringify(updated));
  };

  const removeCol2Link = (index: number) => {
    const updated = col2Links.filter((_, i) => i !== index);
    setCol2Links(updated);
    setData('footer_col2_links', JSON.stringify(updated));
  };

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const confirmSaveFooter = () => {
    post('/admin/settings/footer', {
      preserveScroll: true,
      onSuccess: () => {
        setShowConfirmDialog(false);
      },
      onError: () => {
        setShowConfirmDialog(false);
      },
    });
  };

  return (
    <AdminLayout
      breadcrumbs={[
        { title: 'Settings', href: '/admin/settings' },
        { title: 'Footer Settings', href: '/admin/settings/footer' },
      ]}
    >
      <Head title="Footer Settings" />

      <div className="w-full space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Store Footer Settings
          </h1>
          <p className="mt-1 text-neutral-500">
            Manage store description, copyright text, column navigation, contact
            info, and social media links displayed on storefront footers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Informasi Umum & Hak Cipta */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
                <PanelBottom className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Description &amp; Copyright Text
                </h2>
                <p className="text-sm text-neutral-500">
                  Short store description and bottom copyright text
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Short Footer Description
                </label>
                <textarea
                  value={data.footer_description}
                  onChange={(e) =>
                    setData('footer_description', e.target.value)
                  }
                  rows={3}
                  placeholder={
                    settings.site_description ||
                    'Minimalist furniture crafted from sustainable materials. Created for those who find luxury in simplicity.'
                  }
                  className="w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
                <p className="mt-1.5 text-xs text-neutral-500">
                  Leave empty to use primary store description (
                  {settings.site_description
                    ? 'Active store description'
                    : 'default'}
                  ).
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Copyright Text
                </label>
                <input
                  type="text"
                  value={data.footer_copyright}
                  onChange={(e) => setData('footer_copyright', e.target.value)}
                  placeholder="© 2026 Ronica. All rights reserved."
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
                <p className="mt-1.5 text-xs text-neutral-500">
                  Leave empty to use default format (© [Year] [Store Name]. All
                  rights reserved.)
                </p>
              </div>
            </div>
          </div>

          {/* 2. Navigasi Kolom 1 */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <LinkIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Navigation Column 1 (Shop)
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Manage column title and shopping link navigation
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={addCol1Link}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3.5 py-2 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
              >
                <Plus className="h-4 w-4" />
                Add Link
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Column 1 Title
                </label>
                <input
                  type="text"
                  value={data.footer_col1_title}
                  onChange={(e) => setData('footer_col1_title', e.target.value)}
                  placeholder="Shop"
                  className="w-full max-w-md rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
              </div>

              <div className="space-y-3">
                {col1Links.map((link, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-neutral-50/50 p-3 sm:flex-row sm:items-center"
                  >
                    <div className="flex-1">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) =>
                          handleCol1Change(index, 'label', e.target.value)
                        }
                        placeholder="Link Label (e.g. All Products)"
                        className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) =>
                          handleCol1Change(index, 'url', e.target.value)
                        }
                        placeholder="URL (e.g. /shop/products)"
                        className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCol1Link(index)}
                      className="rounded-md p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 sm:self-center"
                      title="Delete Link"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {col1Links.length === 0 && (
                  <div className="rounded-lg border border-dashed border-neutral-300 py-6 text-center text-sm text-neutral-400">
                    No links in Column 1 yet. Click &quot;Add Link&quot; to get
                    started.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Navigasi Kolom 2 */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                  <LinkIcon className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Navigation Column 2 (Company)
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Manage column title and company info links
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={addCol2Link}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3.5 py-2 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-100"
              >
                <Plus className="h-4 w-4" />
                Add Link
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Column 2 Title
                </label>
                <input
                  type="text"
                  value={data.footer_col2_title}
                  onChange={(e) => setData('footer_col2_title', e.target.value)}
                  placeholder="Company"
                  className="w-full max-w-md rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
              </div>

              <div className="space-y-3">
                {col2Links.map((link, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-neutral-50/50 p-3 sm:flex-row sm:items-center"
                  >
                    <div className="flex-1">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) =>
                          handleCol2Change(index, 'label', e.target.value)
                        }
                        placeholder="Link Label (e.g. About Us)"
                        className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) =>
                          handleCol2Change(index, 'url', e.target.value)
                        }
                        placeholder="URL (e.g. /shop/about)"
                        className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCol2Link(index)}
                      className="rounded-md p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 sm:self-center"
                      title="Delete Link"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {col2Links.length === 0 && (
                  <div className="rounded-lg border border-dashed border-neutral-300 py-6 text-center text-sm text-neutral-400">
                    No links in Column 2 yet. Click &quot;Add Link&quot; to get
                    started.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4. Informasi Kontak & Visibilitas */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                <Eye className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Contact Info &amp; Footer Display Options
                </h2>
                <p className="text-sm text-neutral-500">
                  Choose which contact information to show on footer columns
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Contact Section Title
                </label>
                <input
                  type="text"
                  value={data.footer_contact_title}
                  onChange={(e) =>
                    setData('footer_contact_title', e.target.value)
                  }
                  placeholder="Contact Information"
                  className="w-full max-w-md rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {/* Factory Address */}
                <div
                  className={`flex items-center justify-between rounded-xl border p-4 transition-all ${data.footer_show_factory ? 'border-neutral-200 bg-white shadow-sm' : 'border-dashed border-neutral-300 bg-neutral-50/70 opacity-75'}`}
                >
                  <span className="flex items-center gap-2.5 text-sm font-medium text-neutral-800">
                    <Building2 className="h-4 w-4 text-teal-600" />
                    Factory Address
                  </span>
                  <div className="inline-flex items-center rounded-lg border border-neutral-200 bg-neutral-100 p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setData('footer_show_factory', true)}
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-medium transition-all ${data.footer_show_factory ? 'bg-emerald-600 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
                    >
                      <Eye className="h-3 w-3" /> Show
                    </button>
                    <button
                      type="button"
                      onClick={() => setData('footer_show_factory', false)}
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-medium transition-all ${!data.footer_show_factory ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
                    >
                      <EyeOff className="h-3 w-3" /> Hide
                    </button>
                  </div>
                </div>

                {/* Showroom Address */}
                <div
                  className={`flex items-center justify-between rounded-xl border p-4 transition-all ${data.footer_show_showroom ? 'border-neutral-200 bg-white shadow-sm' : 'border-dashed border-neutral-300 bg-neutral-50/70 opacity-75'}`}
                >
                  <span className="flex items-center gap-2.5 text-sm font-medium text-neutral-800">
                    <Store className="h-4 w-4 text-teal-600" />
                    Showroom Address
                  </span>
                  <div className="inline-flex items-center rounded-lg border border-neutral-200 bg-neutral-100 p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setData('footer_show_showroom', true)}
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-medium transition-all ${data.footer_show_showroom ? 'bg-emerald-600 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
                    >
                      <Eye className="h-3 w-3" /> Show
                    </button>
                    <button
                      type="button"
                      onClick={() => setData('footer_show_showroom', false)}
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-medium transition-all ${!data.footer_show_showroom ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
                    >
                      <EyeOff className="h-3 w-3" /> Hide
                    </button>
                  </div>
                </div>

                {/* Phone Number */}
                <div
                  className={`flex items-center justify-between rounded-xl border p-4 transition-all ${data.footer_show_phone ? 'border-neutral-200 bg-white shadow-sm' : 'border-dashed border-neutral-300 bg-neutral-50/70 opacity-75'}`}
                >
                  <span className="flex items-center gap-2.5 text-sm font-medium text-neutral-800">
                    <Phone className="h-4 w-4 text-teal-600" />
                    Phone Number
                  </span>
                  <div className="inline-flex items-center rounded-lg border border-neutral-200 bg-neutral-100 p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setData('footer_show_phone', true)}
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-medium transition-all ${data.footer_show_phone ? 'bg-emerald-600 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
                    >
                      <Eye className="h-3 w-3" /> Show
                    </button>
                    <button
                      type="button"
                      onClick={() => setData('footer_show_phone', false)}
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-medium transition-all ${!data.footer_show_phone ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
                    >
                      <EyeOff className="h-3 w-3" /> Hide
                    </button>
                  </div>
                </div>

                {/* WhatsApp Number */}
                <div
                  className={`flex items-center justify-between rounded-xl border p-4 transition-all ${data.footer_show_whatsapp ? 'border-neutral-200 bg-white shadow-sm' : 'border-dashed border-neutral-300 bg-neutral-50/70 opacity-75'}`}
                >
                  <span className="flex items-center gap-2.5 text-sm font-medium text-neutral-800">
                    <MessageCircle className="h-4 w-4 text-teal-600" />
                    WhatsApp Number
                  </span>
                  <div className="inline-flex items-center rounded-lg border border-neutral-200 bg-neutral-100 p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setData('footer_show_whatsapp', true)}
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-medium transition-all ${data.footer_show_whatsapp ? 'bg-emerald-600 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
                    >
                      <Eye className="h-3 w-3" /> Show
                    </button>
                    <button
                      type="button"
                      onClick={() => setData('footer_show_whatsapp', false)}
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-medium transition-all ${!data.footer_show_whatsapp ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
                    >
                      <EyeOff className="h-3 w-3" /> Hide
                    </button>
                  </div>
                </div>

                {/* Contact Email */}
                <div
                  className={`flex items-center justify-between rounded-xl border p-4 transition-all ${data.footer_show_email ? 'border-neutral-200 bg-white shadow-sm' : 'border-dashed border-neutral-300 bg-neutral-50/70 opacity-75'}`}
                >
                  <span className="flex items-center gap-2.5 text-sm font-medium text-neutral-800">
                    <Mail className="h-4 w-4 text-teal-600" />
                    Contact Email
                  </span>
                  <div className="inline-flex items-center rounded-lg border border-neutral-200 bg-neutral-100 p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setData('footer_show_email', true)}
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-medium transition-all ${data.footer_show_email ? 'bg-emerald-600 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
                    >
                      <Eye className="h-3 w-3" /> Show
                    </button>
                    <button
                      type="button"
                      onClick={() => setData('footer_show_email', false)}
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-medium transition-all ${!data.footer_show_email ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
                    >
                      <EyeOff className="h-3 w-3" /> Hide
                    </button>
                  </div>
                </div>

                {/* Social Media */}
                <div
                  className={`flex items-center justify-between rounded-xl border p-4 transition-all ${data.footer_show_socials ? 'border-neutral-200 bg-white shadow-sm' : 'border-dashed border-neutral-300 bg-neutral-50/70 opacity-75'}`}
                >
                  <span className="flex items-center gap-2.5 text-sm font-medium text-neutral-800">
                    <Globe className="h-4 w-4 text-teal-600" />
                    Social Media
                  </span>
                  <div className="inline-flex items-center rounded-lg border border-neutral-200 bg-neutral-100 p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setData('footer_show_socials', true)}
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-medium transition-all ${data.footer_show_socials ? 'bg-emerald-600 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
                    >
                      <Eye className="h-3 w-3" /> Show
                    </button>
                    <button
                      type="button"
                      onClick={() => setData('footer_show_socials', false)}
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-medium transition-all ${!data.footer_show_socials ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
                    >
                      <EyeOff className="h-3 w-3" /> Hide
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Media Sosial & Tautan Halaman Legal */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50">
                  <Globe className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-lg font-semibold text-neutral-900">
                      Social Media &amp; Legal Page Links
                    </h2>
                    <span className="inline-flex items-center rounded-full border border-purple-100 bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                      {socialItems.length} Platform
                    </span>
                  </div>
                  <p className="text-sm text-neutral-500">
                    Manage store social media accounts and Privacy Policy /
                    Terms &amp; Conditions pages
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
            <div className="space-y-4">
              {socialItems.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 p-8 text-center">
                  <Globe className="mx-auto h-8 w-8 text-neutral-400" />
                  <p className="mt-2 text-sm font-medium text-neutral-700">
                    No social media accounts have been added yet
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    Click the buttons below to add your preferred platforms
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    {[
                      'instagram',
                      'facebook',
                      'tiktok',
                      'youtube',
                      'whatsapp',
                      'linkedin',
                    ].map((p) => {
                      const preset = PLATFORM_PRESETS.find((x) => x.id === p);
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handleAddSocial(p)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-sm transition-all hover:border-teal-500 hover:text-teal-600"
                        >
                          <PlatformIcon platform={p} className="h-3.5 w-3.5" />+{' '}
                          {preset?.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {socialItems.map((item, index) => {
                    const currentPreset = PLATFORM_PRESETS.find(
                      (p) => p.id === item.platform,
                    ) || {
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
                            title="Move Up"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveSocial(index, 'down')}
                            disabled={index === socialItems.length - 1}
                            className="rounded p-1 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700 disabled:opacity-30 disabled:hover:bg-transparent"
                            title="Move Down"
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
                              <PlatformIcon
                                platform={item.platform}
                                className="h-3.5 w-3.5"
                              />
                            </span>
                          </div>
                          <select
                            value={item.platform}
                            onChange={(e) =>
                              handleSocialChange(
                                item.id,
                                'platform',
                                e.target.value,
                              )
                            }
                            className="w-full appearance-none rounded-lg border border-neutral-200 bg-white py-2.5 pr-8 pl-11 text-sm font-medium text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                          >
                            {PLATFORM_PRESETS.map((preset) => (
                              <option key={preset.id} value={preset.id}>
                                {preset.name}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-neutral-400">
                            <svg
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
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
                              onChange={(e) =>
                                handleSocialChange(
                                  item.id,
                                  'label',
                                  e.target.value,
                                )
                              }
                              placeholder="Platform Name"
                              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                            />
                          </div>
                        )}

                        {/* URL Input */}
                        <div className="relative flex-1">
                          <input
                            type="url"
                            value={item.url}
                            onChange={(e) =>
                              handleSocialChange(item.id, 'url', e.target.value)
                            }
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
                              title="Open link in new tab"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveSocial(item.id)}
                            className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
                            title="Remove this platform"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Quick Add Presets Row */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 text-xs text-neutral-500">
                    <span className="font-medium">Quick add:</span>
                    {PLATFORM_PRESETS.filter(
                      (p) =>
                        !socialItems.some((item) => item.platform === p.id),
                    ).map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleAddSocial(preset.id)}
                        className="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-neutral-600 transition-all hover:border-teal-500 hover:text-teal-600 active:scale-95"
                      >
                        <PlatformIcon
                          platform={preset.id}
                          className="h-3 w-3"
                        />
                        + {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Legal Links Section */}
              <div className="mt-8 border-t border-neutral-200 pt-6">
                <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
                    <ShieldCheck className="h-4 w-4 text-teal-600" />
                    Legal Pages (Privacy Policy &amp; Terms)
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Show or hide bottom footer legal links and customize their
                    URLs
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Privacy Policy */}
                  <div
                    className={`space-y-3 rounded-xl border p-4 transition-all ${
                      data.footer_show_privacy
                        ? 'border-neutral-200/80 bg-white shadow-sm'
                        : 'border-dashed border-neutral-300 bg-neutral-50/70 opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <label className="text-sm font-semibold text-neutral-800">
                          Privacy Policy URL
                        </label>
                        <p className="text-[11px] text-neutral-500">
                          {data.footer_show_privacy
                            ? 'Visible on footer'
                            : 'Hidden from footer'}
                        </p>
                      </div>

                      {/* Show / Hide Toggle Buttons */}
                      <div className="inline-flex items-center rounded-lg border border-neutral-200 bg-neutral-100 p-0.5 text-xs">
                        <button
                          type="button"
                          onClick={() => setData('footer_show_privacy', true)}
                          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 font-medium transition-all ${
                            data.footer_show_privacy
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'text-neutral-600 hover:text-neutral-900'
                          }`}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Show
                        </button>
                        <button
                          type="button"
                          onClick={() => setData('footer_show_privacy', false)}
                          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 font-medium transition-all ${
                            !data.footer_show_privacy
                              ? 'bg-neutral-700 text-white shadow-sm'
                              : 'text-neutral-600 hover:text-neutral-900'
                          }`}
                        >
                          <EyeOff className="h-3.5 w-3.5" />
                          Hide
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={data.footer_privacy_url}
                      onChange={(e) =>
                        setData('footer_privacy_url', e.target.value)
                      }
                      placeholder="/shop/privacy-policy"
                      className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                    />
                  </div>

                  {/* Terms & Conditions */}
                  <div
                    className={`space-y-3 rounded-xl border p-4 transition-all ${
                      data.footer_show_terms
                        ? 'border-neutral-200/80 bg-white shadow-sm'
                        : 'border-dashed border-neutral-300 bg-neutral-50/70 opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <label className="text-sm font-semibold text-neutral-800">
                          Terms &amp; Conditions URL
                        </label>
                        <p className="text-[11px] text-neutral-500">
                          {data.footer_show_terms
                            ? 'Visible on footer'
                            : 'Hidden from footer'}
                        </p>
                      </div>

                      {/* Show / Hide Toggle Buttons */}
                      <div className="inline-flex items-center rounded-lg border border-neutral-200 bg-neutral-100 p-0.5 text-xs">
                        <button
                          type="button"
                          onClick={() => setData('footer_show_terms', true)}
                          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 font-medium transition-all ${
                            data.footer_show_terms
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'text-neutral-600 hover:text-neutral-900'
                          }`}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Show
                        </button>
                        <button
                          type="button"
                          onClick={() => setData('footer_show_terms', false)}
                          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 font-medium transition-all ${
                            !data.footer_show_terms
                              ? 'bg-neutral-700 text-white shadow-sm'
                              : 'text-neutral-600 hover:text-neutral-900'
                          }`}
                        >
                          <EyeOff className="h-3.5 w-3.5" />
                          Hide
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={data.footer_terms_url}
                      onChange={(e) =>
                        setData('footer_terms_url', e.target.value)
                      }
                      placeholder="/shop/terms"
                      className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                    />
                  </div>
                </div>
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
              {processing ? 'Saving...' : 'Save Footer Settings'}
            </button>
          </div>
        </form>
      </div>

      {/* Confirm Save Footer Settings Dialog */}
      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title={t('admin.settings.confirm_save_footer_title')}
        description={t('admin.settings.confirm_save_footer_desc')}
        confirmText={t('admin.settings.confirm_save_footer_button')}
        cancelText={t('common.cancel')}
        variant="default"
        isLoading={processing}
        onConfirm={confirmSaveFooter}
      />
    </AdminLayout>
  );
}
