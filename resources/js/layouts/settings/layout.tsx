import { ShopLayout } from '@/layouts/ShopLayout';
import { cn, isSameUrl, resolveUrl } from '@/lib/utils';
import { edit } from '@/routes/profile';
import { show } from '@/routes/two-factor';
import { edit as editPassword } from '@/routes/user-password';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { KeyRound, MapPin, Shield, User } from 'lucide-react';
import { type PropsWithChildren } from 'react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profil',
        href: edit(),
        icon: User,
    },
    {
        title: 'Kata Sandi',
        href: editPassword(),
        icon: KeyRound,
    },
    {
        title: 'Alamat',
        href: '/settings/addresses',
        icon: MapPin,
    },
    {
        title: 'Keamanan',
        href: show(),
        icon: Shield,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <>
            <div className="bg-noise" />
            <ShopLayout>
                <main className="min-h-screen bg-white pb-20">
                    <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-12">
                        {/* Header */}
                        <div className="mb-10">
                            <h1 className="font-serif text-3xl font-medium text-terra-900 md:text-4xl">
                                Pengaturan Akun
                            </h1>
                            <p className="mt-2 text-terra-500">
                                Kelola profil dan keamanan akun Anda
                            </p>
                        </div>

                        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
                            {/* Sidebar */}
                            <aside className="w-full flex-shrink-0 lg:w-64">
                                <nav className="flex flex-row gap-2 overflow-x-auto pb-4 lg:flex-col lg:pb-0">
                                    {sidebarNavItems.map((item, index) => {
                                        const isActive = isSameUrl(
                                            currentPath,
                                            item.href,
                                        );
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={`${resolveUrl(item.href)}-${index}`}
                                                href={item.href}
                                                className={cn(
                                                    'flex items-center gap-3 rounded-sm px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200',
                                                    isActive
                                                        ? 'bg-teal-600 text-white shadow-sm'
                                                        : 'bg-sand-50 text-terra-600 hover:bg-sand-100 hover:text-terra-900',
                                                )}
                                            >
                                                {Icon && (
                                                    <Icon className="h-4 w-4" />
                                                )}
                                                {item.title}
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </aside>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm md:p-8">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </ShopLayout>
        </>
    );
}
