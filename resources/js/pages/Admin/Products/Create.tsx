import ImageCropDialog from '@/components/ImageCropDialog';
import { Combobox } from '@/components/ui/combobox';
import { Switch } from '@/components/ui/switch';
import AdminLayout from '@/layouts/admin/admin-layout';
import { compressImage } from '@/utils/image-compress';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Crop,
    Globe,
    Loader2,
    Plus,
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

interface SaleTypeOption {
    value: string;
    name: string;
}

interface CreateProductProps {
    categories: Category[];
    statuses: StatusOption[];
    saleTypes: SaleTypeOption[];
}

export default function CreateProduct({
    categories,
    statuses,
    saleTypes,
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
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, processing, errors } = useForm({
        name: '',
        sku: '',
        category_id: '',
        short_description: '',
        description: '',
        price: '',
        compare_price: '',
        cost_price: '',
        stock_quantity: '',
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
        sale_type: 'regular',
        is_featured: false,
        is_new_arrival: false,
        discount_percentage: '',
        discount_starts_at: '',
        discount_ends_at: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
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
            setPreviewImages((prev) => [...prev, ...compressedImages]);
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

    const marginPercentage =
        data.price && data.cost_price
            ? (
                  ((Number(data.price) - Number(data.cost_price)) /
                      Number(data.price)) *
                  100
              ).toFixed(1)
            : null;

    const handleAiExtract = async () => {
        if (previewImages.length === 0 || isExtracting) return;

        // Send up to 5 images with primary first; gives AI multi-angle context.
        const MAX_AI_IMAGES = 5;
        const orderedImages = [
            previewImages[primaryIndex] ?? previewImages[0],
            ...previewImages.filter((_, i) => i !== primaryIndex),
        ].slice(0, MAX_AI_IMAGES);

        const csrfMeta = document
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
            'price',
            'compare_price',
            'cost_price',
            'stock_quantity',
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
                price: preferExisting(prev.price, extracted.price),
                compare_price: preferExisting(
                    prev.compare_price,
                    extracted.compare_price,
                ),
                cost_price: preferExisting(
                    prev.cost_price,
                    extracted.cost_price,
                ),
                stock_quantity: preferExisting(
                    prev.stock_quantity,
                    extracted.stock_quantity,
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

            // Merge specs: keep user-filled rows, append AI rows whose key is new.
            if (Array.isArray(extracted.specifications)) {
                const incoming = extracted.specifications.filter(
                    (s: { key?: string; value?: string }) =>
                        typeof s?.key === 'string' &&
                        typeof s?.value === 'string' &&
                        s.key.trim() !== '' &&
                        s.value.trim() !== '',
                ) as { key: string; value: string }[];

                setSpecifications((prev) => {
                    const existingKeys = new Set(
                        prev
                            .map((s) => s.key.trim().toLowerCase())
                            .filter((k) => k !== ''),
                    );
                    const toAdd = incoming.filter(
                        (s) => !existingKeys.has(s.key.trim().toLowerCase()),
                    );
                    return [...prev, ...toAdd];
                });
            }

            setExtractSuccess(true);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Gagal menganalisis gambar.';
            setExtractError(message);
        } finally {
            setIsExtracting(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('sku', data.sku);
        formData.append('category_id', data.category_id);
        formData.append('short_description', data.short_description);
        formData.append('description', data.description);
        formData.append('price', data.price);
        if (data.compare_price)
            formData.append('compare_price', data.compare_price);
        if (data.cost_price) formData.append('cost_price', data.cost_price);
        formData.append('stock_quantity', data.stock_quantity);
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

        previewImages.forEach((img) => {
            formData.append('images[]', img.file);
        });

        router.post('/admin/products', formData, {
            forceFormData: true,
            onError: (errors) => {
                console.error('Form errors:', errors);
            },
        });
    };

    const inputClass =
        'w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all placeholder:text-terra-400 focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none';
    const labelClass = 'mb-2 block text-sm font-medium text-terra-700';

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Produk', href: '/admin/products' },
                { title: 'Tambah Produk', href: '/admin/products/create' },
            ]}
        >
            <Head title="Tambah Produk" />

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
                            Tambah Produk Baru
                        </h1>
                        <p className="mt-1 text-terra-500">
                            Isi detail produk di bawah ini
                        </p>
                    </div>
                </div>



                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 1. Media */}
                    <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-terra-900">
                            Media
                        </h2>
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
                                            Mengompres gambar...
                                        </p>
                                        <p className="mt-1 text-sm text-terra-400">
                                            Mohon tunggu sebentar
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="mx-auto mb-4 h-12 w-12 text-terra-400" />
                                        <p className="font-medium text-terra-700">
                                            Klik untuk upload gambar
                                        </p>
                                        <p className="mt-1 text-sm text-terra-400">
                                            PNG, JPG, WEBP (otomatis dikompres
                                            ke 2MB). Klik gambar untuk jadikan
                                            utama, hover untuk crop atau hapus.
                                        </p>
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
                                                    Utama
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
                                                    title="Hapus"
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

                    {/* 2. Informasi Umum */}
                    <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-terra-900">
                            Informasi Umum
                        </h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className={labelClass}>
                                    Nama Produk *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className={inputClass}
                                    placeholder="Masukkan nama produk"
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
                                    Kategori *
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
                                    placeholder="Pilih kategori"
                                    searchPlaceholder="Cari kategori..."
                                    emptyText="Kategori tidak ditemukan."
                                />
                                {errors.category_id && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.category_id}
                                    </p>
                                )}
                            </div>
                            <div className="md:col-span-2">
                                <label className={labelClass}>
                                    Deskripsi Singkat
                                </label>
                                <textarea
                                    value={data.short_description}
                                    onChange={(e) =>
                                        setData(
                                            'short_description',
                                            e.target.value.slice(0, 500),
                                        )
                                    }
                                    rows={2}
                                    className={inputClass + ' resize-none'}
                                    placeholder="Ringkasan singkat tentang produk..."
                                />
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
                                    Deskripsi Lengkap
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    rows={5}
                                    className={inputClass + ' resize-none'}
                                    placeholder="Deskripsi lengkap produk..."
                                />
                            </div>
                        </div>
                    </div>



                    {/* 3. Spesifikasi Produk */}
                    <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-terra-900">
                            Spesifikasi Produk
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
                                    placeholder="Kayu Jati, Rotan Alami, dll"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Warna</label>
                                <input
                                    type="text"
                                    value={data.color}
                                    onChange={(e) =>
                                        setData('color', e.target.value)
                                    }
                                    className={inputClass}
                                    placeholder="Coklat Tua, Natural, Gold, dll"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Berat (kg)</label>
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
                                    Dimensi (cm)
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
                                        placeholder="Panjang"
                                    />
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.width}
                                        onChange={(e) =>
                                            setData('width', e.target.value)
                                        }
                                        className={inputClass}
                                        placeholder="Lebar"
                                    />
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.height}
                                        onChange={(e) =>
                                            setData('height', e.target.value)
                                        }
                                        className={inputClass}
                                        placeholder="Tinggi"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Detail Spesifikasi Tambahan */}
                        <div className="mt-6 border-t border-terra-100 pt-6">
                            <div className="mb-3 flex items-center justify-between">
                                <label className={labelClass + ' mb-0'}>
                                    Detail Spesifikasi Tambahan
                                </label>
                                <button
                                    type="button"
                                    onClick={addSpecification}
                                    className="flex items-center gap-1 rounded-lg bg-terra-100 px-3 py-1.5 text-sm text-terra-700 transition-colors hover:bg-terra-200"
                                >
                                    <Plus className="h-4 w-4" /> Tambah Detail
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
                                                placeholder="Nama (cth: Finishing)"
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
                                                placeholder="Nilai (cth: Melamine Coated)"
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
                                    Belum ada detail spesifikasi. Klik tombol "Tambah Detail" untuk menambahkan.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* 7. Status Produk */}
                    <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-terra-900">
                            Status Publikasi
                        </h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label className={labelClass}>
                                    Status Publikasi Produk
                                </label>
                                <Combobox
                                    options={statuses.map((s) => ({
                                        value: s.value,
                                        label: s.name,
                                    }))}
                                    value={data.status}
                                    onChange={(val) =>
                                        setData('status', val)
                                    }
                                    placeholder="Pilih status"
                                    searchPlaceholder="Cari status..."
                                    emptyText="Status tidak ditemukan."
                                />
                            </div>
                            <div className="flex flex-col justify-end gap-3">
                                <label className="flex cursor-pointer items-center gap-3">
                                    <Switch
                                        checked={data.is_featured}
                                        onCheckedChange={(checked) =>
                                            setData('is_featured', checked)
                                        }
                                    />
                                    <span className="text-sm text-terra-700">
                                        Produk Unggulan
                                    </span>
                                </label>
                                <label className="flex cursor-pointer items-center gap-3">
                                    <Switch
                                        checked={data.is_new_arrival}
                                        onCheckedChange={(checked) =>
                                            setData('is_new_arrival', checked)
                                        }
                                    />
                                    <span className="text-sm text-terra-700">
                                        Produk Baru
                                    </span>
                                </label>
                            </div>
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
                                    placeholder="Judul halaman untuk mesin pencari"
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
                                    placeholder="Deskripsi singkat untuk mesin pencari"
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
                                    placeholder="kata kunci 1, kata kunci 2, kata kunci 3"
                                />
                                <p className="mt-1 text-xs text-terra-400">
                                    Pisahkan dengan koma
                                </p>
                            </div>

                            {/* SERP Preview */}
                            {(data.meta_title || data.name) && (
                                <div className="rounded-xl bg-sand-50 p-4">
                                    <p className="mb-2 text-xs font-medium text-terra-500">
                                        Preview Google
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
                                                'produk-baru'}
                                        </p>
                                        <p className="line-clamp-2 text-sm text-terra-600">
                                            {data.meta_description ||
                                                data.short_description ||
                                                'Deskripsi produk akan tampil di sini...'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4">
                        <Link
                            href="/admin/products"
                            className="rounded-xl border border-terra-200 px-6 py-3 font-medium text-terra-700 transition-colors hover:bg-terra-50"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl bg-terra-900 px-6 py-3 font-medium text-white transition-colors hover:bg-wood-dark disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Produk'}
                        </button>
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
        </AdminLayout>
    );
}
