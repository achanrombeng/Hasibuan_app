import { ConfirmDialog } from '@/components/ui/alert-dialog';
import { useTranslation } from '@/hooks/use-translation';
import AdminLayout from '@/layouts/admin/admin-layout';
import { compressImage } from '@/utils/image-compress';
import { Head, Link, router, useForm } from '@inertiajs/react';
import MDEditor from '@uiw/react-md-editor';
import { ArrowLeft, Image as ImageIcon, Loader2, Save, X } from 'lucide-react';
import { useState } from 'react';

interface ParentCategory {
  id: number;
  name: string;
  slug: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  description: string | null;
  is_active: boolean;
  is_featured: boolean;
  sort_order?: number;
  image_path: string | null;
  image_url: string | null;
}

interface EditCategoryProps {
  category: Category;
  parentCategories: ParentCategory[];
}

export default function EditCategory({
  category,
  parentCategories,
}: EditCategoryProps) {
  const { data, setData, processing, errors } = useForm<{
    name: string;
    description: string;
    parent_id: number | null;
    is_active: boolean;
    is_featured: boolean;
    sort_order: number | '';
    image: File | null;
  }>({
    name: category.name,
    description: category.description || '',
    parent_id: category.parent_id,
    is_active: category.is_active,
    is_featured: category.is_featured || false,
    sort_order: category.sort_order ?? 0,
    image: null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(
    category.image_url,
  );
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      try {
        const compressedFile = await compressImage(file, {
          maxSizeMB: 2,
        });
        setData('image', compressedFile);
        setRemoveCurrentImage(false);
        setImagePreview(URL.createObjectURL(compressedFile));
      } catch (error) {
        console.error('Error compressing image:', error);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const removeImage = () => {
    setData('image', null);
    setImagePreview(null);
    setRemoveCurrentImage(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const confirmUpdate = () => {
    setIsSubmitting(true);
    router.post(
      `/admin/categories/${category.id}`,
      {
        _method: 'PUT',
        ...data,
        image: data.image,
        remove_image: removeCurrentImage,
      },
      {
        forceFormData: true,
        onError: (errors) => {
          setIsSubmitting(false);
          setShowConfirmDialog(false);
          console.error('Form errors:', errors);
        },
        onFinish: () => {
          setIsSubmitting(false);
        },
      },
    );
  };

  return (
    <AdminLayout
      breadcrumbs={[
        { title: 'Categories', href: '/admin/categories' },
        {
          title: 'Edit Category',
          href: `/admin/categories/${category.id}/edit`,
        },
      ]}
    >
      <Head title={`Edit: ${category.name}`} />

      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/admin/categories"
            className="rounded-lg p-2 text-terra-600 transition-colors hover:bg-terra-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-terra-900">Edit Category</h1>
            <p className="mt-1 text-terra-500">{category.name}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
            <div className="space-y-6">
              {/* Category Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-terra-700">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all placeholder:text-terra-400 focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Sort Order */}
              <div>
                <label className="mb-2 block text-sm font-medium text-terra-700">
                  Sort Order
                </label>
                <input
                  type="number"
                  min="0"
                  value={data.sort_order}
                  onChange={(e) =>
                    setData(
                      'sort_order',
                      e.target.value === '' ? '' : parseInt(e.target.value, 10),
                    )
                  }
                  className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all placeholder:text-terra-400 focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                  placeholder="0"
                />
                <p className="mt-1 text-xs text-terra-500">
                  Lower values (e.g., 1, 2, 3) appear first in the Products
                  navbar dropdown and catalog list.
                </p>
                {errors.sort_order && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.sort_order}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-terra-700">
                  Description
                </label>
                <div data-color-mode="light">
                  <MDEditor
                    value={data.description}
                    onChange={(val) => setData('description', val || '')}
                    height={200}
                    preview="edit"
                  />
                </div>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label className="mb-2 block text-sm font-medium text-terra-700">
                  Category Image
                </label>
                <p className="mb-3 text-sm text-terra-500">
                  This image will be displayed in the "Featured Rooms" section
                  on the homepage.
                </p>

                {imagePreview ? (
                  <div className="relative h-48 w-full overflow-hidden rounded-xl border border-terra-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 rounded-full bg-red-500 p-1.5 text-white transition-colors hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : isCompressing ? (
                  <div className="flex h-48 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-terra-300 bg-terra-50/50">
                    <Loader2 className="mb-3 h-10 w-10 animate-spin text-terra-400" />
                    <p className="text-sm font-semibold text-terra-500">
                      Compressing image...
                    </p>
                    <p className="text-xs text-terra-400">
                      Please wait a moment
                    </p>
                  </div>
                ) : (
                  <label className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-terra-300 transition-all hover:border-terra-400 hover:bg-terra-50/50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="mb-3 h-10 w-10 text-terra-400" />
                      <p className="mb-2 text-sm text-terra-500">
                        <span className="font-semibold">
                          Click to upload new image
                        </span>{' '}
                        or drag and drop
                      </p>
                      <p className="text-xs text-terra-400">
                        PNG, JPG, or WEBP (auto-compressed to 2MB)
                      </p>
                      <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-wood/20 bg-wood/5 px-2.5 py-0.5 text-xs text-wood">
                        <span className="font-semibold">Recommended size:</span>{' '}
                        800 × 600 px (4:3 ratio) or 800 × 800 px (1:1 ratio)
                      </div>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isCompressing}
                    />
                  </label>
                )}
                {errors.image && (
                  <p className="mt-1 text-sm text-red-500">{errors.image}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sticky Submit Bar */}
          <div className="sticky bottom-6 z-30 flex items-center justify-between rounded-2xl border border-neutral-200/80 bg-white/90 px-6 py-4 shadow-xl backdrop-blur-md">
            <span className="hidden text-xs font-medium text-neutral-500 sm:inline">
              Please ensure category details are accurate before saving
            </span>
            <div className="ml-auto flex items-center gap-3">
              <Link
                href="/admin/categories"
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
                {processing ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Confirm Update Category Dialog */}
      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title={t('admin.categories.confirm_update_title')}
        description={t('admin.categories.confirm_update_desc')}
        confirmText={t('admin.categories.confirm_update_button')}
        cancelText={t('common.cancel')}
        variant="default"
        isLoading={isSubmitting}
        onConfirm={confirmUpdate}
      />
    </AdminLayout>
  );
}
