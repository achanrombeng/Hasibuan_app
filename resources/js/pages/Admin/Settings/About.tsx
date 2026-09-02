import { ConfirmDialog } from '@/components/ui/alert-dialog';
import { useTranslation } from '@/hooks/use-translation';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, useForm } from '@inertiajs/react';
import {
    Award,
    Building2,
    Clock,
    FileText,
    Image as ImageIcon,
    Info,
    Save,
    Sparkles,
    Target,
} from 'lucide-react';
import React, { useState } from 'react';

interface AboutSettingsProps {
    settings: {
        about_hero_title: string;
        about_hero_subtitle: string;
        about_story_title: string;
        about_story_p1: string;
        about_story_p2: string;
        about_story_p3: string;
        about_story_image: string;
        about_years_experience: string;
        about_years_experience_label: string;
        about_vision_title: string;
        about_vision_text: string;
        about_mission_title: string;
        about_mission_1: string;
        about_mission_2: string;
        about_mission_3: string;
        about_mission_4: string;
    };
}

export default function AboutSettings({ settings }: AboutSettingsProps) {
    const [imagePreview, setImagePreview] = useState<string>(
        settings.about_story_image || '/images/placeholder-about.svg',
    );

    const { data, setData, post, processing, errors } = useForm({
        about_hero_title: settings.about_hero_title || '',
        about_hero_subtitle: settings.about_hero_subtitle || '',
        about_story_title: settings.about_story_title || '',
        about_story_p1: settings.about_story_p1 || '',
        about_story_p2: settings.about_story_p2 || '',
        about_story_p3: settings.about_story_p3 || '',
        about_story_image: settings.about_story_image || '',
        about_story_image_file: null as File | null,
        about_years_experience: settings.about_years_experience || '',
        about_years_experience_label: settings.about_years_experience_label || '',
        about_vision_title: settings.about_vision_title || '',
        about_vision_text: settings.about_vision_text || '',
        about_mission_title: settings.about_mission_title || '',
        about_mission_1: settings.about_mission_1 || '',
        about_mission_2: settings.about_mission_2 || '',
        about_mission_3: settings.about_mission_3 || '',
        about_mission_4: settings.about_mission_4 || '',
    });

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const { t } = useTranslation();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('about_story_image_file', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirmDialog(true);
    };

    const confirmSaveAbout = () => {
        post('/admin/settings/about', {
            preserveScroll: true,
            onError: () => {
                setShowConfirmDialog(false);
            },
        });
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
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-terra-900">
                            Manage About Us Page
                        </h1>
                        <p className="mt-1 text-sm text-neutral-500">
                            Manage headline text, workshop story, vision & mission displayed on your store's About Us page.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Section 1: Hero Banner */}
                    <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center gap-3 border-b border-neutral-100 pb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="font-serif text-lg font-bold text-neutral-900">
                                    Hero Banner
                                </h2>
                                <p className="text-xs text-neutral-500">
                                    Main title and description at the top of the About Us page
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                    Hero Title
                                </label>
                                <input
                                    type="text"
                                    value={data.about_hero_title}
                                    onChange={(e) => setData('about_hero_title', e.target.value)}
                                    placeholder="e.g. Welcome to Ronica Outdoor Furniture"
                                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-2.5 text-sm text-neutral-900 transition-all focus:border-wood focus:bg-white focus:ring-2 focus:ring-wood/20 focus:outline-none"
                                />
                                {errors.about_hero_title && (
                                    <p className="mt-1 text-xs text-red-500">{errors.about_hero_title}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                    Hero Subtitle
                                </label>
                                <textarea
                                    rows={2}
                                    value={data.about_hero_subtitle}
                                    onChange={(e) => setData('about_hero_subtitle', e.target.value)}
                                    placeholder="e.g. Delivering premium quality furniture..."
                                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-2.5 text-sm text-neutral-900 transition-all focus:border-wood focus:bg-white focus:ring-2 focus:ring-wood/20 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Our Story & Image */}
                    <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center gap-3 border-b border-neutral-100 pb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="font-serif text-lg font-bold text-neutral-900">
                                    Our Story & Workshop Photo
                                </h2>
                                <p className="text-xs text-neutral-500">
                                    Background story, workshop photos, and years of experience badge
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                        Story Title
                                    </label>
                                    <input
                                        type="text"
                                        value={data.about_story_title}
                                        onChange={(e) => setData('about_story_title', e.target.value)}
                                        placeholder="e.g. Our Story"
                                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-2.5 text-sm text-neutral-900 transition-all focus:border-wood focus:bg-white focus:ring-2 focus:ring-wood/20 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                        Paragraph 1
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={data.about_story_p1}
                                        onChange={(e) => setData('about_story_p1', e.target.value)}
                                        placeholder="First story paragraph..."
                                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-2.5 text-sm text-neutral-900 transition-all focus:border-wood focus:bg-white focus:ring-2 focus:ring-wood/20 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                        Paragraph 2
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={data.about_story_p2}
                                        onChange={(e) => setData('about_story_p2', e.target.value)}
                                        placeholder="Second story paragraph..."
                                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-2.5 text-sm text-neutral-900 transition-all focus:border-wood focus:bg-white focus:ring-2 focus:ring-wood/20 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                        Paragraph 3
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={data.about_story_p3}
                                        onChange={(e) => setData('about_story_p3', e.target.value)}
                                        placeholder="Third story paragraph..."
                                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-2.5 text-sm text-neutral-900 transition-all focus:border-wood focus:bg-white focus:ring-2 focus:ring-wood/20 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="mb-1.5 flex items-center justify-between">
                                        <label className="block text-sm font-medium text-neutral-700">
                                            Workshop / Craftsman Photo
                                        </label>
                                        <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                                            Recommended size: 800 × 600 px (4:3 ratio)
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="aspect-[4/3] overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                                            <img
                                                src={imagePreview}
                                                alt="Workshop Preview"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="block w-full text-sm text-neutral-500 file:mr-4 file:rounded-xl file:border-0 file:bg-wood-dark file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-white hover:file:bg-wood"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                            Experience Value
                                        </label>
                                        <input
                                            type="text"
                                            value={data.about_years_experience}
                                            onChange={(e) => setData('about_years_experience', e.target.value)}
                                            placeholder="e.g. 14+"
                                            className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-2.5 text-sm text-neutral-900 transition-all focus:border-wood focus:bg-white focus:ring-2 focus:ring-wood/20 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                            Experience Badge Label
                                        </label>
                                        <input
                                            type="text"
                                            value={data.about_years_experience_label}
                                            onChange={(e) => setData('about_years_experience_label', e.target.value)}
                                            placeholder="e.g. Years of Experience"
                                            className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-2.5 text-sm text-neutral-900 transition-all focus:border-wood focus:bg-white focus:ring-2 focus:ring-wood/20 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Vision & Mission */}
                    <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center gap-3 border-b border-neutral-100 pb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                                <Target className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="font-serif text-lg font-bold text-neutral-900">
                                    Vision & Mission
                                </h2>
                                <p className="text-xs text-neutral-500">
                                    Company vision statement and mission points
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Vision */}
                            <div className="space-y-4 rounded-xl border border-neutral-100 bg-neutral-50/50 p-4">
                                <h3 className="font-serif text-base font-semibold text-neutral-800">
                                    Vision Section
                                </h3>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                        Vision Title
                                    </label>
                                    <input
                                        type="text"
                                        value={data.about_vision_title}
                                        onChange={(e) => setData('about_vision_title', e.target.value)}
                                        placeholder="e.g. Our Vision"
                                        className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 focus:border-wood focus:ring-2 focus:ring-wood/20 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                        Vision Description
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={data.about_vision_text}
                                        onChange={(e) => setData('about_vision_text', e.target.value)}
                                        placeholder="Company vision statement..."
                                        className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 focus:border-wood focus:ring-2 focus:ring-wood/20 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Mission */}
                            <div className="space-y-4 rounded-xl border border-neutral-100 bg-neutral-50/50 p-4">
                                <h3 className="font-serif text-base font-semibold text-neutral-800">
                                    Mission Section
                                </h3>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                        Mission Title
                                    </label>
                                    <input
                                        type="text"
                                        value={data.about_mission_title}
                                        onChange={(e) => setData('about_mission_title', e.target.value)}
                                        placeholder="e.g. Our Mission"
                                        className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 focus:border-wood focus:ring-2 focus:ring-wood/20 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                        Mission Point 1
                                    </label>
                                    <input
                                        type="text"
                                        value={data.about_mission_1}
                                        onChange={(e) => setData('about_mission_1', e.target.value)}
                                        className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-900 focus:border-wood focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                        Mission Point 2
                                    </label>
                                    <input
                                        type="text"
                                        value={data.about_mission_2}
                                        onChange={(e) => setData('about_mission_2', e.target.value)}
                                        className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-900 focus:border-wood focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                        Mission Point 3
                                    </label>
                                    <input
                                        type="text"
                                        value={data.about_mission_3}
                                        onChange={(e) => setData('about_mission_3', e.target.value)}
                                        className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-900 focus:border-wood focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                        Mission Point 4
                                    </label>
                                    <input
                                        type="text"
                                        value={data.about_mission_4}
                                        onChange={(e) => setData('about_mission_4', e.target.value)}
                                        className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-900 focus:border-wood focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sticky Submit Bar */}
                    <div className="sticky bottom-6 z-30 flex items-center justify-between rounded-2xl border border-neutral-200/80 bg-white/90 px-6 py-4 shadow-xl backdrop-blur-md">
                        <span className="hidden text-xs font-medium text-neutral-500 sm:inline">
                            Please ensure details are accurate before saving
                        </span>
                        <button
                            type="submit"
                            disabled={processing}
                            className="ml-auto inline-flex items-center gap-2 rounded-xl bg-[#a67c52] px-6 py-3 font-medium text-white shadow-md transition-all hover:bg-[#8e6843] active:scale-[0.98] disabled:opacity-50"
                        >
                            <Save className="h-5 w-5" />
                            {processing ? 'Saving...' : 'Save About Us Settings'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Confirm Save Settings Dialog */}
            <ConfirmDialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
                title={t('admin.settings.confirm_save_about_title')}
                description={t('admin.settings.confirm_save_about_desc')}
                confirmText={t('admin.settings.confirm_save_about_button')}
                cancelText={t('common.cancel')}
                variant="default"
                isLoading={processing}
                onConfirm={confirmSaveAbout}
            />
        </AdminLayout>
    );
}
