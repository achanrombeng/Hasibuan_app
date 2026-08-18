import { TagInput } from '@/components/TagInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import MDEditor from '@uiw/react-md-editor';
import { ArrowLeft, Save, X } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';

interface Article {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image: string | null;
    author: string;
    author_id: number | null;
    status: string;
    tags: string[];
    read_time: number;
    published_at: string | null;
    meta_title: string | null;
    meta_description: string | null;
    meta_keywords: string | null;
}

interface EditArticleProps {
    article: Article;
    statuses: Array<{ value: string; label: string }>;
}

export default function EditArticle({ article, statuses }: EditArticleProps) {
    const [formData, setFormData] = useState({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        author: article.author,
        author_id: article.author_id,
        status: article.status,
        tags: article.tags || [],
        published_at: article.published_at || '',
        meta_title: article.meta_title || '',
        meta_description: article.meta_description || '',
        meta_keywords: article.meta_keywords || '',
    });
    const [featuredImage, setFeaturedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        article.featured_image
            ? `/storage/${article.featured_image}`
            : null,
    );
    const [removeImage, setRemoveImage] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showSeo, setShowSeo] = useState(
        !!(article.meta_title || article.meta_description || article.meta_keywords),
    );

    useEffect(() => {
        if (formData.title && !formData.slug) {
            const slug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            setFormData((prev) => ({ ...prev, slug }));
        }
    }, [formData.title]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFeaturedImage(file);
            setRemoveImage(false);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setFeaturedImage(null);
        setImagePreview(null);
        setRemoveImage(true);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const data = new FormData();
        data.append('_method', 'PUT');

        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'tags') {
                data.append(key, JSON.stringify(value));
            } else if (value !== null && value !== '') {
                data.append(key, String(value));
            }
        });

        if (featuredImage) {
            data.append('featured_image', featuredImage);
        }

        if (removeImage) {
            data.append('remove_image', '1');
        }

        router.post(`/admin/articles/${article.id}`, data, {
            forceFormData: true,
            onSuccess: () => {
                setIsSubmitting(false);
            },
            onError: (errors) => {
                setErrors(errors);
                setIsSubmitting(false);
            },
        });
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { label: 'Dashboard', href: '/admin' },
                { label: 'Artikel', href: '/admin/articles' },
                { label: 'Edit Artikel' },
            ]}
        >
            <Head title={`Edit: ${article.title}`} />

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/articles">
                            <Button variant="outline" size="sm" type="button">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Edit Artikel
                            </h1>
                        </div>
                    </div>
                    <Button type="submit" disabled={isSubmitting}>
                        <Save className="mr-2 h-4 w-4" />
                        {isSubmitting ? 'Menyimpan...' : 'Update'}
                    </Button>
                </div>

                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Dasar</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="title">
                                Judul <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        title: e.target.value,
                                    })
                                }
                                placeholder="Judul artikel"
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        slug: e.target.value,
                                    })
                                }
                                placeholder="slug-artikel"
                            />
                            {errors.slug && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.slug}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="author">
                                Penulis <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="author"
                                value={formData.author}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        author: e.target.value,
                                    })
                                }
                                placeholder="Nama penulis"
                            />
                            {errors.author && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.author}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="excerpt">
                                Ringkasan <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="excerpt"
                                value={formData.excerpt}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        excerpt: e.target.value,
                                    })
                                }
                                placeholder="Ringkasan singkat artikel (maks 500 karakter)"
                                rows={3}
                                maxLength={500}
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                {formData.excerpt.length}/500 karakter
                            </p>
                            {errors.excerpt && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.excerpt}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>Waktu Baca</Label>
                            <p className="text-sm text-gray-600">
                                {article.read_time} menit
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Content */}
                <Card>
                    <CardHeader>
                        <CardTitle>Konten</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div data-color-mode="light">
                            <MDEditor
                                value={formData.content}
                                onChange={(val) =>
                                    setFormData({
                                        ...formData,
                                        content: val || '',
                                    })
                                }
                                height={500}
                                preview="edit"
                            />
                        </div>
                        {errors.content && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.content}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Featured Image */}
                <Card>
                    <CardHeader>
                        <CardTitle>Gambar Unggulan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {imagePreview && !removeImage ? (
                            <div className="relative">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="h-48 w-full rounded-lg object-cover"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute right-2 top-2"
                                    onClick={handleRemoveImage}
                                >
                                    <X className="mr-1 h-4 w-4" />
                                    Hapus
                                </Button>
                            </div>
                        ) : (
                            <div>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                {errors.featured_image && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.featured_image}
                                    </p>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Publication Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pengaturan Publikasi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="status">
                                Status <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, status: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {statuses.map((status) => (
                                        <SelectItem
                                            key={status.value}
                                            value={status.value}
                                        >
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="tags">Tag</Label>
                            <TagInput
                                value={formData.tags}
                                onChange={(tags) =>
                                    setFormData({ ...formData, tags })
                                }
                                placeholder="Tambah tag (tekan Enter atau koma)"
                            />
                        </div>

                        <div>
                            <Label htmlFor="published_at">
                                Tanggal Publikasi
                            </Label>
                            <Input
                                id="published_at"
                                type="datetime-local"
                                value={formData.published_at}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        published_at: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* SEO */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>SEO (Opsional)</CardTitle>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowSeo(!showSeo)}
                            >
                                {showSeo ? 'Sembunyikan' : 'Tampilkan'}
                            </Button>
                        </div>
                    </CardHeader>
                    {showSeo && (
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="meta_title">Meta Title</Label>
                                <Input
                                    id="meta_title"
                                    value={formData.meta_title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            meta_title: e.target.value,
                                        })
                                    }
                                    placeholder="Judul untuk SEO"
                                />
                            </div>

                            <div>
                                <Label htmlFor="meta_description">
                                    Meta Description
                                </Label>
                                <Textarea
                                    id="meta_description"
                                    value={formData.meta_description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            meta_description: e.target.value,
                                        })
                                    }
                                    placeholder="Deskripsi untuk SEO (maks 500 karakter)"
                                    rows={3}
                                    maxLength={500}
                                />
                            </div>

                            <div>
                                <Label htmlFor="meta_keywords">
                                    Meta Keywords
                                </Label>
                                <Input
                                    id="meta_keywords"
                                    value={formData.meta_keywords}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            meta_keywords: e.target.value,
                                        })
                                    }
                                    placeholder="keyword1, keyword2, keyword3"
                                />
                            </div>
                        </CardContent>
                    )}
                </Card>
            </form>
        </AdminLayout>
    );
}
