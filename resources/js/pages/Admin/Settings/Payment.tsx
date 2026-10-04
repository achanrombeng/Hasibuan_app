import { ConfirmDialog } from '@/components/ui/alert-dialog';
import { useTranslation } from '@/hooks/use-translation';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  ExternalLink,
  Info,
  Landmark,
  MessageCircle,
  Save,
} from 'lucide-react';
import { useState } from 'react';

interface Props {
  settings: {
    midtrans_enabled: boolean;
    midtrans_environment: string;
    midtrans_server_key: string;
    midtrans_client_key: string;
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
}: Props) {
  const { t } = useTranslation();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    midtrans_enabled: settings.midtrans_enabled,
    midtrans_environment: settings.midtrans_environment,
    whatsapp_payment_enabled: settings.whatsapp_payment_enabled,
    whatsapp_payment_message: settings.whatsapp_payment_message,
    bank_name: settings.bank_name,
    bank_account_number: settings.bank_account_number,
    bank_account_name: settings.bank_account_name,
    cod_fee: settings.cod_fee,
    payment_deadline_hours: settings.payment_deadline_hours,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const confirmSavePayment = () => {
    post('/admin/settings/payment', {
      preserveScroll: true,
      onSuccess: () => {
        setShowConfirmDialog(false);
      },
    });
  };

  return (
    <AdminLayout
      breadcrumbs={[
        { title: 'Settings', href: '/admin/settings' },
        { title: 'Payment', href: '/admin/settings/payment' },
      ]}
    >
      <Head title="Payment Settings" />

      <div className="w-full space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Payment Settings
          </h1>
          <p className="mt-1 text-neutral-500">
            Manage active payment methods and gateway configurations
          </p>
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
                      Automated online payment gateway
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
                className={`mb-6 flex items-start gap-3 rounded-lg p-4 ${
                  midtransConfigured ? 'bg-green-50' : 'bg-amber-50'
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
                      ? 'API Keys Configured'
                      : 'Configuration Required'}
                  </p>
                  <p
                    className={`text-xs ${midtransConfigured ? 'text-green-700' : 'text-amber-700'}`}
                  >
                    {midtransConfigured
                      ? 'Midtrans is ready to process transactions'
                      : 'Add MIDTRANS_SERVER_KEY & MIDTRANS_CLIENT_KEY in .env'}
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
                  Payment Channels
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
                      WhatsApp Orders & Inquiries
                    </h2>
                    <p className="text-sm text-neutral-500">
                      Direct client communication for orders and manual settlement
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
                      WhatsApp Configured
                    </p>
                    <p className="text-xs text-green-700">
                      Phone Number: {whatsappNumber}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mb-6 flex items-start gap-3 rounded-lg bg-amber-50 p-4">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-600" />
                  <div>
                    <p className="text-sm font-medium text-amber-900">
                      WhatsApp Number Not Set
                    </p>
                    <p className="text-xs text-amber-700">
                      Configure in{' '}
                      <Link href="/admin/settings" className="underline">
                        General Settings
                      </Link>
                    </p>
                  </div>
                </div>
              )}

              {/* Custom Message */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Initial Greeting Template
                </label>
                <textarea
                  value={data.whatsapp_payment_message}
                  onChange={(e) =>
                    setData('whatsapp_payment_message', e.target.value)
                  }
                  rows={3}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  placeholder="Hello, I would like to place an order:"
                />
                <p className="mt-2 text-xs text-neutral-500">
                  This greeting pre-populates in WhatsApp when clients initiate contact
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
                    Bank Wire Transfer
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Bank account details for manual remittances
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={data.bank_name}
                  onChange={(e) => setData('bank_name', e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  placeholder="BCA / Mandiri / International Bank"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Account Number / IBAN
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
                  Beneficiary Name
                </label>
                <input
                  type="text"
                  value={data.bank_account_name}
                  onChange={(e) => setData('bank_account_name', e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  placeholder="PT Ronica Indonesia"
                />
                <p className="mt-2 text-xs text-neutral-500">
                  Displayed to clients during order confirmation and invoice generation
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
                    General Payment Settings
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Surcharges and expiration parameters
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Cash on Delivery Surcharge (Rp)
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
                  Additional surcharge for COD handling (0 for free)
                </p>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Payment Expiration Window (Hours)
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
                  Orders will automatically be cancelled if payment is not received within this window (1-168 hours)
                </p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <Info className="h-5 w-5 flex-shrink-0 text-blue-600" />
            <div className="text-sm text-blue-700">
              <p className="font-medium text-blue-900">How It Works</p>
              <ul className="mt-1 list-inside list-disc space-y-1">
                <li>
                  <strong>Midtrans:</strong> Automated online settlement with real-time webhook updates
                </li>
                <li>
                  <strong>WhatsApp:</strong> Direct contact with sales reps for custom quotations, B2B procurement, or manual remittance
                </li>
              </ul>
            </div>
          </div>

          {/* Documentation Link */}
          <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4">
            <div>
              <p className="font-medium text-neutral-900">
                Midtrans Documentation
              </p>
              <p className="text-sm text-neutral-500">
                Learn more about payment gateway integration
              </p>
            </div>
            <a
              href="https://docs.midtrans.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
            >
              <ExternalLink className="h-4 w-4" />
              Open
            </a>
          </div>

          {/* Sticky Submit Bar */}
          <div className="sticky bottom-6 z-30 flex items-center justify-between rounded-2xl border border-neutral-200/80 bg-white/90 px-6 py-4 shadow-xl backdrop-blur-md">
            <span className="hidden text-xs font-medium text-neutral-500 sm:inline">
              Ensure configurations are verified before saving
            </span>
            <button
              type="submit"
              disabled={processing}
              className="ml-auto inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 font-medium text-white shadow-md transition-all hover:bg-teal-700 active:scale-[0.98] disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              {processing ? 'Saving...' : 'Save Payment Settings'}
            </button>
          </div>
        </form>
      </div>

      {/* Confirm Save Payment Settings Dialog */}
      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title={t('admin.settings.confirm_save_title')}
        description={t('admin.settings.confirm_save_desc')}
        confirmText={t('admin.settings.confirm_save_button')}
        cancelText={t('common.cancel')}
        variant="default"
        isLoading={processing}
        onConfirm={confirmSavePayment}
      />
    </AdminLayout>
  );
}
