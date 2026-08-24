import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  Clock,
  CreditCard,
  ExternalLink,
  Info,
  Landmark,
  MessageCircle,
  Save,
} from 'lucide-react';

interface PaymentSettingsProps {
  settings: {
    midtrans_enabled: boolean;
    midtrans_environment: string;
    whatsapp_payment_enabled: boolean;
    whatsapp_payment_message: string;
    bank_name: string;
    bank_account_number: string;
    bank_account_name: string;
    cod_fee: number;
    payment_deadline_hours: number;
  };
  midtransConfigured: boolean;
  whatsappNumber: string | null;
}

export default function PaymentSettings({
  settings,
  midtransConfigured,
  whatsappNumber,
}: PaymentSettingsProps) {
  const { data, setData, post, processing } = useForm({
    midtrans_enabled: settings.midtrans_enabled ?? true,
    midtrans_environment: settings.midtrans_environment ?? 'sandbox',
    whatsapp_payment_enabled: settings.whatsapp_payment_enabled ?? true,
    whatsapp_payment_message:
      settings.whatsapp_payment_message ??
      'Halo, saya ingin melakukan pemesanan:',
    bank_name: settings.bank_name ?? 'BCA',
    bank_account_number: settings.bank_account_number ?? '',
    bank_account_name: settings.bank_account_name ?? '',
    cod_fee: settings.cod_fee ?? 5000,
    payment_deadline_hours: settings.payment_deadline_hours ?? 24,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/settings/payment');
  };

  return (
    <AdminLayout
      breadcrumbs={[
        { title: 'Pengaturan', href: '/admin/settings' },
        { title: 'Pembayaran', href: '/admin/settings/payment' },
      ]}
    >
      <Head title="Pengaturan Pembayaran" />

      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/admin/settings"
            className="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">
              Pengaturan Pembayaran
            </h1>
            <p className="mt-1 text-neutral-500">
              Kelola metode pembayaran yang tersedia
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Midtrans Settings */}
          <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
            <div className="border-b border-neutral-100 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-900">
                      Midtrans Payment Gateway
                    </h2>
                    <p className="text-sm text-neutral-500">
                      Pembayaran online otomatis
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={data.midtrans_enabled}
                    onChange={(e) =>
                      setData('midtrans_enabled', e.target.checked)
                    }
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-neutral-300 peer-checked:bg-teal-600 peer-focus:ring-4 peer-focus:ring-teal-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
                </label>
              </div>
            </div>

            <div className="p-6">
              {/* Status */}
              <div
                className={`mb-6 flex items-start gap-3 rounded-lg p-4 ${midtransConfigured ? 'bg-green-50' : 'bg-amber-50'
                  }`}
              >
                {midtransConfigured ? (
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-600" />
                )}
                <div>
                  <p
                    className={`text-sm font-medium ${midtransConfigured ? 'text-green-900' : 'text-amber-900'}`}
                  >
                    {midtransConfigured
                      ? 'API Keys Terkonfigurasi'
                      : 'Konfigurasi Diperlukan'}
                  </p>
                  <p
                    className={`text-xs ${midtransConfigured ? 'text-green-700' : 'text-amber-700'}`}
                  >
                    {midtransConfigured
                      ? 'Midtrans siap digunakan'
                      : 'Tambahkan MIDTRANS_SERVER_KEY & MIDTRANS_CLIENT_KEY di .env'}
                  </p>
                </div>
              </div>

              {/* Environment */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Environment
                </label>
                <select
                  value={data.midtrans_environment}
                  onChange={(e) =>
                    setData('midtrans_environment', e.target.value)
                  }
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                >
                  <option value="sandbox">Sandbox (Testing)</option>
                  <option value="production">Production (Live)</option>
                </select>
              </div>

              {/* Supported Methods */}
              <div>
                <p className="mb-3 text-sm font-medium text-neutral-700">
                  Metode Pembayaran
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'GoPay',
                    'QRIS',
                    'Bank Transfer',
                    'Credit Card',
                    'ShopeePay',
                  ].map((method) => (
                    <span
                      key={method}
                      className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp Payment */}
          <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
            <div className="border-b border-neutral-100 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-900">
                      Pembayaran via WhatsApp
                    </h2>
                    <p className="text-sm text-neutral-500">
                      Hubungi admin untuk pembayaran manual
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={data.whatsapp_payment_enabled}
                    onChange={(e) =>
                      setData('whatsapp_payment_enabled', e.target.checked)
                    }
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-neutral-300 peer-checked:bg-teal-600 peer-focus:ring-4 peer-focus:ring-teal-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
                </label>
              </div>
            </div>

            <div className="p-6">
              {/* WhatsApp Number Status */}
              {whatsappNumber ? (
                <div className="mb-6 flex items-start gap-3 rounded-lg bg-green-50 p-4">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      WhatsApp Terkonfigurasi
                    </p>
                    <p className="text-xs text-green-700">
                      Nomor: {whatsappNumber}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mb-6 flex items-start gap-3 rounded-lg bg-amber-50 p-4">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-600" />
                  <div>
                    <p className="text-sm font-medium text-amber-900">
                      Nomor WhatsApp Belum Diatur
                    </p>
                    <p className="text-xs text-amber-700">
                      Atur di{' '}
                      <Link href="/admin/settings" className="underline">
                        Pengaturan Umum
                      </Link>
                    </p>
                  </div>
                </div>
              )}

              {/* Custom Message */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Pesan Awal (Template)
                </label>
                <textarea
                  value={data.whatsapp_payment_message}
                  onChange={(e) =>
                    setData('whatsapp_payment_message', e.target.value)
                  }
                  rows={3}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  placeholder="Halo, saya ingin melakukan pemesanan:"
                />
                <p className="mt-2 text-xs text-neutral-500">
                  Pesan ini akan muncul di awal chat WhatsApp saat pelanggan
                  memilih pembayaran via WhatsApp
                </p>
              </div>
            </div>
          </div>

          {/* Bank Transfer Settings */}
          <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
            <div className="border-b border-neutral-100 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                  <Landmark className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Transfer Bank
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Informasi rekening untuk pembayaran manual
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Nama Bank
                </label>
                <input
                  type="text"
                  value={data.bank_name}
                  onChange={(e) => setData('bank_name', e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  placeholder="BCA"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Nomor Rekening
                </label>
                <input
                  type="text"
                  value={data.bank_account_number}
                  onChange={(e) =>
                    setData('bank_account_number', e.target.value)
                  }
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  placeholder="1234567890"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Nama Pemilik Rekening
                </label>
                <input
                  type="text"
                  value={data.bank_account_name}
                  onChange={(e) =>
                    setData('bank_account_name', e.target.value)
                  }
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  placeholder="PT Ronica Indonesia"
                />
                <p className="mt-2 text-xs text-neutral-500">
                  Informasi ini ditampilkan kepada pelanggan di halaman detail
                  pesanan
                </p>
              </div>
            </div>
          </div>

          {/* General Payment Settings */}
          <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
            <div className="border-b border-neutral-100 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Pengaturan Umum Pembayaran
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Biaya tambahan dan batas waktu pembayaran
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Biaya COD (Rp)
                </label>
                <div className="relative">
                  <span className="absolute top-1/2 left-4 -translate-y-1/2 text-neutral-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={data.cod_fee}
                    onChange={(e) =>
                      setData('cod_fee', parseInt(e.target.value) || 0)
                    }
                    min={0}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-3 pr-4 pl-12 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                    placeholder="5000"
                  />
                </div>
                <p className="mt-2 text-xs text-neutral-500">
                  Biaya tambahan untuk pembayaran Cash on Delivery (0 untuk
                  gratis)
                </p>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Batas Waktu Pembayaran (Jam)
                </label>
                <input
                  type="number"
                  value={data.payment_deadline_hours}
                  onChange={(e) =>
                    setData(
                      'payment_deadline_hours',
                      parseInt(e.target.value) || 1,
                    )
                  }
                  min={1}
                  max={168}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  placeholder="24"
                />
                <p className="mt-2 text-xs text-neutral-500">
                  Pesanan akan otomatis dibatalkan jika belum dibayar dalam waktu
                  ini (1-168 jam)
                </p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <Info className="h-5 w-5 flex-shrink-0 text-blue-600" />
            <div className="text-sm text-blue-700">
              <p className="font-medium text-blue-900">Cara Kerja</p>
              <ul className="mt-1 list-inside list-disc space-y-1">
                <li>
                  <strong>Midtrans:</strong> Pembayaran otomatis, status pesanan
                  diupdate secara realtime
                </li>
                <li>
                  <strong>WhatsApp:</strong> Pelanggan menghubungi admin,
                  pembayaran manual (transfer/COD)
                </li>
              </ul>
            </div>
          </div>

          {/* Documentation Link */}
          <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4">
            <div>
              <p className="font-medium text-neutral-900">
                Dokumentasi Midtrans
              </p>
              <p className="text-sm text-neutral-500">
                Pelajari integrasi payment gateway
              </p>
            </div>
            <a
              href="https://docs.midtrans.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
            >
              <ExternalLink className="h-4 w-4" />
              Buka
            </a>
          </div>

          {/* Sticky Submit Bar */}
          <div className="sticky bottom-6 z-30 flex items-center justify-between rounded-2xl border border-neutral-200/80 bg-white/90 px-6 py-4 shadow-xl backdrop-blur-md">
            <span className="hidden text-xs font-medium text-neutral-500 sm:inline">
              Pastikan perubahan sudah sesuai sebelum menyimpan
            </span>
            <button
              type="submit"
              disabled={processing}
              className="ml-auto inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 font-medium text-white shadow-md transition-all hover:bg-teal-700 active:scale-[0.98] disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              {processing ? 'Menyimpan...' : 'Simpan Pengaturan Pembayaran'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
