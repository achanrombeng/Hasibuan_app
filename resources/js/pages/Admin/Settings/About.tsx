import { ConfirmDialog } from '@/components/ui/alert-dialog';
import { useTranslation } from '@/hooks/use-translation';
import AdminLayout from '@/layouts/admin/admin-layout';
import { compressImage } from '@/utils/image-compress';
import { Head, router, useForm } from '@inertiajs/react';
import MDEditor from '@uiw/react-md-editor';
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  ImageIcon,
  Layers,
  Loader2,
  Save,
  Star,
  Upload,
  X,
} from 'lucide-react';
import React, { useRef, useState } from 'react';

interface AboutSettingsProps {
  settings: {
    about_story_title?: string;
    about_story_subtitle?: string;
    about_story_content?: string;
    about_story_images?: string[];
  };
}

interface ImageItem {
  id: string;
  url: string;
  file?: File;
  isNew?: boolean;
}

export default function AboutSettings({ settings }: AboutSettingsProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initial images list from settings
  const initialImages: ImageItem[] = (
    settings.about_story_images && settings.about_story_images.length > 0
      ? settings.about_story_images
      : [
          '/images/about/hasibuan-profile-1.webp',
          '/images/about/hasibuan-profile-2.webp',
          '/images/about/hasibuan-workshop.jpg',
        ]
  ).map((url, idx) => ({
    id: `existing-${idx}-${url}`,
    url,
    isNew: false,
  }));

  const [imagesList, setImagesList] = useState<ImageItem[]>(initialImages);

  const defaultContent =
    settings.about_story_content ||
    `Hasibuan Designs is a Jepara based company specialising in the wooden furniture and manufacturer of premium wood furniture such as Teak Solid Wood.

Established in 2000, we focused our business in manufacturing and exporting handmade indoor furnitures and accessories home decoration. Since 2000 Hasibuan Designs Furniture has supply wooden furniture to customers from Norway, Miami, Brazil, UK, Germany, Taiwan, Mongolia, India, Malaysia, Singapore and Australia.

With staff and Employers around 150 peoples we commited to make sure that you are 100% happy with your experience with us. From sales through to delivery, we aim to provide a first class service that you will be delighted with.

If you would like advice on any aspect of choosing or caring for your Hasibuan Designs Furniture please get in touch. We love talking to customers, and providing advice and support on choosing the best pieces to suit your style of home.

The Hasibuan Designs Furniture range is built to last, and is always of excellent quality. Our furniture comes fully assembled after 8-12 weeks of careful construction and attention is made to the finest details. We use traditional construction methods, pin and dowel techniques, and dovetail joints for extra strength. Our products are made from solid timbers and we never use veneers.

We set competitive prices, and actively check and match these against similar quality products. All exclusive Hasibuan Designs products are hand made in Indonesia by local craftsmen. The workshop is located in Jepara, Central Java and with its exotic tropical surroundings; it is a great environment to work in. All work is carried out using perfected traditional methods.

The increase in popularity of Indonesian furniture has meant an improvement for to worked hard to create a sense of art in every pieces of our furniture. The wood used for much of our furniture is premium wood which coming from government controlled plantation, and therefore by definition eco friendly.`;

  const { data, setData, errors } = useForm({
    about_story_title: settings.about_story_title || 'Company Profile',
    about_story_subtitle:
      settings.about_story_subtitle ||
      'Hasibuan Designs Furniture & Craftsmanship - Jepara, Indonesia',
    about_story_content: defaultContent,
  });

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressing(true);
    try {
      const fileArray = Array.from(files);
      const compressedImages: ImageItem[] = await Promise.all(
        fileArray.map(async (file, idx) => {
          const compressedFile = await compressImage(file, {
            maxSizeMB: 2,
          });
          return {
            id: `new-${Date.now()}-${idx}`,
            file: compressedFile,
            url: URL.createObjectURL(compressedFile),
            isNew: true,
          };
        }),
      );

      setImagesList((prev) => [...prev, ...compressedImages]);
    } catch (error) {
      console.error('Error compressing images:', error);
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    setImagesList((prev) => {
      const updated = [...prev];
      const item = updated[index];
      if (item.isNew) {
        URL.revokeObjectURL(item.url);
      }
      updated.splice(index, 1);
      return updated;
    });
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    setImagesList((prev) => {
      const targetIndex = direction === 'left' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const updated = [...prev];
      const [moved] = updated.splice(index, 1);
      updated.splice(targetIndex, 0, moved);
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const confirmSaveAbout = () => {
    setIsSubmitting(true);

    const existing_images: string[] = [];
    const new_images: File[] = [];

    imagesList.forEach((item) => {
      if (item.isNew && item.file) {
        new_images.push(item.file);
      } else {
        existing_images.push(item.url);
      }
    });

    router.post(
      '/admin/settings/about',
      {
        about_story_title: data.about_story_title,
        about_story_subtitle: data.about_story_subtitle,
        about_story_content: data.about_story_content,
        existing_images,
        new_images,
      },
      {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: () => {
          setIsSubmitting(false);
          setShowConfirmDialog(false);
        },
        onError: (errs) => {
          setIsSubmitting(false);
          setShowConfirmDialog(false);
          console.error('Form errors:', errs);
        },
      },
    );
  };

  return (
    <AdminLayout
      breadcrumbs={[
        { title: 'Settings', href: '/admin/settings' },
        { title: 'About Us Page', href: '/admin/settings/about' },
      ]}
    >
      <Head title="About Us Page Settings" />

      <div className="space-y-6 pb-12">
        {/* Page Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-terra-900">
              About Us Page Settings
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Upload carousel photos (one or more freely), manage image order,
              story titles, and complete narrative text using the rich text
              editor.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Dynamic Multi-Image Uploader (Product Style) */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-neutral-900">
                    Craftsmanship Slider / Carousel Photos
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Upload one or more photos freely. Photos will be displayed
                    as a slider carousel on the left side of the About Us page.
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                Total: {imagesList.length} Photos (Recommended Ratio: 4:3)
              </span>
            </div>

            <div className="space-y-4">
              {/* Upload Dropzone */}
              <div
                className={`cursor-pointer rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50/50 p-8 text-center transition-all hover:border-wood hover:bg-neutral-50 ${
                  isCompressing ? 'pointer-events-none opacity-50' : ''
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFilesChange}
                  className="hidden"
                  disabled={isCompressing}
                />
                {isCompressing ? (
                  <div className="flex flex-col items-center justify-center py-2">
                    <Loader2 className="mb-3 h-10 w-10 animate-spin text-wood" />
                    <p className="text-sm font-semibold text-neutral-700">
                      Compressing images...
                    </p>
                    <p className="mt-1 text-xs text-neutral-400">
                      Please wait a moment
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-2">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-wood/10 text-wood">
                      <Upload className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-semibold text-neutral-800">
                      Click to upload photos or drag and drop images here
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      Supported formats: PNG, JPG, WEBP (Auto-compressed to max
                      2MB).
                    </p>
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-wood/20 bg-wood/5 px-3 py-1 text-xs font-medium text-wood">
                      <ImageIcon size={14} />
                      <span>Recommended size: 800 × 600 px (4:3)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Images Grid */}
              {imagesList.length > 0 && (
                <div className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {imagesList.map((img, index) => (
                    <div
                      key={img.id}
                      className={`group relative overflow-hidden rounded-xl border-2 shadow-xs transition-all ${
                        index === 0
                          ? 'border-wood ring-2 ring-wood/20'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                        <img
                          src={img.url}
                          alt={`Slide ${index + 1}`}
                          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>

                      {/* Primary Badge */}
                      {index === 0 && (
                        <span className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-wood px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm">
                          <Star className="h-3 w-3 fill-white" /> Primary
                        </span>
                      )}

                      {/* Action Buttons Overlay */}
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        {/* Move Left */}
                        {index > 0 && (
                          <button
                            type="button"
                            title="Move Left"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveImage(index, 'left');
                            }}
                            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg bg-white/90 text-neutral-700 shadow-sm backdrop-blur-xs transition-colors hover:bg-white"
                          >
                            <ChevronLeft size={16} />
                          </button>
                        )}

                        {/* Move Right */}
                        {index < imagesList.length - 1 && (
                          <button
                            type="button"
                            title="Move Right"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveImage(index, 'right');
                            }}
                            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg bg-white/90 text-neutral-700 shadow-sm backdrop-blur-xs transition-colors hover:bg-white"
                          >
                            <ChevronRight size={16} />
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          type="button"
                          title="Delete Photo"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(index);
                          }}
                          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg bg-red-500 text-white shadow-sm transition-colors hover:bg-red-600"
                        >
                          <X size={15} />
                        </button>
                      </div>

                      {/* Index Number Badge */}
                      <span className="absolute bottom-2 left-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-xs">
                        #{index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Story Narrative & Rich Text Editor */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3 border-b border-neutral-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-neutral-900">
                  Handicraft Story
                </h2>
                <p className="text-xs text-neutral-500">
                  Manage the story title, subtitle, and complete narrative text
                  using the Markdown text editor
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Titles */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Story Main Title
                  </label>
                  <input
                    type="text"
                    value={data.about_story_title}
                    onChange={(e) =>
                      setData('about_story_title', e.target.value)
                    }
                    placeholder="e.g. Extending From Indonesia To The World"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-2.5 text-sm text-neutral-900 transition-all focus:border-wood focus:bg-white focus:ring-2 focus:ring-wood/20 focus:outline-none"
                  />
                  {errors.about_story_title && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.about_story_title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Story Subtitle
                  </label>
                  <input
                    type="text"
                    value={data.about_story_subtitle}
                    onChange={(e) =>
                      setData('about_story_subtitle', e.target.value)
                    }
                    placeholder="e.g. Handicraft Story"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-2.5 text-sm text-neutral-900 transition-all focus:border-wood focus:bg-white focus:ring-2 focus:ring-wood/20 focus:outline-none"
                  />
                </div>
              </div>

              {/* Combined Single Text Editor */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Story Narrative Content (Text Editor)
                </label>
                <div
                  data-color-mode="light"
                  className="overflow-hidden rounded-xl border border-neutral-200"
                >
                  <MDEditor
                    value={data.about_story_content}
                    onChange={(val) =>
                      setData('about_story_content', val || '')
                    }
                    height={360}
                    preview="edit"
                  />
                </div>
                <p className="mt-2 text-xs text-neutral-500">
                  Press Enter to separate paragraphs. Bold (*bold*), italic
                  (*italic*), and list formatting are also supported.
                </p>
                {errors.about_story_content && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.about_story_content}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sticky Submit Bar */}
          <div className="sticky bottom-6 z-30 flex items-center justify-between rounded-2xl border border-neutral-200/80 bg-white/90 px-6 py-4 shadow-xl backdrop-blur-md">
            <span className="hidden text-xs font-medium text-neutral-500 sm:inline">
              Make sure all About Us details are correct before saving
            </span>
            <button
              type="submit"
              disabled={isSubmitting || isCompressing}
              className="ml-auto inline-flex cursor-pointer items-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 font-medium text-white shadow-md transition-all hover:bg-black active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Save About Us Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Confirm Save Settings Dialog */}
      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title="Save About Us Settings?"
        description="Carousel photos and narrative story content will be updated immediately on the public About Us page."
        confirmText="Yes, Save Changes"
        cancelText="Cancel"
        variant="default"
        isLoading={isSubmitting}
        onConfirm={confirmSaveAbout}
      />
    </AdminLayout>
  );
}
