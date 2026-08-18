import { SEOHead } from '@/components/seo';
import { ShopLayout } from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { usePage } from '@inertiajs/react';
import {
  Database,
  Eye,
  FileCheck,
  Lock,
  Mail,
  MessageCircle,
  Share2,
  Shield,
  User,
  UserCheck,
} from 'lucide-react';

const SECTIONS = [
  {
    icon: Database,
    title: 'Informasi yang Kami Kumpulkan',
    content: 'Kami mengumpulkan informasi yang Anda berikan secara langsung:',
    items: [
      'Nama lengkap dan informasi kontak (email, nomor telepon)',
      'Alamat pengiriman dan penagihan',
      'Informasi pembayaran (diproses secara aman melalui payment gateway)',
      'Riwayat pesanan dan preferensi produk',
    ],
  },
  {
    icon: Eye,
    title: 'Penggunaan Informasi',
    content: 'Informasi Anda digunakan untuk:',
    items: [
      'Memproses dan mengirimkan pesanan Anda',
      'Berkomunikasi mengenai pesanan dan layanan',
      'Mengirimkan informasi promosi (dengan persetujuan Anda)',
      'Meningkatkan layanan dan pengalaman berbelanja',
    ],
  },
  {
    icon: Lock,
    title: 'Keamanan Data',
    content: `Kami menerapkan langkah-langkah keamanan teknis dan organisasional untuk melindungi data pribadi Anda dari akses tidak sah, perubahan, pengungkapan, atau penghancuran. Data sensitif dienkripsi menggunakan teknologi SSL/TLS terbaru.`,
    highlights: [
      { icon: Shield, text: 'Enkripsi SSL 256-bit' },
      { icon: Lock, text: 'Data tersimpan aman' },
      { icon: FileCheck, text: 'Audit keamanan berkala' },
    ],
  },
  {
    icon: Share2,
    title: 'Berbagi Informasi',
    content: `Kami tidak menjual data pribadi Anda kepada pihak manapun. Informasi hanya dibagikan kepada pihak ketiga yang diperlukan untuk memproses pesanan (jasa pengiriman, payment gateway) dengan standar keamanan yang ketat dan perjanjian kerahasiaan.`,
  },
  {
    icon: UserCheck,
    title: 'Hak Anda',
    content: 'Anda memiliki hak penuh atas data pribadi Anda:',
    items: [
      'Mengakses dan memperbarui informasi pribadi Anda',
      'Meminta penghapusan data Anda (right to be forgotten)',
      'Berhenti berlangganan dari komunikasi pemasaran',
      'Mengajukan keluhan terkait privasi data',
    ],
  },
];

export default function PrivacyPolicy() {
  const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
  const siteName = siteSettings?.site_name || 'Ronica';

  return (
    <>
      <SEOHead
        title="Kebijakan Privasi"
        description={`Kebijakan privasi ${siteName}. Ketahui bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.`}
        keywords={[
          'kebijakan privasi',
          'privacy policy',
          'perlindungan data',
          siteName.toLowerCase(),
        ]}
      />
      <div className="bg-noise" />
      <ShopLayout>
        <main className="min-h-screen bg-white pb-20">
          {/* Hero */}
          <div className="bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 py-20 text-white">
            <div className="mx-auto max-w-[1200px] px-6 text-center md:px-12">
              <div className="mb-6 inline-flex items-center justify-center rounded-full bg-white/10 p-4">
                <Shield size={40} className="text-white" />
              </div>
              <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
                Kebijakan Privasi
              </h1>
              <p className="mx-auto max-w-2xl text-lg opacity-90">
                Komitmen kami dalam melindungi privasi dan data pribadi Anda
              </p>
              <p className="mt-4 text-sm opacity-70">
                Terakhir diperbarui: Januari 2026
              </p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="border-b border-neutral-100 bg-neutral-50 py-8">
            <div className="mx-auto flex max-w-[1000px] flex-wrap items-center justify-center gap-8 px-6">
              <div className="flex items-center gap-2 text-neutral-600">
                <Lock className="h-5 w-5 text-teal-600" />
                <span className="text-sm font-medium">Data Terenkripsi</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600">
                <Shield className="h-5 w-5 text-teal-600" />
                <span className="text-sm font-medium">Privasi Terjamin</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600">
                <UserCheck className="h-5 w-5 text-teal-600" />
                <span className="text-sm font-medium">Kendali Penuh</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mx-auto max-w-[1000px] px-6 py-16 md:px-12">
            {/* Intro */}
            <div className="mb-12 rounded-xl border border-teal-100 bg-teal-50/50 p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-teal-100">
                  <User className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h2 className="mb-2 text-lg font-semibold text-teal-900">
                    Privasi Anda adalah Prioritas Kami
                  </h2>
                  <p className="text-teal-700">
                    Di {siteName}, kami berkomitmen untuk melindungi privasi
                    setiap pelanggan. Kebijakan ini menjelaskan bagaimana kami
                    mengumpulkan, menggunakan, dan menjaga keamanan informasi
                    pribadi Anda.
                  </p>
                </div>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-8">
              {SECTIONS.map((section, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-neutral-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md md:p-8"
                >
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50">
                      <section.icon className="h-6 w-6 text-teal-600" />
                    </div>
                    <h2 className="font-serif text-xl font-semibold text-neutral-900 md:text-2xl">
                      {index + 1}. {section.title}
                    </h2>
                  </div>

                  {section.content && (
                    <p className="mb-4 leading-relaxed text-neutral-600">
                      {section.content}
                    </p>
                  )}

                  {section.items && (
                    <ul className="space-y-3">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-500" />
                          <span className="text-neutral-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.highlights && (
                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                      {section.highlights.map((highlight, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 rounded-lg bg-neutral-50 p-4"
                        >
                          <highlight.icon className="h-5 w-5 text-teal-600" />
                          <span className="text-sm font-medium text-neutral-700">
                            {highlight.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Contact Section */}
            <div className="mt-12 rounded-xl bg-gradient-to-br from-teal-600 to-teal-700 p-8 text-white md:p-10">
              <div className="text-center">
                <Mail className="mx-auto mb-4 h-12 w-12 opacity-90" />
                <h3 className="mb-2 text-2xl font-semibold">Hubungi Kami</h3>
                <p className="mx-auto mb-6 max-w-md opacity-90">
                  Jika Anda memiliki pertanyaan tentang kebijakan privasi ini,
                  jangan ragu untuk menghubungi kami
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  {siteSettings?.contact_email && (
                    <a
                      href={`mailto:${siteSettings.contact_email}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-medium text-teal-700 transition-colors hover:bg-teal-50"
                    >
                      <Mail className="h-5 w-5" />
                      Email
                    </a>
                  )}
                  {siteSettings?.contact_whatsapp && (
                    <a
                      href={`https://wa.me/${siteSettings.contact_whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 bg-white/10 px-6 py-3 font-medium text-white transition-colors hover:bg-white/20"
                    >
                      <MessageCircle className="h-5 w-5" />
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </ShopLayout>
    </>
  );
}
