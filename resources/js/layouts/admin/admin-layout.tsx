import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { type PropsWithChildren, useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import AdminHeader from './admin-header';
import AdminSidebar from './admin-sidebar';

interface AdminLayoutProps {
    breadcrumbs?: BreadcrumbItem[];
}

export default function AdminLayout({
    children,
    breadcrumbs = [],
}: PropsWithChildren<AdminLayoutProps>) {
    const { flash } = usePage().props as any;

    const [collapsed, setCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('admin-sidebar-collapsed') === 'true';
        }
        return false;
    });

    const [mobileOpen, setMobileOpen] = useState(false);

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
        if (flash?.info) {
            toast.info(flash.info);
        }
        if (flash?.warning) {
            toast.warning(flash.warning);
        }
    }, [flash]);

    const handleSetCollapsed = (
        value: boolean | ((prevState: boolean) => boolean),
    ) => {
        setCollapsed((prev) => {
            const newValue = typeof value === 'function' ? value(prev) : value;
            localStorage.setItem('admin-sidebar-collapsed', String(newValue));
            return newValue;
        });
    };

    return (
        <div className="min-h-screen bg-sand-50">
            <Toaster position="top-right" richColors />
            {/* Sidebar */}
            <AdminSidebar
                collapsed={collapsed}
                setCollapsed={handleSetCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            {/* Main Content */}
            <div
                className={cn(
                    'transition-all duration-300',
                    collapsed ? 'lg:pl-20' : 'lg:pl-72',
                )}
            >
                {/* Header */}
                <AdminHeader
                    breadcrumbs={breadcrumbs}
                    onMobileMenuClick={() => setMobileOpen(true)}
                />

                {/* Page Content */}
                <main className="p-4 sm:p-6">{children}</main>
            </div>
        </div>
    );
}
