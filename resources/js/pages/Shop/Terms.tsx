import { SEOHead } from '@/components/seo';
import { ShopLayout } from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { usePage } from '@inertiajs/react';
import {
  AlertTriangle,
  Ban,
  Clock,
  CreditCard,
  FileText,
  Package,
  RefreshCw,
  Scale,
  Shield,
  Truck,
} from 'lucide-react';

const SECTIONS = [
  {
    icon: FileText,
    title: 'Ketentuan Umum',
    content: `Dengan mengakses dan menggunakan website ini, Anda menyetujui untuk terikat dengan syarat dan ketentuan ini. Jika Anda tidak setuju dengan ketentuan ini, mohon untuk tidak menggunakan layanan kami.`,
  },
  {
    icon: CreditCard,
    title: 'Pemesanan & Pembayaran',
    items: [
      'Harga produk dapat berubah sewaktu-waktu tanpa pemberitahuan terlebih dahulu',
      'Pesanan dianggap sah setelah pembayaran dikonfirmasi',
      'Pembayaran harus dilakukan dalam waktu 24 jam setelah pemesanan untuk Transfer Bank',
      'Kami berhak membatalkan pesanan jika pembayaran tidak diterima dalam waktu yang ditentukan',
    ],
  },
  {
    icon: Truck,
    title: 'Pengiriman',
    items: [
      'Waktu pengiriman adalah estimasi dan dapat berbeda tergantung kondisi',
      'Pembeli bertanggung jawab memastikan alamat pengiriman yang benar',
      'Kerusakan akibat pengiriman harus dilaporkan dalam 24 jam setelah penerimaan',
      'Biaya pengiriman ulang akibat alamat salah ditanggung pembeli',
    ],
  },
  {
    icon: Shield,
    title: 'Garansi Produk',
    content:
      'Semua produk kami bergaransi 1 tahun untuk kerusakan struktural akibat cacat produksi.',
    excludes: [
      'Kerusakan akibat pemakaian tidak wajar',
      'Kerusakan akibat modifikasi oleh pihak ketiga',
      'Perubahan warna alami pada material kayu',
      'Keausan normal akibat pemakaian sehari-hari',
    ],
  },
  {
    icon: RefreshCw,
    title: 'Pembatalan & Pengembalian',
    items: [
      'Pembatalan dapat dilakukan sebelum pesanan diproses dengan potongan 10% biaya admin',
      'Custom order tidak dapat dibatalkan setelah produksi dimulai',
      'Pengembalian produk harus dalam kondisi asli dan kemasan lengkap',
      'Refund akan diproses dalam 7-14 hari kerja setelah produk diterima kembali',
    ],
  },
  {
    icon: Ban,
    title: 'Hak Kekayaan Intelektual',
    content: `Seluruh konten di website ini termasuk gambar, desain, logo, dan teks adalah milik kami dan dilindungi hak cipta. Dilarang menyalin atau menggunakan tanpa izin tertulis.`,
  },
  {
    icon: Clock,
    title: 'Perubahan Ketentuan',
    content: `Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan berlaku segera setelah dipublikasikan di website. Penggunaan berkelanjutan atas layanan kami dianggap sebagai persetujuan atas perubahan tersebut.`,
  },
];

export default function Terms() {
  const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
  const siteName = siteSettings?.site_name || 'Ronica';

  return (
    <>
      <SEOHead
        title="Syarat & Ketentuan"
        description={`Syarat dan ketentuan penggunaan layanan ${siteName}. Ketahui hak dan kewajiban Anda sebagai pelanggan.`}
        keywords={[
          'syarat ketentuan',
          'terms conditions',
          'kebijakan pembelian',
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
                <Scale size={40} className="text-white" />
              </div>
              <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
                Syarat & Ketentuan
              </h1>
              <p className="mx-auto max-w-2xl text-lg opacity-90">
                Ketentuan yang berlaku untuk penggunaan layanan {siteName}
              </p>
              <p className="mt-4 text-sm opacity-70">
                Terakhir diperbarui: Januari 2026
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="mx-auto max-w-[1000px] px-6 py-16 md:px-12">
            {/* Intro Alert */}
            <div className="mb-12 flex items-start gap-4 rounded-lg border border-amber-200 bg-amber-50 p-6">
              <AlertTriangle className="h-6 w-6 flex-shrink-0 text-amber-600" />
              <div>
                <p className="font-medium text-amber-900">
                  Penting untuk dibaca
                </p>
                <p className="mt-1 text-sm text-amber-700">
                  Dengan melakukan pembelian di {siteName}, Anda dianggap telah
                  membaca dan menyetujui seluruh syarat dan ketentuan berikut.
                </p>
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
                    <p className="leading-relaxed text-neutral-600">
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

                  {section.excludes && (
                    <div className="mt-4">
                      <p className="mb-3 text-sm font-medium text-neutral-500">
                        Garansi tidak berlaku untuk:
                      </p>
                      <ul className="space-y-2">
                        {section.excludes.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
                            <span className="text-sm text-neutral-500">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-12 rounded-xl bg-neutral-50 p-8 text-center">
              <Package className="mx-auto mb-4 h-12 w-12 text-teal-600" />
              <h3 className="mb-2 text-xl font-semibold text-neutral-900">
                Ada Pertanyaan?
              </h3>
              <p className="mb-6 text-neutral-600">
                Tim customer service kami siap membantu Anda
              </p>
              <a
                href="/shop/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 font-medium text-white transition-colors hover:bg-teal-700"
              >
                Hubungi Kami
              </a>
            </div>
          </div>
        </main>
      </ShopLayout>
    </>
  );
}
