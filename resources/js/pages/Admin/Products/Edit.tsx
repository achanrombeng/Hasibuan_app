import ImageCropDialog from '@/components/ImageCropDialog';
import { Combobox } from '@/components/ui/combobox';
import AdminLayout from '@/layouts/admin/admin-layout';
import { compressImage } from '@/utils/image-compress';
import { Head, Link, router, useForm } from '@inertiajs/react';
import MDEditor from '@uiw/react-md-editor';
import {
    ArrowLeft,
    Crop,
    Globe,
    Loader2,
    Plus,
    Save,
    Star,
    Trash2,
    Upload,
    X,
} from 'lucide-react';
import { useRef, useState } from 'react';

interface Category {
    id: number;
    name: string;
}

interface ProductImage {
    id: number;
    image_url: string;
    url: string;
    alt_text: string | null;
    is_primary: boolean;
}

interface StatusOption {
    value: string;
    name: string;
}

interface SaleTypeOption {
    value: string;
    name: string;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    sku: string;
    short_description: string | null;
    description: string | null;
    price: number;
    compare_price: number | null;
    cost_price: number | null;
    discount_percentage: number | null;
    discount_starts_at: string | null;
    discount_ends_at: string | null;
    stock_quantity: number;
    low_stock_threshold: number;
    track_stock: boolean;
    allow_backorder: boolean;
    is_pre_order: boolean;
    weight: number | null;
    dimensions: { length?: number; width?: number; height?: number } | null;
    shipping_class: string | null;
    material: string | null;
    color: string | null;
    specifications: Record<string, string> | null;
    category_id: number | null;
    status: { value: string; label: string };
    sale_type: { value: string; label: string };
    is_featured: boolean;
    is_new_arrival: boolean;
    meta_title: string | null;
    meta_description: string | null;
    meta_keywords: string | null;
    images: ProductImage[];
}

interface EditProductProps {
    product: Product;
    categories: Category[];
    statuses: StatusOption[];
    saleTypes: SaleTypeOption[];
}

function toDatetimeLocal(iso: string | null): string {
    if (!iso) return '';
    try {
        const d = new Date(iso);
        const pad = (n: number) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
        return '';
    }
}

export default function EditProduct({
    product,
    categories,
    statuses,
    saleTypes,
}: EditProductProps) {
    const [existingImages, setExistingImages] = useState<ProductImage[]>(
        product.images || [],
    );
    const [primaryImageId, setPrimaryImageId] = useState<number | null>(
        product.images?.find((img) => img.is_primary)?.id ?? null,
    );
    const [newImages, setNewImages] = useState<
        { file: File; preview: string }[]
    >([]);
    const [deleteImageIds, setDeleteImageIds] = useState<number[]>([]);
    const [isCompressing, setIsCompressing] = useState(false);
    const [specifications, setSpecifications] = useState<
        { key: string; value: string }[]
    >(
        Array.isArray(product.specifications)
            ? product.specifications
                  .map((item: any) =>
                      typeof item === 'object' && item !== null && 'key' in item
                          ? { key: String(item.key), value: String(item.value) }
                          : { key: '', value: '' },
                  )
                  .filter((s) => s.key !== '')
            : product.specifications && typeof product.specifications === 'object'
              ? Object.entries(product.specifications).map(([key, value]) => ({
                    key,
                    value:
                        typeof value === 'object' && value !== null
                            ? String((value as any).value || '')
                            : String(value),
                }))
              : [],
    );
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const { data, setData, processing, errors } = useForm({
        name: product.name,
        sku: product.sku,
        category_id: String(product.category_id || ''),
        short_description: product.short_description || '',
        description: product.description || '',
        price: String(product.price),
        compare_price: product.compare_price
            ? String(product.compare_price)
            : '',
        cost_price: product.cost_price ? String(product.cost_price) : '',
        stock_quantity: String(product.stock_quantity),
        low_stock_threshold: String(product.low_stock_threshold),
        track_stock: product.track_stock,
        allow_backorder: product.allow_backorder,
        is_pre_order: product.is_pre_order ?? false,
        weight: product.weight ? String(product.weight) : '',
        length: product.dimensions?.length
            ? String(product.dimensions.length)
            : '',
        width: product.dimensions?.width
            ? String(product.dimensions.width)
            : '',
        height: product.dimensions?.height
            ? String(product.dimensions.height)
            : '',
        shipping_class: product.shipping_class || '',
        material: product.material || '',
        color: product.color || '',
        status: product.status.value,
        sale_type: product.sale_type?.value || 'regular',
        is_featured: product.is_featured,
        is_new_arrival: product.is_new_arrival ?? false,
        discount_percentage: product.discount_percentage
            ? String(product.discount_percentage)
            : '',
        discount_starts_at: toDatetimeLocal(product.discount_starts_at),
        discount_ends_at: toDatetimeLocal(product.discount_ends_at),
        meta_title: product.meta_title || '',
        meta_description: product.meta_description || '',
        meta_keywords: product.meta_keywords || '',
    });

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const files = e.target.files;
        if (!files) return;

        setIsCompressing(true);
        try {
            const fileArray = Array.from(files);
            const compressedImages = await Promise.all(
                fileArray.map(async (file) => {
                    const compressedFile = await compressImage(file, {
                        maxSizeMB: 2,
                    });
                    return {
                        file: compressedFile,
                        preview: URL.createObjectURL(compressedFile),
                    };
                }),
            );
            setNewImages((prev) => [...prev, ...compressedImages]);
        } catch (error) {
            console.error('Error compressing images:', error);
        } finally {
            setIsCompressing(false);
        }
    };

    const removeExistingImage = (imageId: number) => {
        setDeleteImageIds((prev) => [...prev, imageId]);
        setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
        if (primaryImageId === imageId) {
            const remaining = existingImages.filter(
                (img) => img.id !== imageId,
            );
            setPrimaryImageId(remaining.length > 0 ? remaining[0].id : null);
        }
    };

    const removeNewImage = (index: number) => {
        setNewImages((prev) => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return updated;
        });
    };

    type CropTarget =
        | { kind: 'new'; index: number; file: File }
        | { kind: 'existing'; id: number; file: File };

    const [cropTarget, setCropTarget] = useState<CropTarget | null>(null);
    const [preparingCrop, setPreparingCrop] = useState(false);

    const openCropForNew = (index: number) => {
        const item = newImages[index];
        if (!item) return;
        setCropTarget({ kind: 'new', index, file: item.file });
    };

    const openCropForExisting = async (img: ProductImage) => {
        setPreparingCrop(true);
        try {
            const src = img.image_url || img.url;
            const response = await fetch(src, { credentials: 'same-origin' });
            if (!response.ok) throw new Error('Gagal memuat gambar');
            const blob = await response.blob();
            const ext = (blob.type.split('/')[1] || 'jpg').split('+')[0];
            const file = new File(
                [blob],
                `existing-${img.id}.${ext}`,
                { type: blob.type || 'image/jpeg' },
            );
            setCropTarget({ kind: 'existing', id: img.id, file });
        } catch (error) {
            console.error('Failed to load existing image for crop:', error);
        } finally {
            setPreparingCrop(false);
        }
    };

    const handleCropped = async (croppedFile: File) => {
        if (!cropTarget) return;
        const compressed = await compressImage(croppedFile, { maxSizeMB: 2 });

        if (cropTarget.kind === 'new') {
            const idx = cropTarget.index;
            setNewImages((prev) => {
                const next = [...prev];
                const current = next[idx];
                if (!current) return prev;
                URL.revokeObjectURL(current.preview);
                next[idx] = {
                    file: compressed,
                    preview: URL.createObjectURL(compressed),
                };
                return next;
            });
            return;
        }

        const existingId = cropTarget.id;
        setNewImages((prev) => [
            ...prev,
            {
                file: compressed,
                preview: URL.createObjectURL(compressed),
            },
        ]);
        setDeleteImageIds((prev) =>
            prev.includes(existingId) ? prev : [...prev, existingId],
        );
        setExistingImages((prev) => prev.filter((img) => img.id !== existingId));
        if (primaryImageId === existingId) {
            setPrimaryImageId(null);
        }
    };

    const addSpecification = () => {
        setSpecifications((prev) => [...prev, { key: '', value: '' }]);
    };

    const removeSpecification = (index: number) => {
        setSpecifications((prev) => prev.filter((_, i) => i !== index));
    };

    const updateSpecification = (
        index: number,
        field: 'key' | 'value',
        value: string,
    ) => {
        setSpecifications((prev) =>
            prev.map((spec, i) =>
                i === index ? { ...spec, [field]: value } : spec,
            ),
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        const formData = new FormData();
        formData.append('_method', 'PUT');

        formData.append('name', data.name);
        formData.append('sku', data.sku);
        formData.append('category_id', data.category_id);
        if (data.short_description)
            formData.append('short_description', data.short_description);
        if (data.description)
            formData.append('description', data.description);
        if (data.price)
            formData.append('price', data.price);
        if (data.compare_price)
            formData.append('compare_price', data.compare_price);
        if (data.cost_price)
            formData.append('cost_price', data.cost_price);
        if (data.stock_quantity)
            formData.append('stock_quantity', data.stock_quantity);
        if (data.low_stock_threshold)
            formData.append('low_stock_threshold', data.low_stock_threshold);
        formData.append('track_stock', data.track_stock ? '1' : '0');
        formData.append('allow_backorder', data.allow_backorder ? '1' : '0');
        formData.append('is_pre_order', data.is_pre_order ? '1' : '0');
        if (data.weight) formData.append('weight', data.weight);
        if (data.length) formData.append('length', data.length);
        if (data.width) formData.append('width', data.width);
        if (data.height) formData.append('height', data.height);
        if (data.shipping_class)
            formData.append('shipping_class', data.shipping_class);
        if (data.material) formData.append('material', data.material);
        if (data.color) formData.append('color', data.color);

        // Build specifications object
        const specsObj: Record<string, string> = {};
        specifications.forEach((spec) => {
            if (spec.key.trim() && spec.value.trim()) {
                specsObj[spec.key.trim()] = spec.value.trim();
            }
        });
        if (Object.keys(specsObj).length > 0) {
            formData.append('specifications', JSON.stringify(specsObj));
        }

        formData.append('status', data.status);
        formData.append('sale_type', data.sale_type);
        formData.append('is_featured', data.is_featured ? '1' : '0');
        formData.append('is_new_arrival', data.is_new_arrival ? '1' : '0');
        if (data.discount_percentage)
            formData.append('discount_percentage', data.discount_percentage);
        if (data.discount_starts_at)
            formData.append('discount_starts_at', data.discount_starts_at);
        if (data.discount_ends_at)
            formData.append('discount_ends_at', data.discount_ends_at);
        if (data.meta_title) formData.append('meta_title', data.meta_title);
        if (data.meta_description)
            formData.append('meta_description', data.meta_description);
        if (data.meta_keywords)
            formData.append('meta_keywords', data.meta_keywords);

        if (primaryImageId) {
            formData.append('primary_image_id', String(primaryImageId));
        }

        newImages.forEach((img) => {
            formData.append('images[]', img.file);
        });

        deleteImageIds.forEach((id) => {
            formData.append('delete_images[]', String(id));
        });

        router.post(`/admin/products/${product.id}`, formData, {
            forceFormData: true,
            onSuccess: () => {
                router.visit('/admin/products');
            },
            onError: (errs) => {
                setIsSubmitting(false);
                const firstErr = Object.values(errs)[0];
                setSubmitError(
                    typeof firstErr === 'string'
                        ? firstErr
                        : 'Terjadi kesalahan saat menyimpan perubahan. Silakan periksa kembali data formulir.',
                );
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    const inputClass =
        'w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all placeholder:text-terra-400 focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none';
    const labelClass = 'mb-2 block text-sm font-medium text-terra-700';

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Products', href: '/admin/products' },
                {
                    title: 'Edit Product',
                    href: `/admin/products/${product.id}/edit`,
                },
            ]}
        >
            <Head title={`Edit: ${product.name}`} />

            <div className="mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/products"
                        className="rounded-lg p-2 text-terra-600 transition-colors hover:bg-terra-100"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-terra-900">
                            Edit Product
                        </h1>
                        <p className="mt-1 text-terra-500">{product.name}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {submitError && (
                        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            <span>{submitError}</span>
                            <button
                                type="button"
                                onClick={() => setSubmitError(null)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                    {/* 1. General Information */}
                    <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-terra-900">
                            General Information
                        </h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className={labelClass}>
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className={inputClass}
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className={labelClass}>SKU *</label>
                                <input
                                    type="text"
                                    value={data.sku}
                                    onChange={(e) =>
                                        setData('sku', e.target.value)
                                    }
                                    className={inputClass}
                                />
                                {errors.sku && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.sku}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className={labelClass}>
                                    Category *
                                </label>
                                <Combobox
                                    options={categories.map((cat) => ({
                                        value: String(cat.id),
                                        label: cat.name,
                                    }))}
                                    value={data.category_id}
                                    onChange={(val) =>
                                        setData('category_id', val)
                                    }
                                    placeholder="Select category"
                                    searchPlaceholder="Search category..."
                                    emptyText="No category found."
                                />
                                {errors.category_id && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.category_id}
                                    </p>
                                )}
                            </div>
                            <div className="md:col-span-2">
                                <label className={labelClass}>
                                    Short Description
                                </label>
                                <div data-color-mode="light">
                                    <MDEditor
                                        value={data.short_description}
                                        onChange={(val) =>
                                            setData(
                                                'short_description',
                                                (val || '').slice(0, 500),
                                            )
                                        }
                                        height={180}
                                        preview="edit"
                                    />
                                </div>
                                <p className="mt-1 text-right text-xs text-terra-400">
                                    {data.short_description.length}/500
                                </p>
                            </div>
                            <div className="md:col-span-2">
                                <label className={labelClass}>
                                    Full Description
                                </label>
                                <div data-color-mode="light">
                                    <MDEditor
                                        value={data.description}
                                        onChange={(val) =>
                                            setData('description', val || '')
                                        }
                                        height={350}
                                        preview="edit"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. Product Specifications */}
                    <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-terra-900">
                            Product Specifications
                        </h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label className={labelClass}>Material</label>
                                <input
                                    type="text"
                                    value={data.material}
                                    onChange={(e) =>
                                        setData('material', e.target.value)
                                    }
                                    className={inputClass}
                                    placeholder="Teak Wood, Natural Rattan, etc."
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Color</label>
                                <input
                                    type="text"
                                    value={data.color}
                                    onChange={(e) =>
                                        setData('color', e.target.value)
                                    }
                                    className={inputClass}
                                    placeholder="Dark Brown, Natural, Gold, etc."
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Weight (kg)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.weight}
                                    onChange={(e) =>
                                        setData('weight', e.target.value)
                                    }
                                    className={inputClass}
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>
                                    Dimensions (cm)
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.length}
                                        onChange={(e) =>
                                            setData('length', e.target.value)
                                        }
                                        className={inputClass}
                                        placeholder="Length"
                                    />
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.width}
                                        onChange={(e) =>
                                            setData('width', e.target.value)
                                        }
                                        className={inputClass}
                                        placeholder="Width"
                                    />
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.height}
                                        onChange={(e) =>
                                            setData('height', e.target.value)
                                        }
                                        className={inputClass}
                                        placeholder="Height"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Additional Specification Details */}
                        <div className="mt-6 border-t border-terra-100 pt-6">
                            <div className="mb-3 flex items-center justify-between">
                                <label className={labelClass + ' mb-0'}>
                                    Additional Specifications
                                </label>
                                <button
                                    type="button"
                                    onClick={addSpecification}
                                    className="flex items-center gap-1 rounded-lg bg-terra-100 px-3 py-1.5 text-sm text-terra-700 transition-colors hover:bg-terra-200"
                                >
                                    <Plus className="h-4 w-4" /> Add Spec
                                </button>
                            </div>
                            {specifications.length > 0 ? (
                                <div className="space-y-3">
                                    {specifications.map((spec, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3"
                                        >
                                            <input
                                                type="text"
                                                value={spec.key}
                                                onChange={(e) =>
                                                    updateSpecification(
                                                        index,
                                                        'key',
                                                        e.target.value,
                                                    )
                                                }
                                                className={inputClass}
                                                placeholder="Key (e.g. Finishing)"
                                            />
                                            <input
                                                type="text"
                                                value={spec.value}
                                                onChange={(e) =>
                                                    updateSpecification(
                                                        index,
                                                        'value',
                                                        e.target.value,
                                                    )
                                                }
                                                className={inputClass}
                                                placeholder="Value (e.g. Melamine Coated)"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeSpecification(index)
                                                }
                                                className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-terra-400">
                                    No additional specifications yet. Click "Add Spec" to add one.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* 6. Media */}
                    <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-terra-900">
                            Media
                        </h2>
                        <div className="space-y-4">
                            {/* Existing Images */}
                            {existingImages.length > 0 && (
                                <div>
                                    <p className="mb-3 text-sm text-terra-500">
                                        Current Images — Click image to set as primary, hover to crop or delete
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                        {existingImages.map((img) => (
                                            <div
                                                key={img.id}
                                                className={`group relative cursor-pointer rounded-xl border-2 transition-colors ${
                                                    primaryImageId === img.id
                                                        ? 'border-wood'
                                                        : 'border-terra-100 hover:border-terra-300'
                                                }`}
                                                onClick={() =>
                                                    setPrimaryImageId(img.id)
                                                }
                                            >
                                                <img
                                                    src={
                                                        img.image_url || img.url
                                                    }
                                                    alt="Product"
                                                    className="aspect-square w-full rounded-xl object-cover"
                                                />
                                                {primaryImageId === img.id && (
                                                    <span className="absolute top-2 left-2 flex items-center gap-1 rounded-lg bg-wood px-2 py-1 text-xs text-white">
                                                        <Star className="h-3 w-3" />{' '}
                                                        Primary
                                                    </span>
                                                )}
                                                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                                                    <button
                                                        type="button"
                                                        title="Edit / Crop"
                                                        disabled={preparingCrop}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openCropForExisting(
                                                                img,
                                                            );
                                                        }}
                                                        className="rounded-lg bg-white/90 p-1.5 text-terra-700 shadow-sm transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <Crop className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        title="Delete"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeExistingImage(
                                                                img.id,
                                                            );
                                                        }}
                                                        className="rounded-lg bg-red-500 p-1.5 text-white shadow-sm transition-colors hover:bg-red-600"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Upload Area */}
                            <div
                                className={`cursor-pointer rounded-xl border-2 border-dashed border-terra-200 p-8 text-center transition-colors hover:border-wood ${isCompressing ? 'pointer-events-none opacity-50' : ''}`}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    disabled={isCompressing}
                                />
                                {isCompressing ? (
                                    <>
                                        <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-terra-400" />
                                        <p className="font-medium text-terra-700">
                                            Compressing image...
                                        </p>
                                        <p className="mt-1 text-sm text-terra-400">
                                            Please wait a moment
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="mx-auto mb-4 h-12 w-12 text-terra-400" />
                                        <p className="font-medium text-terra-700">
                                            Click to upload new images
                                        </p>
                                        <p className="mt-1 text-sm text-terra-400">
                                            PNG, JPG, WEBP (auto-compressed to 2MB)
                                        </p>
                                        <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-wood/20 bg-wood/5 px-3 py-1 text-xs text-wood">
                                            <span className="font-semibold">Recommended size:</span> 1000 × 1000 px (1:1 ratio) or 1000 × 1250 px (4:5 ratio)
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* New Images Preview */}
                            {newImages.length > 0 && (
                                <div>
                                    <p className="mb-3 text-sm text-terra-500">
                                        New Images
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                        {newImages.map((img, index) => (
                                            <div
                                                key={index}
                                                className="group relative"
                                            >
                                                <img
                                                    src={img.preview}
                                                    alt={`New ${index + 1}`}
                                                    className="aspect-square w-full rounded-xl border border-terra-100 object-cover"
                                                />
                                                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                                                    <button
                                                        type="button"
                                                        title="Edit / Crop"
                                                        onClick={() =>
                                                            openCropForNew(
                                                                index,
                                                            )
                                                        }
                                                        className="rounded-lg bg-white/90 p-1.5 text-terra-700 shadow-sm transition-colors hover:bg-white"
                                                    >
                                                        <Crop className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        title="Delete"
                                                        onClick={() =>
                                                            removeNewImage(
                                                                index,
                                                            )
                                                        }
                                                        className="rounded-lg bg-red-500 p-1.5 text-white shadow-sm transition-colors hover:bg-red-600"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 7. Product Status */}
                    <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-terra-900">
                            Publishing Status
                        </h2>
                        <div>
                            <label className={labelClass}>
                                Product Publication Status
                            </label>
                            <Combobox
                                options={statuses.filter((s) => ['active', 'draft'].includes(s.value)).map((s) => ({
                                    value: s.value,
                                    label: s.name,
                                }))}
                                value={data.status}
                                onChange={(val) =>
                                    setData('status', val)
                                }
                                placeholder="Select status"
                                searchPlaceholder="Search status..."
                                emptyText="No status found."
                            />
                        </div>
                    </div>

                    {/* 8. SEO */}
                    <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-2">
                            <Globe className="h-5 w-5 text-terra-500" />
                            <h2 className="text-lg font-semibold text-terra-900">
                                SEO
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className={labelClass}>
                                    Meta Title
                                </label>
                                <input
                                    type="text"
                                    value={data.meta_title}
                                    onChange={(e) =>
                                        setData('meta_title', e.target.value)
                                    }
                                    className={inputClass}
                                    placeholder="Page title for search engines"
                                    maxLength={60}
                                />
                                <p className="mt-1 text-right text-xs text-terra-400">
                                    {data.meta_title.length}/60
                                </p>
                            </div>
                            <div>
                                <label className={labelClass}>
                                    Meta Description
                                </label>
                                <textarea
                                    value={data.meta_description}
                                    onChange={(e) =>
                                        setData(
                                            'meta_description',
                                            e.target.value,
                                        )
                                    }
                                    rows={2}
                                    className={inputClass + ' resize-none'}
                                    placeholder="Short description for search engines"
                                    maxLength={160}
                                />
                                <p className="mt-1 text-right text-xs text-terra-400">
                                    {data.meta_description.length}/160
                                </p>
                            </div>
                            <div>
                                <label className={labelClass}>
                                    Meta Keywords
                                </label>
                                <input
                                    type="text"
                                    value={data.meta_keywords}
                                    onChange={(e) =>
                                        setData(
                                            'meta_keywords',
                                            e.target.value,
                                        )
                                    }
                                    className={inputClass}
                                    placeholder="keyword 1, keyword 2, keyword 3"
                                />
                                <p className="mt-1 text-xs text-terra-400">
                                    Separate with commas
                                </p>
                            </div>

                            {/* SERP Preview */}
                            {(data.meta_title || data.name) && (
                                <div className="rounded-xl bg-sand-50 p-4">
                                    <p className="mb-2 text-xs font-medium text-terra-500">
                                        Google Search Preview
                                    </p>
                                    <div className="space-y-1">
                                        <p className="truncate text-lg text-blue-700">
                                            {data.meta_title || data.name}
                                        </p>
                                        <p className="text-sm text-green-700">
                                            ronica.com/shop/products/
                                            {product.slug}
                                        </p>
                                        <p className="line-clamp-2 text-sm text-terra-600">
                                            {data.meta_description ||
                                                data.short_description ||
                                                'Product description will appear here...'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sticky Submit Bar */}
                    <div className="sticky bottom-6 z-30 flex items-center justify-between rounded-2xl border border-neutral-200/80 bg-white/90 px-6 py-4 shadow-xl backdrop-blur-md">
                        <span className="hidden text-xs font-medium text-neutral-500 sm:inline">
                            Please ensure product details and specifications are accurate before saving
                        </span>
                        <div className="ml-auto flex items-center gap-3">
                            <Link
                                href="/admin/products"
                                className="rounded-xl border border-neutral-200 bg-white px-6 py-3 font-medium text-neutral-700 transition-all hover:bg-neutral-50 active:scale-[0.98]"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitting || processing}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#a67c52] px-6 py-3 font-medium text-white shadow-md transition-all hover:bg-[#8e6843] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                            >
                                {isSubmitting || processing ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-5 w-5" />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <ImageCropDialog
                open={cropTarget !== null}
                file={cropTarget?.file ?? null}
                onClose={() => setCropTarget(null)}
                onCropped={handleCropped}
            />
        </AdminLayout>
    );
}
