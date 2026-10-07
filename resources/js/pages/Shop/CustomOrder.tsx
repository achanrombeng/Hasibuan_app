import { SEOHead } from '@/components/seo';
import { AlertDialog, useAlertDialog } from '@/components/ui/alert-dialog';
import { ShopLayout } from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { CheckCircle, Palette, Ruler, Send, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

const FURNITURE_TYPES = [
  'Chairs',
  'Tables',
  'Cabinets & Storage',
  'Sofas & Lounges',
  'Shelving & Bookcases',
  'Beds & Headboards',
  'TV Consoles',
  'Nightstands & Accent Tables',
  'Others',
];

const MATERIALS = [
  { id: 'kayu-jati', name: 'Grade-A Teak Wood', description: 'Strong, weather-resistant, and durable' },
  {
    id: 'kayu-mahoni',
    name: 'Mahogany Wood',
    description: 'Refined grain and elegant luxury finish',
  },
  {
    id: 'kayu-pinus',
    name: 'Pine Wood',
    description: 'Lightweight with warm natural aesthetic',
  },
  {
    id: 'multipleks',
    name: 'Plywood & Natural Veneer',
    description: 'Modern, stable, and versatile',
  },
  { id: 'rotan', name: 'All-Weather Rattan / Wicker', description: 'Organic texture and artisanal weave' },
  { id: 'kombinasi', name: 'Mixed Materials', description: 'Wood, steel, rope, and outdoor fabric' },
];

export default function CustomOrder() {
  const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
  const siteName = siteSettings?.site_name || 'hasibuan_app';
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
      showAlert('Maximum 5 images allowed', 'warning', 'Notice');
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
          title="Custom Order Submitted"
          description={`Your custom order inquiry has been received. The ${siteName} team will contact you within 1-2 business days.`}
        />
        <div className="bg-noise" />
        <ShopLayout>
          <main className="flex min-h-screen items-center justify-center bg-sand-50 pt-28 pb-20">
            <div className="mx-auto max-w-md px-6 text-center">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-wood/20">
                <CheckCircle size={48} className="text-wood-dark" />
              </div>
              <h1 className="mb-4 font-serif text-3xl text-terra-900">
                Inquiry Received!
              </h1>
              <p className="mb-8 text-terra-600">
                Thank you! Our design and production team will review your specifications and contact you within 1-2 business days.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="rounded-full bg-terra-900 px-8 py-3 text-white transition-colors hover:bg-wood-dark"
              >
                Submit Another Inquiry
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
        title="Custom Order - Bespoke Handcrafted Furniture"
        description={`Order bespoke handcrafted furniture tailored to your exact specifications at ${siteName}. Choose materials, dimensions, and custom finishes.`}
        keywords={[
          'custom furniture',
          'bespoke furniture',
          'custom teak furniture',
          'made to order furniture',
          'custom outdoor furniture',
        ]}
      />
      <div className="bg-noise" />
      <ShopLayout>
        <main className="min-h-screen bg-sand-50 pt-28 pb-20">
          {/* Monumental Editorial Header - Black Luxury Banner */}
          <div className="mb-12 border-b border-neutral-900 bg-neutral-950 py-16 md:py-24 px-6 text-white">
            <div className="mx-auto max-w-[1720px] text-center space-y-3">
              <span className="text-[10px] md:text-xs tracking-[0.35em] uppercase font-light text-neutral-400">
                BESPOKE ATELIER
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.06em] text-white uppercase">
                CUSTOM ARCHITECTURAL COMMISSION
              </h1>
              <div className="w-12 h-[1px] bg-neutral-700 mx-auto mt-4" />
              <p className="mx-auto max-w-2xl text-xs md:text-sm font-light text-neutral-300 tracking-wide pt-2">
                Bring your dream furniture to life with bespoke designs, export-grade materials, and precision dimensions.
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
                  Bespoke Design
                </h3>
                <p className="text-sm text-terra-500">
                  Upload architectural references or share your concepts
                </p>
              </div>
              <div className="rounded-sm border border-terra-100 bg-white p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-wood/10">
                  <Ruler size={24} className="text-wood-dark" />
                </div>
                <h3 className="mb-2 font-medium text-terra-900">
                  Tailored Sizing
                </h3>
                <p className="text-sm text-terra-500">
                  Crafted precisely to complement your space
                </p>
              </div>
              <div className="rounded-sm border border-terra-100 bg-white p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-wood/10">
                  <CheckCircle size={24} className="text-wood-dark" />
                </div>
                <h3 className="mb-2 font-medium text-terra-900">
                  Master Quality
                </h3>
                <p className="text-sm text-terra-500">
                  Sustainable timber and flawless craftsmanship
                </p>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="rounded-sm border border-terra-100 bg-white p-8"
            >
              <h2 className="mb-6 font-serif text-2xl text-terra-900">
                Custom Order Inquiry Form
              </h2>

              {/* Contact Info */}
              <div className="mb-8 grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-terra-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="w-full rounded-sm border border-terra-200 px-4 py-3 outline-none focus:border-wood focus:ring-1 focus:ring-wood"
                    placeholder="Your Full Name"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-terra-700">
                    Email Address *
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
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    className="w-full rounded-sm border border-terra-200 px-4 py-3 outline-none focus:border-wood focus:ring-1 focus:ring-wood"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              {/* Product Type & Material */}
              <div className="mb-8 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-terra-700">
                    Furniture Category *
                  </label>
                  <select
                    required
                    value={data.furniture_type}
                    onChange={(e) => setData('furniture_type', e.target.value)}
                    className="w-full rounded-sm border border-terra-200 bg-white px-4 py-3 outline-none focus:border-wood focus:ring-1 focus:ring-wood"
                  >
                    <option value="">Select furniture category</option>
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
                    <option value="">Select preferred material</option>
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
                  Dimensions (cm) - Optional
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="number"
                    value={data.width}
                    onChange={(e) => setData('width', e.target.value)}
                    className="w-full rounded-sm border border-terra-200 px-4 py-3 outline-none focus:border-wood focus:ring-1 focus:ring-wood"
                    placeholder="Width"
                  />
                  <input
                    type="number"
                    value={data.height}
                    onChange={(e) => setData('height', e.target.value)}
                    className="w-full rounded-sm border border-terra-200 px-4 py-3 outline-none focus:border-wood focus:ring-1 focus:ring-wood"
                    placeholder="Height"
                  />
                  <input
                    type="number"
                    value={data.depth}
                    onChange={(e) => setData('depth', e.target.value)}
                    className="w-full rounded-sm border border-terra-200 px-4 py-3 outline-none focus:border-wood focus:ring-1 focus:ring-wood"
                    placeholder="Depth"
                  />
                </div>
              </div>

              {/* Color & Budget */}
              <div className="mb-8 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-terra-700">
                    Finish / Color Preference
                  </label>
                  <input
                    type="text"
                    value={data.color}
                    onChange={(e) => setData('color', e.target.value)}
                    className="w-full rounded-sm border border-terra-200 px-4 py-3 outline-none focus:border-wood focus:ring-1 focus:ring-wood"
                    placeholder="e.g. Natural Teak, Dark Walnut, Weathered Grey"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-terra-700">
                    Estimated Budget
                  </label>
                  <input
                    type="text"
                    value={data.budget}
                    onChange={(e) => setData('budget', e.target.value)}
                    className="w-full rounded-sm border border-terra-200 px-4 py-3 outline-none focus:border-wood focus:ring-1 focus:ring-wood"
                    placeholder="e.g. $1,500 - $3,000"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <label className="mb-2 block text-sm font-medium text-terra-700">
                  Detailed Project Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  className="w-full resize-none rounded-sm border border-terra-200 px-4 py-3 outline-none focus:border-wood focus:ring-1 focus:ring-wood"
                  placeholder="Describe your project, layout dimensions, styling preferences, or special requirements..."
                />
              </div>

              {/* Image Upload */}
              <div className="mb-8">
                <label className="mb-2 block text-sm font-medium text-terra-700">
                  Upload Reference Images (Max. 5)
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
                    <span className="animate-spin">⏳</span> Submitting...
                  </>
                ) : (
                  <>
                    <Send size={20} /> Submit Inquiry
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
