import { Head, usePage } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { useTranslation } from '@/hooks/use-translation';
import { type BreadcrumbItem, type SharedData } from '@/types';

import AdminLayout from '@/layouts/admin/admin-layout';
import SettingsLayout from '@/layouts/settings/layout';
import ShopLayout from '@/layouts/ShopLayout';
import { edit as editAppearance } from '@/routes/appearance';

export default function Appearance() {
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('settings.appearance.title'),
            href: editAppearance().url,
        },
    ];
    const isAdmin = auth.user.roles.some((role) =>
        ['super-admin', 'admin', 'manager', 'staff'].includes(role),
    );

    const Layout = isAdmin ? AdminLayout : ShopLayout;

    return (
        <Layout {...(isAdmin ? { breadcrumbs } : {})}>
            <Head title={t('settings.appearance.title')} />

            <SettingsLayout>
                <div className="space-y-6">
                    <div className="rounded-sm border border-terra-100 bg-white p-6 shadow-sm md:p-8">
                        <HeadingSmall
                            title={t('settings.appearance.title')}
                            description={t('settings.appearance.title')}
                        />
                        <div className="mt-6">
                            <AppearanceTabs />
                        </div>
                    </div>
                </div>
            </SettingsLayout>
        </Layout>
    );
}
