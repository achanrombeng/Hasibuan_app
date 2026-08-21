import { SEOHead } from '@/components/seo';
import { useTranslation } from '@/hooks/use-translation';
import { ShopLayout } from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { usePage } from '@inertiajs/react';
import { Award, Clock, Heart, Leaf, Target, Users } from 'lucide-react';

interface AboutProps {
    aboutSettings?: {
        hero_title?: string;
        hero_subtitle?: string;
        story_title?: string;
        story_p1?: string;
        story_p2?: string;
        story_p3?: string;
        story_image?: string;
        years_experience?: string;
        years_experience_label?: string;
        vision_title?: string;
        vision_text?: string;
        mission_title?: string;
        mission_1?: string;
        mission_2?: string;
        mission_3?: string;
        mission_4?: string;
    };
}

export default function About({ aboutSettings }: AboutProps) {
    const { t } = useTranslation();
    const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
    const siteName = siteSettings?.site_name || 'Ronica';

    const VALUES = [
        {
            icon: Award,
            title: t('shop.about.value_quality_title'),
            desc: t('shop.about.value_quality_desc'),
        },
        {
            icon: Leaf,
            title: t('shop.about.value_eco_title'),
            desc: t('shop.about.value_eco_desc'),
        },
        {
            icon: Heart,
            title: t('shop.about.value_love_title'),
            desc: t('shop.about.value_love_desc'),
        },
        {
            icon: Users,
            title: t('shop.about.value_expert_title'),
            desc: t('shop.about.value_expert_desc'),
        },
    ];

    const MILESTONES = [
        {
            year: '2010',
            title: t('shop.about.milestone_2010_title'),
            desc: t('shop.about.milestone_2010_desc'),
        },
        {
            year: '2015',
            title: t('shop.about.milestone_2015_title'),
            desc: t('shop.about.milestone_2015_desc'),
        },
        {
            year: '2020',
            title: t('shop.about.milestone_2020_title'),
            desc: t('shop.about.milestone_2020_desc'),
        },
        {
            year: '2024',
            title: t('shop.about.milestone_2024_title'),
            desc: t('shop.about.milestone_2024_desc'),
        },
    ];

    return (
        <>
            <SEOHead
                title={t('shop.about.title')}
                description={t('shop.about.seo_description', { siteName })}
                keywords={[
                    'tentang kami',
                    'furnitur jepara',
                    'mebel indonesia',
                    'furniture premium',
                    'pengrajin mebel',
                ]}
            />
            <div className="bg-noise" />
            <ShopLayout>
                <main className="min-h-screen bg-sand-50 pb-20">
                    {/* Hero */}
                    <div className="mb-16 bg-gradient-to-r from-teal-600 to-teal-700 py-20 text-white">
                        <div className="mx-auto max-w-[1400px] px-6 text-center md:px-12">
                            <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
                                {aboutSettings?.hero_title || t('shop.about.hero_title', { siteName })}
                            </h1>
                            <p className="mx-auto max-w-2xl text-xl opacity-90">
                                {aboutSettings?.hero_subtitle || t('shop.about.hero_subtitle')}
                            </p>
                        </div>
                    </div>

                    <div className="mx-auto max-w-[1400px] px-6 md:px-12">
                        {/* Story Section */}
                        <div className="mb-20 grid items-center gap-12 md:grid-cols-2">
                            <div>
                                <h2 className="mb-6 font-serif text-3xl text-terra-900">
                                    {aboutSettings?.story_title || t('shop.about.story_title')}
                                </h2>
                                <div className="space-y-4 leading-relaxed text-terra-600">
                                    {aboutSettings?.story_p1 && <p>{aboutSettings.story_p1}</p>}
                                    {aboutSettings?.story_p2 && <p>{aboutSettings.story_p2}</p>}
                                    {aboutSettings?.story_p3 && <p>{aboutSettings.story_p3}</p>}
                                    {!aboutSettings?.story_p1 && (
                                        <>
                                            <p>{t('shop.about.story_p1', { siteName })}</p>
                                            <p>{t('shop.about.story_p2')}</p>
                                            <p>{t('shop.about.story_p3', { siteName })}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="relative">
                                <div className="aspect-[4/3] overflow-hidden rounded-sm bg-neutral-200">
                                    <img
                                        src={aboutSettings?.story_image || '/images/placeholder-about.svg'}
                                        alt="Workshop"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-6 -left-6 rounded-sm bg-teal-600 p-6 text-white">
                                    <div className="text-3xl font-bold">
                                        {aboutSettings?.years_experience || '14+'}
                                    </div>
                                    <div className="text-sm opacity-80">
                                        {aboutSettings?.years_experience_label || t('shop.about.years_experience')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Vision & Mission */}
                        <div className="mb-20 grid gap-8 md:grid-cols-2">
                            <div className="rounded-sm border border-terra-100 bg-white p-8">
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-sm bg-teal-100">
                                    <Target
                                        size={28}
                                        className="text-teal-600"
                                    />
                                </div>
                                <h3 className="mb-4 font-serif text-2xl text-terra-900">
                                    {aboutSettings?.vision_title || t('shop.about.vision_title')}
                                </h3>
                                <p className="leading-relaxed text-terra-600">
                                    {aboutSettings?.vision_text || t('shop.about.vision_text')}
                                </p>
                            </div>
                            <div className="rounded-sm border border-terra-100 bg-white p-8">
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-sm bg-teal-100">
                                    <Clock
                                        size={28}
                                        className="text-teal-600"
                                    />
                                </div>
                                <h3 className="mb-4 font-serif text-2xl text-terra-900">
                                    {aboutSettings?.mission_title || t('shop.about.mission_title')}
                                </h3>
                                <ul className="space-y-2 text-terra-600">
                                    <li className="flex items-start gap-2">
                                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-500"></span>
                                        {aboutSettings?.mission_1 || t('shop.about.mission_1')}
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-500"></span>
                                        {aboutSettings?.mission_2 || t('shop.about.mission_2')}
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-500"></span>
                                        {aboutSettings?.mission_3 || t('shop.about.mission_3')}
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-500"></span>
                                        {aboutSettings?.mission_4 || t('shop.about.mission_4')}
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Values */}
                        <div className="mb-20">
                            <h2 className="mb-12 text-center font-serif text-3xl text-terra-900">
                                {t('shop.about.values_title')}
                            </h2>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {VALUES.map((v, i) => (
                                    <div
                                        key={i}
                                        className="rounded-sm border border-terra-100 bg-white p-6 text-center transition-shadow hover:shadow-lg"
                                    >
                                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
                                            <v.icon
                                                size={32}
                                                className="text-teal-600"
                                            />
                                        </div>
                                        <h3 className="mb-2 font-medium text-terra-900">
                                            {v.title}
                                        </h3>
                                        <p className="text-sm text-terra-500">
                                            {v.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="mb-20">
                            <h2 className="mb-12 text-center font-serif text-3xl text-terra-900">
                                {t('shop.about.journey_title')}
                            </h2>
                            <div className="relative">
                                <div className="absolute top-0 bottom-0 left-1/2 hidden w-0.5 bg-terra-200 md:block"></div>
                                <div className="space-y-8">
                                    {MILESTONES.map((m, i) => (
                                        <div
                                            key={i}
                                            className={`flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                                        >
                                            <div
                                                className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}
                                            >
                                                <div className="inline-block rounded-sm border border-terra-100 bg-white p-6">
                                                    <div className="mb-1 text-xl font-bold text-teal-600">
                                                        {m.year}
                                                    </div>
                                                    <h4 className="mb-1 font-medium text-terra-900">
                                                        {m.title}
                                                    </h4>
                                                    <p className="text-sm text-terra-500">
                                                        {m.desc}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="z-10 hidden h-4 w-4 rounded-full border-4 border-sand-50 bg-wood md:flex"></div>
                                            <div className="hidden flex-1 md:block"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="rounded-sm bg-teal-700 p-12 text-center text-white">
                            <h2 className="mb-4 font-serif text-3xl">
                                {t('shop.about.cta_title')}
                            </h2>
                            <p className="mx-auto mb-8 max-w-xl opacity-80">
                                {t('shop.about.cta_subtitle')}
                            </p>
                            <a
                                href="/shop/products"
                                className="inline-flex items-center gap-2 rounded-sm bg-white px-8 py-4 font-medium text-teal-700 transition-colors hover:bg-teal-50"
                            >
                                {t('shop.about.cta_button')}
                            </a>
                        </div>
                    </div>
                </main>
            </ShopLayout>
        </>
    );
}
