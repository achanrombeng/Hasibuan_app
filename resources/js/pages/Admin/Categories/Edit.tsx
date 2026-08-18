import AdminLayout from '@/layouts/admin/admin-layout';
import { compressImage } from '@/utils/image-compress';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    ChevronDown,
    FolderTree,
    Image as ImageIcon,
    Loader2,
    X,
} from 'lucide-react';
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
        image: File | null;
    }>({
        name: category.name,
        description: category.description || '',
        parent_id: category.parent_id,
        is_active: category.is_active,
        is_featured: category.is_featured || false,
        image: null,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(
        category.image_url,
    );
    const [removeCurrentImage, setRemoveCurrentImage] = useState(false);
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
                    console.error('Form errors:', errors);
                },
            },
        );
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Kategori', href: '/admin/categories' },
                {
                    title: 'Edit Kategori',
                    href: `/admin/categories/${category.id}/edit`,
                },
            ]}
        >
            <Head title={`Edit: ${category.name}`} />

            <div className="mx-auto space-y-6">
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
                            Edit Kategori
                        </h1>
                        <p className="mt-1 text-terra-500">{category.name}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                        <div className="space-y-6">
                            {/* Parent Category Selection */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-terra-700">
                                    Kategori Induk
                                </label>
                                <p className="mb-3 text-sm text-terra-500">
                                    Pilih kategori induk jika ini adalah
                                    sub-kategori. Kosongkan jika ini adalah
                                    kategori utama.
                                </p>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <FolderTree className="h-5 w-5 text-terra-400" />
                                    </div>
                                    <select
                                        value={data.parent_id ?? ''}
                                        onChange={(e) =>
                                            setData(
                                                'parent_id',
                                                e.target.value
                                                    ? Number(e.target.value)
                                                    : null,
                                            )
                                        }
                                        className="w-full appearance-none rounded-xl border border-terra-200 bg-sand-50 py-3 pr-10 pl-10 text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                                    >
                                        <option value="">
                                            — Tidak ada (Kategori Utama) —
                                        </option>
                                        {parentCategories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                        <ChevronDown className="h-5 w-5 text-terra-400" />
                                    </div>
                                </div>
                                {errors.parent_id && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.parent_id}
                                    </p>
                                )}
                            </div>

                            {/* Category Name */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-terra-700">
                                    Nama Kategori *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all placeholder:text-terra-400 focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
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
                                    Deskripsi
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    rows={4}
                                    className="w-full resize-none rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all placeholder:text-terra-400 focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-terra-700">
                                    Gambar Kategori
                                </label>
                                <p className="mb-3 text-sm text-terra-500">
                                    Gambar ini akan ditampilkan di section
                                    "Ruangan Pilihan" pada halaman utama.
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
                                            Mengompres gambar...
                                        </p>
                                        <p className="text-xs text-terra-400">
                                            Mohon tunggu sebentar
                                        </p>
                                    </div>
                                ) : (
                                    <label className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-terra-300 transition-all hover:border-terra-400 hover:bg-terra-50/50">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <ImageIcon className="mb-3 h-10 w-10 text-terra-400" />
                                            <p className="mb-2 text-sm text-terra-500">
                                                <span className="font-semibold">
                                                    Klik untuk upload
                                                </span>{' '}
                                                atau drag and drop
                                            </p>
                                            <p className="text-xs text-terra-400">
                                                PNG, JPG atau WEBP (otomatis
                                                dikompres ke 2MB)
                                            </p>
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

                            {/* Checkboxes */}
                            <div className="space-y-3">
                                <label className="flex cursor-pointer items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) =>
                                            setData(
                                                'is_active',
                                                e.target.checked,
                                            )
                                        }
                                        className="h-5 w-5 rounded border-terra-300 text-terra-900 focus:ring-wood"
                                    />
                                    <span className="text-terra-700">
                                        Kategori Aktif
                                    </span>
                                </label>

                                <label className="flex cursor-pointer items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={data.is_featured}
                                        onChange={(e) =>
                                            setData(
                                                'is_featured',
                                                e.target.checked,
                                            )
                                        }
                                        className="h-5 w-5 rounded border-terra-300 text-terra-900 focus:ring-wood"
                                    />
                                    <div>
                                        <span className="text-terra-700">
                                            Kategori Unggulan
                                        </span>
                                        <p className="text-xs text-terra-500">
                                            Tampilkan di section "Ruangan
                                            Pilihan" pada homepage
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4">
                        <Link
                            href="/admin/categories"
                            className="rounded-xl border border-terra-200 px-6 py-3 font-medium text-terra-700 transition-colors hover:bg-terra-50"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl bg-terra-900 px-6 py-3 font-medium text-white transition-colors hover:bg-wood-dark disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
