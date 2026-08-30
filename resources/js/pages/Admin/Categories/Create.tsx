import AdminLayout from '@/layouts/admin/admin-layout';
import { compressImage } from '@/utils/image-compress';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    ChevronDown,
    FolderTree,
    Image as ImageIcon,
    Loader2,
    Save,
    X,
} from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import { useState } from 'react';

interface ParentCategory {
    id: number;
    name: string;
    slug: string;
}

interface CreateCategoryProps {
    parentCategories: ParentCategory[];
}

export default function CreateCategory({
    parentCategories,
}: CreateCategoryProps) {
    const { data, setData, processing, errors } = useForm<{
        name: string;
        description: string;
        parent_id: number | null;
        is_active: boolean;
        is_featured: boolean;
        image: File | null;
    }>({
        name: '',
        description: '',
        parent_id: null,
        is_active: true,
        is_featured: false,
        image: null,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isCompressing, setIsCompressing] = useState(false);

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsCompressing(true);
            try {
                const compressedFile = await compressImage(file, {
                    maxSizeMB: 2,
                });
                setData('image', compressedFile);
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
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            '/admin/categories',
            {
                ...data,
                image: data.image,
            },
            {
                forceFormData: true,
                onError: (errors) => {
                    console.error('Form errors:', errors);
                },
            },
        );
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Categories', href: '/admin/categories' },
                { title: 'Add Category', href: '/admin/categories/create' },
            ]}
        >
            <Head title="Add Category" />

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
                        <h1 className="text-2xl font-bold text-terra-900">
                            Add New Category
                        </h1>
                        <p className="mt-1 text-terra-500">
                            Create a new category for products
                        </p>
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
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all placeholder:text-terra-400 focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                                    placeholder="Enter category name"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.name}
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
                                        onChange={(val) =>
                                            setData('description', val || '')
                                        }
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
                                    This image will be displayed in the "Featured Rooms" section on the homepage.
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
                                                    Click to upload
                                                </span>{' '}
                                                or drag and drop
                                            </p>
                                            <p className="text-xs text-terra-400">
                                                PNG, JPG, or WEBP (auto-compressed to 2MB)
                                            </p>
                                            <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-wood/20 bg-wood/5 px-2.5 py-0.5 text-xs text-wood">
                                                <span className="font-semibold">Recommended size:</span> 800 × 600 px (4:3 ratio) or 800 × 800 px (1:1 ratio)
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
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.image}
                                    </p>
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
                                {processing ? 'Saving...' : 'Save Category'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
