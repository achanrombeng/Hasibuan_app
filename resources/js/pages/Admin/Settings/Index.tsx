import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, router, useForm } from '@inertiajs/react';
import {
  BookOpen,
  Building2,
  Facebook,
  FileText,
  Globe,
  Instagram,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Save,
  Store,
  Trash2,
  Upload,
} from 'lucide-react';
import React, { useState } from 'react';

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
    catalog_pdf_url?: string;
    catalog_docx_url?: string;
    catalog_title?: string;
  };
}

export default function SettingsIndex({ settings }: SettingsIndexProps) {
  const { data, setData, post, processing } = useForm({
    ...settings,
    catalog_title: settings.catalog_title || 'Ronica Product Catalogue 2026',
    catalog_pdf_file: null as File | null,
    catalog_docx_file: null as File | null,
    delete_catalog_pdf: false,
    delete_catalog_docx: false,
  });

  const [deletingType, setDeletingType] = useState<string | null>(null);

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
    post('/admin/settings', {
      forceFormData: true,
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

          {/* Social Media */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <Globe className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Social Media
                </h2>
                <p className="text-sm text-neutral-500">
                  Links to store social media accounts
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
    </AdminLayout>
  );
}
