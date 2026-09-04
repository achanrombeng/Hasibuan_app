import ImageCropDialog from '@/components/ImageCropDialog';
import { ConfirmDialog } from '@/components/ui/alert-dialog';
import { Combobox } from '@/components/ui/combobox';
import { useTranslation } from '@/hooks/use-translation';
import AdminLayout from '@/layouts/admin/admin-layout';
import { compressImage } from '@/utils/image-compress';
import { Head, Link, router, useForm } from '@inertiajs/react';
import MDEditor from '@uiw/react-md-editor';
import {
    AlertCircle,
    ArrowLeft,
    Crop,
    Globe,
    Loader2,
    Plus,
    Save,
    Sparkles,
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

interface StatusOption {
    value: string;
    name: string;
}

interface CreateProductProps {
    categories: Category[];
    statuses: StatusOption[];
}

export default function CreateProduct({
    categories,
    statuses,
}: CreateProductProps) {
    const [previewImages, setPreviewImages] = useState<
        { file: File; preview: string }[]
    >([]);
    const [primaryIndex, setPrimaryIndex] = useState(0);
    const [isCompressing, setIsCompressing] = useState(false);
    const [cropTargetIndex, setCropTargetIndex] = useState<number | null>(null);
    const [specifications, setSpecifications] = useState<
        { key: string; value: string }[]
    >([]);
    const [isExtracting, setIsExtracting] = useState(false);
    const [extractError, setExtractError] = useState<string | null>(null);
    const [extractSuccess, setExtractSuccess] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const autoExtractAfterUploadRef = useRef(false);

    const { data, setData, processing, errors } = useForm({
        name: '',
        sku: '',
        category_id: '',
        short_description: '',
        description: '',
        low_stock_threshold: '5',
        track_stock: true,
        allow_backorder: false,
        is_pre_order: false,
        weight: '',
        length: '',
        width: '',
        height: '',
        shipping_class: '',
        material: '',
        color: '',
        status: 'active',
        is_featured: false,
        is_new_arrival: false,
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
    });

    const triggerAiExtract = async (
        imagesToAnalyze: { file: File; preview: string }[],
        targetPrimaryIndex = 0,
    ) => {
        if (imagesToAnalyze.length === 0 || isExtracting) return;

        // Send up to 5 images with primary first; gives AI multi-angle context.
        const MAX_AI_IMAGES = 5;
        const orderedImages = [
            imagesToAnalyze[targetPrimaryIndex] ?? imagesToAnalyze[0],
            ...imagesToAnalyze.filter((_, i) => i !== targetPrimaryIndex),
        ].slice(0, MAX_AI_IMAGES);

        const csrfMeta =
            document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content') ?? '';

        const formData = new FormData();
        formData.append('_token', csrfMeta);
        orderedImages.forEach((img) => {
            formData.append('images[]', img.file);
        });

        // Send already-filled fields as context so AI uses them as reference.
        const contextFields: Array<keyof typeof data> = [
            'name',
            'category_id',
            'description',
            'short_description',
            'weight',
            'length',
            'width',
            'height',
            'shipping_class',
            'material',
            'color',
            'meta_title',
            'meta_description',
            'meta_keywords',
        ];
        contextFields.forEach((key) => {
            const value = String(data[key] ?? '').trim();
            if (value !== '') {
                formData.append(`context[${key}]`, value);
            }
        });

        // Send existing specifications so AI preserves them & adds new ones.
        specifications.forEach((spec, idx) => {
            const k = spec.key.trim();
            const v = spec.value.trim();
            if (k !== '' && v !== '') {
                formData.append(`context[specifications][${idx}][key]`, k);
                formData.append(`context[specifications][${idx}][value]`, v);
            }
        });

        setIsExtracting(true);
        setExtractError(null);
        setExtractSuccess(false);

        try {
            const response = await fetch('/admin/products/ai-extract', {
                method: 'POST',
                body: formData,
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfMeta,
                },
                credentials: 'same-origin',
            });

            const payload = await response.json().catch(() => ({}));

            if (!response.ok) {
                // Prefer specific validation error over the generic "data invalid" message.
                const firstValidationError =
                    payload?.errors && typeof payload.errors === 'object'
                        ? (Object.values(payload.errors).flat()[0] as
                              | string
                              | undefined)
                        : undefined;

                throw new Error(
                    firstValidationError ??
                        payload?.message ??
                        'Gagal menganalisis gambar. Silakan coba lagi.',
                );
            }

            const extracted = payload?.data ?? {};

            // Only fill fields that are currently empty — never overwrite user input.
            const preferExisting = (
                current: string,
                incoming: string | undefined,
            ) => (current.trim() !== '' ? current : incoming || current);

            setData((prev) => ({
                ...prev,
                name: preferExisting(prev.name, extracted.name),
                sku: preferExisting(prev.sku, extracted.sku),
                category_id: preferExisting(
                    prev.category_id,
                    extracted.category_id,
                ),
                description: preferExisting(
                    prev.description,
                    extracted.description,
                ),
                short_description: preferExisting(
                    prev.short_description,
                    extracted.short_description,
                ),
                weight: preferExisting(prev.weight, extracted.weight),
                length: preferExisting(prev.length, extracted.length),
                width: preferExisting(prev.width, extracted.width),
                height: preferExisting(prev.height, extracted.height),
                shipping_class: preferExisting(
                    prev.shipping_class,
                    extracted.shipping_class,
                ),
                material: preferExisting(prev.material, extracted.material),
                color: preferExisting(prev.color, extracted.color),
                meta_title: preferExisting(
                    prev.meta_title,
                    extracted.meta_title,
                ),
                meta_description: preferExisting(
                    prev.meta_description,
                    extracted.meta_description,
                ),
                meta_keywords: preferExisting(
                    prev.meta_keywords,
                    extracted.meta_keywords,
                ),
            }));

            if (
                Array.isArray(extracted.specifications) &&
                extracted.specifications.length > 0
            ) {
                setSpecifications((prev) => {
                    const existingKeys = new Set(
                        prev.map((s) => s.key.toLowerCase().trim()),
                    );
                    const newSpecs = extracted.specifications.filter(
                        (s: { key: string; value: string }) =>
                            !existingKeys.has(s.key.toLowerCase().trim()),
                    );
                    return [...prev, ...newSpecs];
                });
            }

            setExtractSuccess(true);
        } catch (err: unknown) {
            const msg =
                err instanceof Error
                    ? err.message
                    : 'Gagal menganalisis gambar. Silakan coba lagi.';
            setExtractError(msg);
        } finally {
            setIsExtracting(false);
        }
    };

    const handleAiExtract = () => {
        if (previewImages.length === 0) {
            autoExtractAfterUploadRef.current = true;
            fileInputRef.current?.click();
            return;
        }
        triggerAiExtract(previewImages, primaryIndex);
    };

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

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

            const shouldAutoExtract = autoExtractAfterUploadRef.current;
            autoExtractAfterUploadRef.current = false;

            setPreviewImages((prev) => {
                const updated = [...prev, ...compressedImages];
                if (shouldAutoExtract && updated.length > 0) {
                    setTimeout(() => {
                        triggerAiExtract(updated, primaryIndex);
                    }, 100);
                }
                return updated;
            });
        } catch (error) {
            console.error('Error compressing images:', error);
        } finally {
            setIsCompressing(false);
        }
    };

    const removeImage = (index: number) => {
        setPreviewImages((prev) => {
            const newImages = [...prev];
            URL.revokeObjectURL(newImages[index].preview);
            newImages.splice(index, 1);
            return newImages;
        });
        if (primaryIndex === index) {
            setPrimaryIndex(0);
        } else if (primaryIndex > index) {
            setPrimaryIndex(primaryIndex - 1);
        }
    };

    const handleCropped = async (croppedFile: File) => {
        if (cropTargetIndex === null) return;
        const compressed = await compressImage(croppedFile, { maxSizeMB: 2 });
        setPreviewImages((prev) => {
            const next = [...prev];
            const current = next[cropTargetIndex];
            if (!current) return prev;
            URL.revokeObjectURL(current.preview);
            next[cropTargetIndex] = {
                file: compressed,
                preview: URL.createObjectURL(compressed),
            };
            return next;
        });
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
        setShowConfirmDialog(true);
    };

    const confirmSave = () => {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('sku', data.sku);
        formData.append('category_id', data.category_id);
        formData.append('short_description', data.short_description);
        formData.append('description', data.description);
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
        formData.append('is_featured', data.is_featured ? '1' : '0');
        formData.append('is_new_arrival', data.is_new_arrival ? '1' : '0');
        if (data.meta_title) formData.append('meta_title', data.meta_title);
        if (data.meta_description)
            formData.append('meta_description', data.meta_description);
        if (data.meta_keywords)
            formData.append('meta_keywords', data.meta_keywords);

        previewImages.forEach((img) => {
            formData.append('images[]', img.file);
        });

        router.post('/admin/products', formData, {
            forceFormData: true,
            onError: (errors) => {
                setIsSubmitting(false);
                setShowConfirmDialog(false);
                console.error('Form errors:', errors);
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
                { title: 'Add Product', href: '/admin/products/create' },
            ]}
        >
            <Head title="Add Product" />

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
                            Add New Product
                        </h1>
                        <p className="mt-1 text-terra-500">
                            Fill in the product details below
                        </p>
                    </div>
                </div>



                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 1. Media */}
                    <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                            <h2 className="text-lg font-semibold text-terra-900">
                                Media
                            </h2>
                            <span className="text-xs text-terra-500">
                                PNG, JPG, WEBP (auto-compressed to 2MB)
                            </span>
                        </div>

                        <div className="space-y-4">
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
                                            Click to upload image
                                        </p>
                                        <p className="mt-1 text-sm text-terra-400">
                                            PNG, JPG, WEBP (auto-compressed to 2MB).
                                            Click image to set as primary, hover to crop or delete.
                                        </p>
                                        <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-wood/20 bg-wood/5 px-3 py-1 text-xs text-wood">
                                            <span className="font-semibold">Recommended size:</span> 1000 × 1000 px (1:1 ratio) or 1000 × 1250 px (4:5 ratio)
                                        </div>
                                    </>
                                )}
                            </div>

                            {previewImages.length > 0 && (
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                    {previewImages.map((img, index) => (
                                        <div
                                            key={index}
                                            className={`group relative cursor-pointer rounded-xl border-2 transition-colors ${
                                                index === primaryIndex
                                                    ? 'border-wood'
                                                    : 'border-terra-100 hover:border-terra-300'
                                            }`}
                                            onClick={() =>
                                                setPrimaryIndex(index)
                                            }
                                        >
                                            <img
                                                src={img.preview}
                                                alt={`Preview ${index + 1}`}
                                                className="aspect-square w-full rounded-xl object-cover"
                                            />
                                            {index === primaryIndex && (
                                                <span className="absolute top-2 left-2 flex items-center gap-1 rounded-lg bg-wood px-2 py-1 text-xs text-white">
                                                    <Star className="h-3 w-3" />{' '}
                                                    Primary
                                                </span>
                                            )}
                                            <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                                                <button
                                                    type="button"
                                                    title="Edit / Crop"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setCropTargetIndex(
                                                            index,
                                                        );
                                                    }}
                                                    className="rounded-lg bg-white/90 p-1.5 text-terra-700 shadow-sm transition-colors hover:bg-white"
                                                >
                                                    <Crop className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    title="Delete"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeImage(index);
                                                    }}
                                                    className="rounded-lg bg-red-500 p-1.5 text-white shadow-sm transition-colors hover:bg-red-600"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 2. General Information */}
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
                                    placeholder="Enter product name"
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
                                    placeholder="KRS-001"
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
                                {errors.short_description && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.short_description}
                                    </p>
                                )}
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
                            {specifications.length > 0 && (
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
                            )}
                            {specifications.length === 0 && (
                                <p className="text-sm text-terra-400">
                                    No additional specifications yet. Click "Add Spec" to add one.
                                </p>
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
                                            {data.name
                                                .toLowerCase()
                                                .replace(/\s+/g, '-') ||
                                                'new-product'}
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
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#a67c52] px-6 py-3 font-medium text-white shadow-md transition-all hover:bg-[#8e6843] active:scale-[0.98] disabled:opacity-50"
                            >
                                <Save className="h-5 w-5" />
                                {processing ? 'Saving...' : 'Save Product'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <ImageCropDialog
                open={cropTargetIndex !== null}
                file={
                    cropTargetIndex !== null
                        ? (previewImages[cropTargetIndex]?.file ?? null)
                        : null
                }
                onClose={() => setCropTargetIndex(null)}
                onCropped={handleCropped}
            />

            {/* Confirm Save Product Dialog */}
            <ConfirmDialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
                title={t('admin.products.confirm_save_title')}
                description={t('admin.products.confirm_save_desc')}
                confirmText={t('admin.products.confirm_save_button')}
                cancelText={t('common.cancel')}
                variant="default"
                isLoading={isSubmitting}
                onConfirm={confirmSave}
            />
        </AdminLayout>
    );
}
