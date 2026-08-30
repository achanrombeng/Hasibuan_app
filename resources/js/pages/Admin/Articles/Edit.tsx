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
import { ArrowLeft, Image as ImageIcon, Save, X } from 'lucide-react';
import { FormEvent, useState } from 'react';

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

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData((prev) => ({
            ...prev,
            title,
        }));
    };

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
                if (Array.isArray(value)) {
                    value.forEach((tag) => data.append('tags[]', tag));
                }
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
                { title: 'Dashboard', href: '/admin' },
                { title: 'Articles', href: '/admin/articles' },
                { title: 'Edit Article', href: `/admin/articles/${article.id}/edit` },
            ]}
        >
            <Head title={`Edit: ${article.title}`} />

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/articles"
                            className="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-neutral-900">
                                Edit Article
                            </h1>
                            <p className="mt-1 text-neutral-500">{article.title}</p>
                        </div>
                    </div>
                </div>

                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="title">
                                Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={handleTitleChange}
                                placeholder="Article title"
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
                                placeholder="article-slug"
                            />
                            {errors.slug && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.slug}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="author">
                                Author <span className="text-red-500">*</span>
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
                                placeholder="Author name"
                            />
                            {errors.author && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.author}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="excerpt">
                                Excerpt <span className="text-red-500">*</span>
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
                                placeholder="Short article summary (max 500 characters)"
                                rows={3}
                                maxLength={500}
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                {formData.excerpt.length}/500 characters
                            </p>
                            {errors.excerpt && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.excerpt}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>Read Time</Label>
                            <p className="text-sm text-gray-600">
                                {article.read_time} min
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Content */}
                <Card>
                    <CardHeader>
                        <CardTitle>Content</CardTitle>
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
                        <CardTitle>Featured Image</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {imagePreview && !removeImage ? (
                            <div className="relative h-56 w-full overflow-hidden rounded-xl border border-neutral-200">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="h-full w-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-2 right-2 rounded-full bg-red-500 p-1.5 text-white transition-colors hover:bg-red-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <label className="flex h-44 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 transition-all hover:border-wood hover:bg-wood/5">
                                <div className="flex flex-col items-center justify-center pt-4 pb-4">
                                    <ImageIcon className="mb-2 h-9 w-9 text-neutral-400" />
                                    <p className="mb-1 text-sm text-neutral-600">
                                        <span className="font-semibold text-wood">
                                            Click to upload new image
                                        </span>{' '}
                                        or drag and drop
                                    </p>
                                    <p className="text-xs text-neutral-400">
                                        PNG, JPG, or WEBP
                                    </p>
                                    <div className="mt-2.5 inline-flex items-center gap-1 rounded-full border border-wood/20 bg-wood/10 px-3 py-1 text-xs text-wood">
                                        <span className="font-semibold">Recommended size:</span> 1200 × 675 px (16:9 ratio)
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        )}
                        {errors.featured_image && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.featured_image}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Publication Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Publication Settings</CardTitle>
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
                            <Label htmlFor="tags">Tags</Label>
                            <TagInput
                                value={formData.tags}
                                onChange={(tags) =>
                                    setFormData({ ...formData, tags })
                                }
                                placeholder="Add tag (press Enter or comma)"
                            />
                        </div>

                        <div>
                            <Label htmlFor="published_at">
                                Publish Date
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
                            <CardTitle>SEO (Optional)</CardTitle>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowSeo(!showSeo)}
                            >
                                {showSeo ? 'Hide' : 'Show'}
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
                                    placeholder="Title for SEO"
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
                                    placeholder="Description for SEO (max 500 characters)"
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

                {/* Sticky Submit Bar */}
                <div className="sticky bottom-6 z-30 flex items-center justify-between rounded-2xl border border-neutral-200/80 bg-white/90 px-6 py-4 shadow-xl backdrop-blur-md">
                    <span className="hidden text-xs font-medium text-neutral-500 sm:inline">
                        Please ensure article details are accurate before saving
                    </span>
                    <div className="ml-auto flex items-center gap-3">
                        <Link
                            href="/admin/articles"
                            className="rounded-xl border border-neutral-200 bg-white px-6 py-3 font-medium text-neutral-700 transition-all hover:bg-neutral-50 active:scale-[0.98]"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#a67c52] px-6 py-3 font-medium text-white shadow-md transition-all hover:bg-[#8e6843] active:scale-[0.98] disabled:opacity-50"
                        >
                            <Save className="h-5 w-5" />
                            {isSubmitting ? 'Saving...' : 'Update Article'}
                        </button>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
