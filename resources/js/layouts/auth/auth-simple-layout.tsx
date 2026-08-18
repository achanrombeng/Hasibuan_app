import { SiteSettings } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
    const siteName = siteSettings?.site_name || 'Ronica';
    const currentYear = new Date().getFullYear();

    return (
        <div className="flex min-h-svh">
            {/* Left Side - Branding */}
            <div className="relative hidden overflow-hidden bg-gradient-to-br from-teal-900 via-teal-800 to-teal-950 lg:flex lg:w-1/2">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-white blur-3xl" />
                    <div className="absolute right-20 bottom-20 h-96 w-96 rounded-full bg-teal-400 blur-3xl" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex w-full flex-col justify-between p-12">
                    <Link href="/shop" className="flex items-center">
                        <img
                            src="/assets/images/logo.webp"
                            alt={siteName}
                            className="h-8 w-auto brightness-0 invert"
                        />
                    </Link>

                    <div className="space-y-6">
                        <h2 className="font-serif text-4xl leading-tight text-white xl:text-5xl">
                            Furniture Berkualitas
                            <br />
                            <span className="text-accent-600">
                                untuk Hunian Impian
                            </span>
                        </h2>
                        <p className="max-w-md text-lg leading-relaxed text-teal-100/80">
                            Temukan koleksi furniture premium dengan desain
                            elegan dan kualitas terbaik untuk melengkapi ruang
                            hidup Anda.
                        </p>
                    </div>

                    <p className="text-sm text-teal-200/60">
                        &copy; {currentYear} {siteName}. Hak cipta dilindungi.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex w-full flex-col items-center justify-center bg-neutral-50 p-6 md:p-10 lg:w-1/2">
                {/* Mobile Logo */}
                <div className="mb-8 lg:hidden">
                    <Link href="/shop">
                        <img
                            src="/assets/images/logo.webp"
                            alt={siteName}
                            className="h-8 w-auto"
                        />
                    </Link>
                </div>

                <div className="w-full max-w-md">
                    <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm md:p-10">
                        <div className="mb-8 space-y-2 text-center">
                            <h1 className="font-serif text-2xl text-neutral-900 md:text-3xl">
                                {title}
                            </h1>
                            <p className="text-sm text-neutral-500">
                                {description}
                            </p>
                        </div>
                        {children}
                    </div>

                    <p className="mt-6 text-center text-xs text-neutral-400 lg:hidden">
                        &copy; {currentYear} {siteName}. Hak cipta dilindungi.
                    </p>
                </div>
            </div>
        </div>
    );
}
