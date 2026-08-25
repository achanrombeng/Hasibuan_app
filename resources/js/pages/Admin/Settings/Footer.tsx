import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, useForm } from '@inertiajs/react';
import {
  Building2,
  Eye,
  Facebook,
  Globe,
  Instagram,
  Link as LinkIcon,
  Mail,
  MessageCircle,
  PanelBottom,
  Plus,
  Phone,
  Save,
  ShieldCheck,
  Store,
  Trash2,
  Youtube,
} from 'lucide-react';
import { useState } from 'react';

function TikTokIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
  );
}

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
    youtube_url: string;
    footer_privacy_url: string;
    footer_terms_url: string;
    // Site contacts for reference
    site_description: string;
    contact_email: string;
    contact_phone: string;
    contact_whatsapp: string;
    facebook_url: string;
    instagram_url: string;
    tiktok_url: string;
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

  const [col1Links, setCol1Links] = useState<FooterLinkItem[]>(initialCol1Links);
  const [col2Links, setCol2Links] = useState<FooterLinkItem[]>(initialCol2Links);

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
    youtube_url: settings.youtube_url,
    footer_privacy_url: settings.footer_privacy_url,
    footer_terms_url: settings.footer_terms_url,
  });

  // Column 1 Handlers
  const handleCol1Change = (index: number, field: 'label' | 'url', value: string) => {
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
  const handleCol2Change = (index: number, field: 'label' | 'url', value: string) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/settings/footer');
  };

  return (
    <AdminLayout
      breadcrumbs={[
        { title: 'Settings', href: '/admin/settings' },
        { title: 'Footer Settings', href: '/admin/settings/footer' },
      ]}
    >
      <Head title="Footer Settings" />

      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Store Footer Settings
          </h1>
          <p className="mt-1 text-neutral-500">
            Manage store description, copyright text, column navigation, contact info, and social media links displayed on storefront footers.
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
                  onChange={(e) => setData('footer_description', e.target.value)}
                  rows={3}
                  placeholder={
                    settings.site_description ||
                    'Minimalist furniture crafted from sustainable materials. Created for those who find luxury in simplicity.'
                  }
                  className="w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
                <p className="mt-1.5 text-xs text-neutral-500">
                  Leave empty to use primary store description ({settings.site_description ? 'Active store description' : 'default'}).
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
                  Leave empty to use default format (© [Year] [Store Name]. All rights reserved.)
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
                        onChange={(e) => handleCol1Change(index, 'label', e.target.value)}
                        placeholder="Link Label (e.g. All Products)"
                        className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => handleCol1Change(index, 'url', e.target.value)}
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
                    No links in Column 1 yet. Click &quot;Add Link&quot; to get started.
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
                        onChange={(e) => handleCol2Change(index, 'label', e.target.value)}
                        placeholder="Link Label (e.g. About Us)"
                        className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => handleCol2Change(index, 'url', e.target.value)}
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
                    No links in Column 2 yet. Click &quot;Add Link&quot; to get started.
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
                  onChange={(e) => setData('footer_contact_title', e.target.value)}
                  placeholder="Contact Information"
                  className="w-full max-w-md rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 p-4 transition-all hover:bg-neutral-100/60">
                  <span className="flex items-center gap-2.5 text-sm font-medium text-neutral-800">
                    <Building2 className="h-4 w-4 text-teal-600" />
                    Factory Address
                  </span>
                  <input
                    type="checkbox"
                    checked={data.footer_show_factory}
                    onChange={(e) => setData('footer_show_factory', e.target.checked)}
                    className="h-4 w-4 rounded border-neutral-300 text-teal-600 focus:ring-teal-500"
                  />
                </label>

                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 p-4 transition-all hover:bg-neutral-100/60">
                  <span className="flex items-center gap-2.5 text-sm font-medium text-neutral-800">
                    <Store className="h-4 w-4 text-teal-600" />
                    Showroom Address
                  </span>
                  <input
                    type="checkbox"
                    checked={data.footer_show_showroom}
                    onChange={(e) => setData('footer_show_showroom', e.target.checked)}
                    className="h-4 w-4 rounded border-neutral-300 text-teal-600 focus:ring-teal-500"
                  />
                </label>

                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 p-4 transition-all hover:bg-neutral-100/60">
                  <span className="flex items-center gap-2.5 text-sm font-medium text-neutral-800">
                    <Phone className="h-4 w-4 text-teal-600" />
                    Phone Number
                  </span>
                  <input
                    type="checkbox"
                    checked={data.footer_show_phone}
                    onChange={(e) => setData('footer_show_phone', e.target.checked)}
                    className="h-4 w-4 rounded border-neutral-300 text-teal-600 focus:ring-teal-500"
                  />
                </label>

                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 p-4 transition-all hover:bg-neutral-100/60">
                  <span className="flex items-center gap-2.5 text-sm font-medium text-neutral-800">
                    <MessageCircle className="h-4 w-4 text-teal-600" />
                    WhatsApp Number
                  </span>
                  <input
                    type="checkbox"
                    checked={data.footer_show_whatsapp}
                    onChange={(e) => setData('footer_show_whatsapp', e.target.checked)}
                    className="h-4 w-4 rounded border-neutral-300 text-teal-600 focus:ring-teal-500"
                  />
                </label>

                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 p-4 transition-all hover:bg-neutral-100/60">
                  <span className="flex items-center gap-2.5 text-sm font-medium text-neutral-800">
                    <Mail className="h-4 w-4 text-teal-600" />
                    Contact Email
                  </span>
                  <input
                    type="checkbox"
                    checked={data.footer_show_email}
                    onChange={(e) => setData('footer_show_email', e.target.checked)}
                    className="h-4 w-4 rounded border-neutral-300 text-teal-600 focus:ring-teal-500"
                  />
                </label>

                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 p-4 transition-all hover:bg-neutral-100/60">
                  <span className="flex items-center gap-2.5 text-sm font-medium text-neutral-800">
                    <Globe className="h-4 w-4 text-teal-600" />
                    Social Media
                  </span>
                  <input
                    type="checkbox"
                    checked={data.footer_show_socials}
                    onChange={(e) => setData('footer_show_socials', e.target.checked)}
                    className="h-4 w-4 rounded border-neutral-300 text-teal-600 focus:ring-teal-500"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* 5. Media Sosial & Tautan Bawah */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <Globe className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Social Media &amp; Legal Page Links
                </h2>
                <p className="text-sm text-neutral-500">
                  Additional social media links and Privacy Policy / Terms &amp; Conditions pages
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-700">
                  <Youtube className="h-4 w-4 text-red-600" />
                  YouTube Channel URL (Optional)
                </label>
                <input
                  type="url"
                  value={data.youtube_url}
                  onChange={(e) => setData('youtube_url', e.target.value)}
                  placeholder="https://youtube.com/@ronica"
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-700">
                  <ShieldCheck className="h-4 w-4 text-teal-600" />
                  Privacy Policy URL
                </label>
                <input
                  type="text"
                  value={data.footer_privacy_url}
                  onChange={(e) => setData('footer_privacy_url', e.target.value)}
                  placeholder="/shop/privacy-policy"
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-700">
                  <ShieldCheck className="h-4 w-4 text-teal-600" />
                  Terms &amp; Conditions URL
                </label>
                <input
                  type="text"
                  value={data.footer_terms_url}
                  onChange={(e) => setData('footer_terms_url', e.target.value)}
                  placeholder="/shop/terms"
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
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
    </AdminLayout>
  );
}
