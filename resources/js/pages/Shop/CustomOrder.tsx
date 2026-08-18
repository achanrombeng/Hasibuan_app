import { SEOHead } from '@/components/seo';
import { AlertDialog, useAlertDialog } from '@/components/ui/alert-dialog';
import { ShopLayout } from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { CheckCircle, Palette, Ruler, Send, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

const FURNITURE_TYPES = [
  'Kursi',
  'Meja',
  'Lemari',
  'Sofa',
  'Rak',
  'Tempat Tidur',
  'Meja TV',
  'Nakas',
  'Lainnya',
];

const MATERIALS = [
  { id: 'kayu-jati', name: 'Kayu Jati', description: 'Kuat dan tahan lama' },
  {
    id: 'kayu-mahoni',
    name: 'Kayu Mahoni',
    description: 'Elegan dan berkelas',
  },
  {
    id: 'kayu-pinus',
    name: 'Kayu Pinus',
    description: 'Ringan dan ekonomis',
  },
  {
    id: 'multipleks',
    name: 'Multipleks/Plywood',
    description: 'Modern dan praktis',
  },
  { id: 'rotan', name: 'Rotan', description: 'Natural dan artistik' },
  { id: 'kombinasi', name: 'Kombinasi', description: 'Mix material' },
];

export default function CustomOrder() {
  const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
  const siteName = siteSettings?.site_name || 'Ronica';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { state: alertState, showAlert, closeAlert } = useAlertDialog();

  const { data, setData, reset } = useForm({
    name: '',
    email: '',
    phone: '',
    furniture_type: '',
    material: '',
    width: '',
    height: '',
    depth: '',
    color: '',
    description: '',
    budget: '',
    images: [] as File[],
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + previewImages.length > 5) {
      showAlert('Maksimal 5 gambar', 'warning', 'Peringatan');
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
    setData('images', [...data.images, ...files]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewImages[index]);
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setData(
      'images',
      data.images.filter((_, i) => i !== index),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission - in production, this would be a real API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      reset();
      setPreviewImages([]);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <>
        <SEOHead
          title="Custom Order Berhasil"
          description={`Permintaan custom order Anda telah terkirim. Tim ${siteName} akan menghubungi Anda dalam 1-2 hari kerja.`}
        />
        <div className="bg-noise" />
        <ShopLayout>
          <main className="flex min-h-screen items-center justify-center bg-sand-50 pt-28 pb-20">
            <div className="mx-auto max-w-md px-6 text-center">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-wood/20">
                <CheckCircle size={48} className="text-wood-dark" />
              </div>
              <h1 className="mb-4 font-serif text-3xl text-terra-900">
                Permintaan Terkirim!
              </h1>
              <p className="mb-8 text-terra-600">
                Terima kasih! Tim kami akan menghubungi Anda dalam 1-2 hari
                kerja untuk konsultasi lebih lanjut.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="rounded-full bg-terra-900 px-8 py-3 text-white transition-colors hover:bg-wood-dark"
              >
                Buat Permintaan Lagi
              </button>
            </div>
          </main>
        </ShopLayout>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Custom Order - Pesan Furnitur Sesuai Keinginan"
        description={`Pesan furnitur custom sesuai keinginan Anda di ${siteName}. Pilih material, ukuran, dan desain. Konsultasi gratis dengan tim ahli kami.`}
        keywords={[
          'custom order',
          'furnitur custom',
          'pesan mebel',
          'furniture custom jepara',
          'desain furnitur',
        ]}
      />
      <div className="bg-noise" />
      <ShopLayout>
        <main className="min-h-screen bg-sand-50 pt-28 pb-20">
          {/* Hero Banner */}
          <div className="mb-12 bg-gradient-to-r from-wood-dark to-terra-800 py-16 text-white">
            <div className="mx-auto max-w-[1400px] px-6 text-center md:px-12">
              <div className="mb-4 flex items-center justify-center gap-3">
                <Palette size={40} className="text-wood-light" />
                <h1 className="font-serif text-4xl font-bold md:text-5xl">
                  CUSTOM ORDER
                </h1>
                <Ruler size={40} className="text-wood-light" />
              </div>
              <p className="text-xl opacity-90">
                Wujudkan Furniture Impian Anda
              </p>
              <p className="mt-2 text-sm opacity-75">
                Desain sesuai kebutuhan, material pilihan, ukuran presisi
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-4xl px-6 md:px-12">
            {/* Info Cards */}
            <div className="mb-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-sm border border-terra-100 bg-white p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-wood/10">
                  <Palette size={24} className="text-wood-dark" />
                </div>
                <h3 className="mb-2 font-medium text-terra-900">
                  Desain Bebas
                </h3>
                <p className="text-sm text-terra-500">
                  Upload referensi atau gambarkan ide Anda
                </p>
              </div>
              <div className="rounded-sm border border-terra-100 bg-white p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-wood/10">
                  <Ruler size={24} className="text-wood-dark" />
                </div>
                <h3 className="mb-2 font-medium text-terra-900">
                  Ukuran Presisi
                </h3>
                <p className="text-sm text-terra-500">
                  Sesuaikan dengan ruangan Anda
                </p>
              </div>
              <div className="rounded-sm border border-terra-100 bg-white p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-wood/10">
                  <CheckCircle size={24} className="text-wood-dark" />
                </div>
                <h3 className="mb-2 font-medium text-terra-900">
                  Garansi Kualitas
                </h3>
                <p className="text-sm text-terra-500">
                  Material premium, hasil sempurna
                </p>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="rounded-sm border border-terra-100 bg-white p-8"
            >
              <h2 className="mb-6 font-serif text-2xl text-terra-900">
                Form Permintaan Custom
              </h2>

              {/* Contact Info */}
              <div className="mb-8 grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-terra-700">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="w-full rounded-sm border border-terra-200 px-4 py-3 outline-none focus:border-wood focus:ring-1 focus:ring-wood"
                    placeholder="Nama Anda"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-terra-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="w-full rounded-sm border border-terra-200 px-4 py-3 outline-none focus:border-wood focus:ring-1 focus:ring-wood"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-terra-700">
                    No. WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    className="w-full rounded-sm border border-terra-200 px-4 py-3 outline-none focus:border-wood focus:ring-1 focus:ring-wood"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
              </div>

              {/* Product Type & Material */}
              <div className="mb-8 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-terra-700">
                    Jenis Furniture *
                  </label>
                  <select
                    required
                    value={data.furniture_type}
                    onChange={(e) => setData('furniture_type', e.target.value)}
                    className="w-full rounded-sm border border-terra-200 bg-white px-4 py-3 outline-none focus:border-wood focus:ring-1 focus:ring-wood"
                  >
                    <option value="">Pilih jenis furniture</option>
                    {FURNITURE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-terra-700">
                    Material *
                  </label>
                  <select
                    required
                    value={data.material}
                    onChange={(e) => setData('material', e.target.value)}
                    className="w-full rounded-sm border border-terra-200 bg-white px-4 py-3 outline-none focus:border-wood focus:ring-1 focus:ring-wood"
                  >
                    <option value="">Pilih material</option>
                    {MATERIALS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} - {m.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dimensions */}
              <div className="mb-8">
                <label className="mb-2 block text-sm font-medium text-terra-700">
                  Ukuran (cm) - Opsional
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="number"
                    value={data.width}
                    onChange={(e) => setData('width', e.target.value)}
                    className="w-full rounded-sm border border-terra-200 px-4 py-3 outline-none focus:border-wood focus:ring-1 focus:ring-wood"
                    placeholder="Lebar"
                  />
                  <input
                    type="number"
                    value={data.height}
                    onChange={(e) => setData('height', e.target.value)}
                    className="w-full rounded-sm border border-terra-200 px-4 py-3 outline-none focus:border-wood focus:ring-1 focus:ring-wood"
                    placeholder="Tinggi"
                  />
                  <input
                    type="number"
                    value={data.depth}
                    onChange={(e) => setData('depth', e.target.value)}
                    className="w-full rounded-sm border border-terra-200 px-4 py-3 outline-none focus:border-wood focus:ring-1 focus:ring-wood"
                    placeholder="Kedalaman"
                  />
                </div>
              </div>

              {/* Color & Budget */}
              <div className="mb-8 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-terra-700">
                    Warna/Finishing
                  </label>
                  <input
                    type="text"
                    value={data.color}
                    onChange={(e) => setData('color', e.target.value)}
                    className="w-full rounded-sm border border-terra-200 px-4 py-3 outline-none focus:border-wood focus:ring-1 focus:ring-wood"
                    placeholder="Contoh: Natural, Walnut, Putih"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-terra-700">
                    Estimasi Budget
                  </label>
                  <input
                    type="text"
                    value={data.budget}
                    onChange={(e) => setData('budget', e.target.value)}
                    className="w-full rounded-sm border border-terra-200 px-4 py-3 outline-none focus:border-wood focus:ring-1 focus:ring-wood"
                    placeholder="Contoh: 5-10 juta"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <label className="mb-2 block text-sm font-medium text-terra-700">
                  Deskripsi Detail *
                </label>
                <textarea
                  required
                  rows={4}
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  className="w-full resize-none rounded-sm border border-terra-200 px-4 py-3 outline-none focus:border-wood focus:ring-1 focus:ring-wood"
                  placeholder="Jelaskan detail furniture yang Anda inginkan..."
                />
              </div>

              {/* Image Upload */}
              <div className="mb-8">
                <label className="mb-2 block text-sm font-medium text-terra-700">
                  Upload Referensi Gambar (Maks. 5)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="flex flex-wrap gap-4">
                  {previewImages.map((src, idx) => (
                    <div
                      key={idx}
                      className="relative h-24 w-24 overflow-hidden rounded-sm border border-terra-200"
                    >
                      <img
                        src={src}
                        alt={`Preview ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-terra-900/80 text-white hover:bg-terra-900"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {previewImages.length < 5 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex h-24 w-24 flex-col items-center justify-center rounded-sm border-2 border-dashed border-terra-300 text-terra-400 transition-colors hover:border-wood hover:text-wood"
                    >
                      <Upload size={24} />
                      <span className="mt-1 text-xs">Upload</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-sm bg-terra-900 py-4 font-medium text-white transition-colors hover:bg-wood-dark disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin">⏳</span> Mengirim...
                  </>
                ) : (
                  <>
                    <Send size={20} /> Kirim Permintaan
                  </>
                )}
              </button>
            </form>
          </div>
        </main>
      </ShopLayout>

      <AlertDialog
        open={alertState.open}
        onOpenChange={closeAlert}
        title={alertState.title}
        description={alertState.description}
        type={alertState.type}
      />
    </>
  );
}
