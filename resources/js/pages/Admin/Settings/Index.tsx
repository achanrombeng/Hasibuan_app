import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, useForm } from '@inertiajs/react';
import {
  Building2,
  Facebook,
  Globe,
  Instagram,
  Mail,
  MessageCircle,
  Phone,
  Save,
  Store,
} from 'lucide-react';

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
  };
}

export default function SettingsIndex({ settings }: SettingsIndexProps) {
  const { data, setData, post, processing } = useForm(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/settings');
  };

  return (
    <AdminLayout
      breadcrumbs={[{ title: 'Pengaturan', href: '/admin/settings' }]}
    >
      <Head title="Pengaturan Situs" />

      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Pengaturan Situs
          </h1>
          <p className="mt-1 text-neutral-500">
            Kelola pengaturan umum toko Anda
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
                  Informasi Toko
                </h2>
                <p className="text-sm text-neutral-500">
                  Nama dan deskripsi toko Anda
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Nama Toko
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
                  Deskripsi Toko
                </label>
                <textarea
                  value={data.site_description}
                  onChange={(e) => setData('site_description', e.target.value)}
                  rows={3}
                  placeholder="Toko furniture premium dengan kualitas terbaik..."
                  className="w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
                <p className="mt-2 text-xs text-neutral-500">
                  Digunakan untuk SEO dan meta description
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
                  Informasi Kontak
                </h2>
                <p className="text-sm text-neutral-500">
                  Cara pelanggan menghubungi Anda
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
                  Email 2 (Opsional)
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
                  Telepon
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
                  WhatsApp
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
                  Tanpa tanda + (contoh: 6281234567890)
                </p>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Alamat Pabrik
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
                  Alamat Showroom
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
                  Google Maps Embed URL Showroom
                </label>
                <input
                  type="text"
                  value={data.maps_showroom_url ?? ''}
                  onChange={(e) => setData('maps_showroom_url', e.target.value)}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
                <p className="mt-1 text-xs text-neutral-500">
                  URL embed iframe dari Google Maps untuk lokasi Showroom
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Google Maps Embed URL Pabrik (Opsional)
                </label>
                <input
                  type="text"
                  value={data.maps_factory_url ?? ''}
                  onChange={(e) => setData('maps_factory_url', e.target.value)}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
                <p className="mt-1 text-xs text-neutral-500">
                  URL embed iframe dari Google Maps untuk lokasi Pabrik
                </p>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <Globe className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Media Sosial
                </h2>
                <p className="text-sm text-neutral-500">
                  Link ke akun sosial media toko
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-700">
                  <Facebook className="h-4 w-4 text-blue-600" />
                  Facebook
                </label>
                <input
                  type="url"
                  value={data.facebook_url}
                  onChange={(e) => setData('facebook_url', e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-700">
                  <Instagram className="h-4 w-4 text-pink-600" />
                  Instagram
                </label>
                <input
                  type="url"
                  value={data.instagram_url}
                  onChange={(e) => setData('instagram_url', e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-700">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                  </svg>
                  TikTok
                </label>
                <input
                  type="url"
                  value={data.tiktok_url}
                  onChange={(e) => setData('tiktok_url', e.target.value)}
                  placeholder="https://tiktok.com/..."
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Sticky Submit Bar */}
          <div className="sticky bottom-6 z-30 flex items-center justify-between rounded-2xl border border-neutral-200/80 bg-white/90 px-6 py-4 shadow-xl backdrop-blur-md">
            <span className="hidden text-xs font-medium text-neutral-500 sm:inline">
              Pastikan perubahan sudah sesuai sebelum menyimpan
            </span>
            <button
              type="submit"
              disabled={processing}
              className="ml-auto inline-flex items-center gap-2 rounded-xl bg-[#a67c52] px-6 py-3 font-medium text-white shadow-md transition-all hover:bg-[#8e6843] active:scale-[0.98] disabled:opacity-50"
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
