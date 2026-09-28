import { ConfirmDialog } from '@/components/ui/alert-dialog';
import { useTranslation } from '@/hooks/use-translation';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
  ArrowLeft,
  ChevronDown,
  Gift,
  Percent,
  Save,
  Truck,
} from 'lucide-react';
import { useState } from 'react';

const iconOptions = [
  { value: 'percent', label: 'Discount', icon: Percent },
  { value: 'gift', label: 'Gift', icon: Gift },
  { value: 'truck', label: 'Shipping', icon: Truck },
];

const displayTypeOptions = [
  { value: 'banner', label: 'Banner (Header)' },
  { value: 'popup', label: 'Popup (Modal)' },
  { value: 'both', label: 'Both' },
];

const gradientOptions = [
  {
    value: 'from-teal-700 to-teal-900',
    label: 'Teal',
    preview: 'bg-gradient-to-r from-teal-700 to-teal-900',
  },
  {
    value: 'from-amber-500 to-orange-600',
    label: 'Amber',
    preview: 'bg-gradient-to-r from-amber-500 to-orange-600',
  },
  {
    value: 'from-rose-500 to-pink-600',
    label: 'Rose',
    preview: 'bg-gradient-to-r from-rose-500 to-pink-600',
  },
  {
    value: 'from-violet-600 to-purple-700',
    label: 'Violet',
    preview: 'bg-gradient-to-r from-violet-600 to-purple-700',
  },
  {
    value: 'from-blue-600 to-indigo-700',
    label: 'Blue',
    preview: 'bg-gradient-to-r from-blue-600 to-indigo-700',
  },
  {
    value: 'from-emerald-600 to-green-700',
    label: 'Emerald',
    preview: 'bg-gradient-to-r from-emerald-600 to-green-700',
  },
];

export default function CreatePromoBanner() {
  const { data, setData, processing, errors } = useForm<{
    title: string;
    description: string;
    cta_text: string;
    cta_link: string;
    icon: string;
    bg_gradient: string;
    display_type: string;
    is_active: boolean;
    priority: number;
    starts_at: string;
    ends_at: string;
  }>({
    title: '',
    description: '',
    cta_text: 'View Now',
    cta_link: '/shop/products',
    icon: 'percent',
    bg_gradient: 'from-teal-700 to-teal-900',
    display_type: 'banner',
    is_active: true,
    priority: 0,
    starts_at: '',
    ends_at: '',
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const confirmSavePromo = () => {
    router.post('/admin/promo-banners', data, {
      onError: (errors) => {
        setShowConfirmDialog(false);
        console.error('Form errors:', errors);
      },
    });
  };

  const SelectedIcon =
    iconOptions.find((i) => i.value === data.icon)?.icon || Percent;

  return (
    <AdminLayout
      breadcrumbs={[
        { title: 'Promo Banners', href: '/admin/promo-banners' },
        { title: 'Add Promo', href: '/admin/promo-banners/create' },
      ]}
    >
      <Head title="Add Promo Banner" />

      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/admin/promo-banners"
            className="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">
              Add Promo Banner
            </h1>
            <p className="mt-1 text-neutral-500">
              Create a new promo banner or popup
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Preview */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">
              Preview
            </h2>
            <div
              className={`flex flex-wrap items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-3 py-3 text-white sm:gap-3 sm:px-4 ${data.bg_gradient}`}
            >
              <SelectedIcon size={18} className="flex-shrink-0" />
              <span className="font-medium">{data.title || 'Promo Title'}</span>
              {data.description && (
                <span className="hidden opacity-90 sm:inline">
                  - {data.description}
                </span>
              )}
              <span className="rounded-full bg-white/20 px-3 py-1 text-sm">
                {data.cta_text || 'View Now'}
              </span>
            </div>
          </div>

          {/* Main Form */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Promo Title *
                </label>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  placeholder="e.g. Flash Sale! 🔥"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Description
                </label>
                <input
                  type="text"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  placeholder="e.g. Up to 70% off selected items"
                />
              </div>

              {/* CTA Text & Link */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={data.cta_text}
                    onChange={(e) => setData('cta_text', e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                    placeholder="View Now"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    Target URL
                  </label>
                  <input
                    type="text"
                    value={data.cta_link}
                    onChange={(e) => setData('cta_link', e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                    placeholder="/shop/products"
                  />
                </div>
              </div>

              {/* Icon Selection */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Icon
                </label>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {iconOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setData('icon', option.value)}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 transition-all sm:px-4 sm:py-3 ${
                          data.icon === option.value
                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                            : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-sm font-medium">
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Gradient Selection */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Gradient Color
                </label>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                  {gradientOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setData('bg_gradient', option.value)}
                      className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-all ${
                        data.bg_gradient === option.value
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-neutral-200 bg-white hover:border-neutral-300'
                      }`}
                    >
                      <div
                        className={`h-8 w-full rounded-lg ${option.preview}`}
                      />
                      <span className="text-xs font-medium text-neutral-600">
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Display Type
                </label>
                <div className="relative">
                  <select
                    value={data.display_type}
                    onChange={(e) => setData('display_type', e.target.value)}
                    className="w-full appearance-none rounded-xl border border-neutral-200 bg-neutral-50 py-3 pr-10 pl-4 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  >
                    {displayTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <ChevronDown className="h-5 w-5 text-neutral-400" />
                  </div>
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Priority
                </label>
                <p className="mb-2 text-sm text-neutral-500">
                  Promos with higher priority will be displayed first
                </p>
                <input
                  type="number"
                  value={data.priority}
                  onChange={(e) =>
                    setData('priority', parseInt(e.target.value) || 0)
                  }
                  min={0}
                  max={100}
                  className="w-32 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
              </div>

              {/* Date Range */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    value={data.starts_at}
                    onChange={(e) => setData('starts_at', e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  />
                  <p className="mt-1 text-xs text-neutral-500">
                    Leave empty for immediate activation
                  </p>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    value={data.ends_at}
                    onChange={(e) => setData('ends_at', e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  />
                  {errors.ends_at && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.ends_at}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-neutral-500">
                    Leave empty for no expiration
                  </p>
                </div>
              </div>

              {/* Active Checkbox */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={data.is_active}
                  onChange={(e) => setData('is_active', e.target.checked)}
                  className="h-5 w-5 rounded border-neutral-300 text-teal-600 focus:ring-teal-500"
                />
                <label
                  htmlFor="is_active"
                  className="text-sm font-medium text-neutral-700"
                >
                  Activate this promo
                </label>
              </div>
            </div>
          </div>

          {/* Sticky Submit Bar */}
          <div className="sticky bottom-6 z-30 flex items-center justify-between rounded-2xl border border-neutral-200/80 bg-white/90 px-6 py-4 shadow-xl backdrop-blur-md">
            <span className="hidden text-xs font-medium text-neutral-500 sm:inline">
              Please ensure promo banner details are accurate before saving
            </span>
            <div className="ml-auto flex items-center gap-3">
              <Link
                href="/admin/promo-banners"
                className="rounded-xl border border-neutral-200 bg-white px-6 py-3 font-medium text-neutral-700 transition-all hover:bg-neutral-50 active:scale-[0.98]"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={processing}
                className="inline-flex items-center gap-2 rounded-xl bg-[#a67c52] px-6 py-3 font-medium text-white shadow-md transition-all hover:bg-[#8e6843] active:scale-[0.98] disabled:opacity-50"
              >
                <Save className="h-5 w-5" />
                {processing ? 'Saving...' : 'Save Promo'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Confirm Save Promo Dialog */}
      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title={t('admin.promo_banners.confirm_save_title')}
        description={t('admin.promo_banners.confirm_save_desc')}
        confirmText={t('admin.promo_banners.confirm_save_button')}
        cancelText={t('common.cancel')}
        variant="default"
        isLoading={processing}
        onConfirm={confirmSavePromo}
      />
    </AdminLayout>
  );
}
