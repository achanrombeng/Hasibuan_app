import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
  AlertTriangle,
  Bot,
  ChevronLeft,
  Info,
  RefreshCw,
  Save,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';

interface AiSettingsProps {
  settings: {
    gemini_api_key?: string;
    ai_prompt_template: string;
    ai_model: string;
    ai_temperature: number;
  };
  defaultPrompt: string;
  configuredModel: string;
  availableModels: string[];
}

export default function AiSettings({
  settings,
  defaultPrompt,
  configuredModel,
  availableModels,
}: AiSettingsProps) {
  const { data, setData, post, processing, errors } = useForm({
    gemini_api_key: settings.gemini_api_key ?? '',
    ai_prompt_template: settings.ai_prompt_template ?? '',
    ai_model: settings.ai_model ?? '',
    ai_temperature: settings.ai_temperature ?? 0.4,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/settings/ai');
  };

  const handleResetPrompt = () => {
    setData('ai_prompt_template', defaultPrompt);
  };

  const isUsingDefaultPrompt = data.ai_prompt_template === '';
  const isUsingDefaultModel = data.ai_model === '';

  return (
    <AdminLayout
      breadcrumbs={[
        { title: 'Pengaturan', href: '/admin/settings' },
        { title: 'AI Auto-Fill', href: '/admin/settings/ai' },
      ]}
    >
      <Head title="Pengaturan AI Auto-Fill" />

      <div className="w-full space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Pengaturan AI Auto-Fill
          </h1>
          <p className="mt-1 text-neutral-500">
            Konfigurasi model Gemini dan prompt untuk fitur analisis gambar produk
          </p>
        </div>

        {/* Info Banner */}
        <div className="flex items-start gap-3 rounded-xl border border-violet-100 bg-violet-50 p-4">
          <Sparkles className="mt-0.5 h-5 w-5 flex-shrink-0 text-violet-600" />
          <div className="text-sm text-violet-700">
            <p className="font-medium text-violet-900">Cara Kerja</p>
            <p className="mt-1">
              Saat admin mengupload gambar di halaman{' '}
              <strong>Tambah Produk</strong>, sistem mengirim gambar beserta
              prompt ke Google Gemini API untuk mengisi form secara otomatis.
              Ubah prompt dan model di sini untuk menyesuaikan perilaku AI.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Model & Temperature */}
          <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
            <div className="border-b border-neutral-100 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50">
                  <SlidersHorizontal className="h-6 w-6 text-violet-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Konfigurasi Model
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Model Gemini, API Key, dan parameter generasi
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-6">
              {/* Gemini API Key */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-neutral-700">
                    Gemini API Key
                  </label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-violet-600 hover:underline"
                  >
                    Dapatkan API Key gratis di Google AI Studio ↗
                  </a>
                </div>
                <input
                  type="password"
                  value={data.gemini_api_key}
                  onChange={(e) => setData('gemini_api_key', e.target.value)}
                  placeholder="Paste GEMINI_API_KEY di sini (kosongkan jika menggunakan .env)"
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                />
                <p className="mt-1.5 text-xs text-neutral-400">
                  Jika diisi, nilai ini akan menggantikan GEMINI_API_KEY dari file .env
                </p>
              </div>

              {/* Model selector */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Model Gemini
                </label>
                <select
                  value={data.ai_model}
                  onChange={(e) => setData('ai_model', e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                >
                  <option value="">
                    Default dari konfigurasi ({configuredModel})
                  </option>
                  {availableModels.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
                {isUsingDefaultModel && (
                  <p className="mt-2 text-xs text-neutral-500">
                    Menggunakan model dari{' '}
                    <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-xs">
                      GEMINI_MODEL
                    </code>{' '}
                    di .env:{' '}
                    <span className="font-medium text-neutral-700">
                      {configuredModel}
                    </span>
                  </p>
                )}
              </div>

              {/* Temperature */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Temperature:{' '}
                  <span className="font-mono font-semibold text-violet-700">
                    {data.ai_temperature.toFixed(1)}
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={data.ai_temperature}
                  onChange={(e) =>
                    setData('ai_temperature', parseFloat(e.target.value))
                  }
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-neutral-200 accent-violet-600"
                />
                <div className="mt-1 flex justify-between text-xs text-neutral-400">
                  <span>0.0 — Deterministik</span>
                  <span>1.0 — Kreatif</span>
                </div>
                <p className="mt-2 text-xs text-neutral-500">
                  Nilai lebih rendah menghasilkan output yang konsisten dan
                  presisi. Nilai lebih tinggi lebih variatif. Default:{' '}
                  <span className="font-medium">0.4</span>
                </p>
                {errors.ai_temperature && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.ai_temperature}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Prompt Template */}
          <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
            <div className="border-b border-neutral-100 p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
                    <Bot className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-900">
                      Template Prompt
                    </h2>
                    <p className="text-sm text-neutral-500">
                      Instruksi yang dikirim ke Gemini saat menganalisis gambar
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleResetPrompt}
                  className="inline-flex flex-shrink-0 items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset ke Default
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Placeholder info */}
              <div className="mb-4 flex items-start gap-3 rounded-lg bg-amber-50 p-4">
                <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                <div className="text-xs text-amber-700">
                  <p className="font-medium text-amber-900">
                    Placeholder wajib
                  </p>
                  <ul className="mt-1 space-y-1">
                    <li>
                      <code className="rounded bg-amber-100 px-1 font-mono">
                        {'{{CATEGORY_LIST}}'}
                      </code>{' '}
                      — diganti otomatis dengan daftar kategori aktif dari
                      database
                    </li>
                    <li>
                      <code className="rounded bg-amber-100 px-1 font-mono">
                        {'{{CONTEXT_BLOCK}}'}
                      </code>{' '}
                      — diganti dengan field yang sudah diisi admin (opsional,
                      boleh kosong jika tidak ada)
                    </li>
                  </ul>
                  <p className="mt-2 text-amber-600">
                    Template wajib mengandung{' '}
                    <code className="rounded bg-amber-100 px-1 font-mono">
                      {'{{CATEGORY_LIST}}'}
                    </code>
                    . Kosongkan template untuk kembali ke prompt bawaan.
                  </p>
                </div>
              </div>

              {/* Missing placeholder warning */}
              {data.ai_prompt_template !== '' &&
                !data.ai_prompt_template.includes('{{CATEGORY_LIST}}') && (
                  <div className="mb-4 flex items-start gap-3 rounded-lg bg-red-50 p-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
                    <p className="text-xs font-medium text-red-700">
                      Template tidak mengandung{' '}
                      <code className="rounded bg-red-100 px-1 font-mono">
                        {'{{CATEGORY_LIST}}'}
                      </code>
                      . AI tidak akan tahu kategori yang tersedia.
                    </p>
                  </div>
                )}

              <textarea
                value={data.ai_prompt_template}
                onChange={(e) => setData('ai_prompt_template', e.target.value)}
                rows={22}
                placeholder={
                  'Kosongkan untuk menggunakan prompt bawaan sistem.\n\nAtau tulis prompt kustom yang mengandung placeholder:\n{{CATEGORY_LIST}} dan {{CONTEXT_BLOCK}}'
                }
                className="w-full resize-y rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 font-mono text-sm text-neutral-900 transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
              />

              <div className="mt-2 flex items-center justify-between text-xs text-neutral-400">
                <span>
                  {isUsingDefaultPrompt ? (
                    <span className="text-teal-600">
                      Menggunakan prompt bawaan sistem
                    </span>
                  ) : (
                    <span>{data.ai_prompt_template.length} / 10.000 karakter</span>
                  )}
                </span>
                {errors.ai_prompt_template && (
                  <span className="text-red-600">
                    {errors.ai_prompt_template}
                  </span>
                )}
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
              className="ml-auto inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-medium text-white shadow-md transition-all hover:bg-violet-700 active:scale-[0.98] disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              {processing ? 'Menyimpan...' : 'Simpan Pengaturan AI'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
