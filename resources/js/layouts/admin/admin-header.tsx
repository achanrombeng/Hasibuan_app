import LanguageSwitcher from '@/components/LanguageSwitcher';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useInitials } from '@/hooks/use-initials';
import { useTranslation } from '@/hooks/use-translation';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import {
    Bell,
    ChevronRight,
    Info,
    LayoutDashboard,
    Loader2,
    LogOut,
    Menu,
    Package,
    PlusCircle,
    Search,
    Settings,
    ShoppingCart,
    User,
    UserPlus,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface AdminHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
    onMobileMenuClick?: () => void;
}

interface SearchResults {
    products: Array<{ id: number; name: string; image: string; slug: string }>;
    users: Array<{ id: number; name: string; email: string; avatar: string }>;
    orders: Array<{ id: number; order_number: string; status: string }>;
}

export default function AdminHeader({
    breadcrumbs = [],
    onMobileMenuClick,
}: AdminHeaderProps) {
    const { auth } = usePage<SharedData>().props;
    const { t, locale } = useTranslation();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [openSearch, setOpenSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResults>({
        products: [],
        users: [],
        orders: [],
    });
    const getInitials = useInitials();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/admin/notifications/unread');
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications);
                setUnreadCount(data.unread_count);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Optional: Poll every minute
        const poll = setInterval(fetchNotifications, 60000);
        return () => clearInterval(poll);
    }, []);

    const markAsRead = async (id: string) => {
        router.patch(
            `/admin/notifications/${id}/read`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => fetchNotifications(),
            },
        );
    };

    const markAllRead = () => {
        router.post(
            '/admin/notifications/mark-all-read',
            {},
            {
                preserveScroll: true,
                onSuccess: () => fetchNotifications(),
            },
        );
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpenSearch((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.trim().length > 0) {
                setLoading(true);
                try {
                    const response = await fetch(
                        `/admin/search?query=${encodeURIComponent(searchQuery)}`,
                    );
                    if (response.ok) {
                        const data = await response.json();
                        setSearchResults(data);
                    }
                } catch (error) {
                    console.error('Search failed:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setSearchResults({ products: [], users: [], orders: [] });
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const runCommand = (command: () => void) => {
        setOpenSearch(false);
        command();
    };

    const hasResults =
        searchResults.products.length > 0 ||
        searchResults.users.length > 0 ||
        searchResults.orders.length > 0;

    return (
        <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6">
                {/* Left side - Mobile menu + Breadcrumbs */}
                <div className="flex items-center gap-4">
                    {/* Mobile menu button */}
                    <button
                        onClick={onMobileMenuClick}
                        className="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-50 lg:hidden"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    {/* Breadcrumbs */}
                    <nav className="hidden items-center gap-2 text-sm sm:flex">
                        <Link
                            href="/admin"
                            className="text-neutral-500 transition-colors hover:text-neutral-900"
                        >
                            Dashboard
                        </Link>
                        {breadcrumbs.map((crumb, index) => (
                            <div
                                key={crumb.href}
                                className="flex items-center gap-2"
                            >
                                <ChevronRight className="h-4 w-4 text-neutral-300" />
                                {index === breadcrumbs.length - 1 ? (
                                    <span className="font-medium text-neutral-900">
                                        {crumb.title}
                                    </span>
                                ) : (
                                    <Link
                                        href={crumb.href}
                                        className="text-neutral-500 transition-colors hover:text-neutral-900"
                                    >
                                        {crumb.title}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Right side - Search, Notifications, User */}
                <div className="flex items-center gap-3">
                    {/* Search */}
                    <button
                        onClick={() => setOpenSearch(true)}
                        className="group hidden w-64 items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 md:flex"
                    >
                        <Search className="h-4 w-4 text-neutral-400 group-hover:text-neutral-600" />
                        <span>{t('admin.header.search_placeholder')}</span>
                        <kbd className="pointer-events-none ml-auto inline-flex h-5 items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 select-none">
                            <span className="text-xs">Ctrl</span>K
                        </kbd>
                    </button>
                    {/* Mobile Search Icon */}
                    <button
                        onClick={() => setOpenSearch(true)}
                        className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-900 md:hidden"
                    >
                        <Search className="h-5 w-5" />
                    </button>

                    <CommandDialog
                        open={openSearch}
                        onOpenChange={setOpenSearch}
                    >
                        <CommandInput
                            placeholder={t('admin.header.search_input_placeholder')}
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                        />
                        <CommandList>
                            <CommandEmpty>
                                {loading ? (
                                    <div className="flex items-center justify-center py-6">
                                        <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
                                    </div>
                                ) : (
                                    t('common.no_results')
                                )}
                            </CommandEmpty>

                            <CommandGroup heading={t('admin.header.quick_actions')}>
                                <CommandItem
                                    onSelect={() =>
                                        runCommand(() =>
                                            router.visit(
                                                '/admin/products/create',
                                            ),
                                        )
                                    }
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    <span>{t('admin.header.add_product')}</span>
                                </CommandItem>
                                <CommandItem
                                    onSelect={() =>
                                        runCommand(() =>
                                            router.visit('/admin/users/create'),
                                        )
                                    }
                                >
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    <span>{t('admin.header.add_user')}</span>
                                </CommandItem>
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup heading={t('admin.header.main_pages')}>
                                <CommandItem
                                    onSelect={() =>
                                        runCommand(() => router.visit('/admin'))
                                    }
                                >
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    <span>{t('admin.sidebar.dashboard')}</span>
                                </CommandItem>
                                <CommandItem
                                    onSelect={() =>
                                        runCommand(() =>
                                            router.visit('/admin/products'),
                                        )
                                    }
                                >
                                    <Package className="mr-2 h-4 w-4" />
                                    <span>{t('admin.sidebar.products')}</span>
                                </CommandItem>
                                <CommandItem
                                    onSelect={() =>
                                        runCommand(() =>
                                            router.visit('/admin/orders'),
                                        )
                                    }
                                >
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    <span>{t('admin.sidebar.orders')}</span>
                                </CommandItem>
                                <CommandItem
                                    onSelect={() =>
                                        runCommand(() =>
                                            router.visit('/admin/customers'),
                                        )
                                    }
                                >
                                    <Users className="mr-2 h-4 w-4" />
                                    <span>{t('admin.sidebar.customers')}</span>
                                </CommandItem>
                            </CommandGroup>
                            <CommandGroup heading={t('admin.header.settings_section')}>
                                <CommandItem
                                    onSelect={() =>
                                        runCommand(() =>
                                            router.visit('/admin/users'),
                                        )
                                    }
                                >
                                    <Users className="mr-2 h-4 w-4" />
                                    <span>{t('admin.header.user_management')}</span>
                                </CommandItem>
                                <CommandItem
                                    onSelect={() =>
                                        runCommand(() =>
                                            router.visit('/admin/profile'),
                                        )
                                    }
                                >
                                    <User className="mr-2 h-4 w-4" />
                                    <span>{t('admin.header.my_profile')}</span>
                                </CommandItem>
                                <CommandItem
                                    onSelect={() =>
                                        runCommand(() =>
                                            router.visit('/admin/settings'),
                                        )
                                    }
                                >
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>{t('admin.header.store_settings')}</span>
                                </CommandItem>
                            </CommandGroup>

                            {hasResults && (
                                <>
                                    {searchResults.products.length > 0 && (
                                        <CommandGroup heading={t('admin.sidebar.products')}>
                                            {searchResults.products.map(
                                                (product) => (
                                                    <CommandItem
                                                        key={product.id}
                                                        onSelect={() =>
                                                            runCommand(() =>
                                                                router.visit(
                                                                    `/admin/products/${product.id}/edit`,
                                                                ),
                                                            )
                                                        }
                                                    >
                                                        <Package className="mr-2 h-4 w-4" />
                                                        <span>
                                                            {product.name}
                                                        </span>
                                                    </CommandItem>
                                                ),
                                            )}
                                        </CommandGroup>
                                    )}
                                    {searchResults.users.length > 0 && (
                                        <CommandGroup heading={t('admin.sidebar.customers')}>
                                            {searchResults.users.map((user) => (
                                                <CommandItem
                                                    key={user.id}
                                                    onSelect={() =>
                                                        runCommand(() =>
                                                            router.visit(
                                                                `/admin/customers/${user.id}`,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    <User className="mr-2 h-4 w-4" />
                                                    <span>{user.name}</span>
                                                    <span className="ml-2 text-xs text-muted-foreground">
                                                        {user.email}
                                                    </span>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    )}
                                    {searchResults.orders.length > 0 && (
                                        <CommandGroup heading={t('admin.sidebar.orders')}>
                                            {searchResults.orders.map(
                                                (order) => (
                                                    <CommandItem
                                                        key={order.id}
                                                        onSelect={() =>
                                                            runCommand(() =>
                                                                router.visit(
                                                                    `/admin/orders/${order.id}`,
                                                                ),
                                                            )
                                                        }
                                                    >
                                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                                        <span>
                                                            #
                                                            {order.order_number}
                                                        </span>
                                                    </CommandItem>
                                                ),
                                            )}
                                        </CommandGroup>
                                    )}
                                </>
                            )}
                        </CommandList>
                    </CommandDialog>

                    {/* Language Switcher */}
                    <LanguageSwitcher variant="toggle" />

                    {/* Notifications */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="relative rounded-lg p-2 text-neutral-500 transition-colors outline-none hover:bg-neutral-50 hover:text-neutral-900">
                                <Bell className="h-5 w-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                                )}
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80 p-0">
                            <div className="border-b border-border bg-neutral-50/50 p-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-neutral-900">
                                        {t('admin.header.notifications')} ({unreadCount})
                                    </h4>
                                    <button
                                        onClick={markAllRead}
                                        className="text-xs font-medium text-teal-600 transition-colors hover:text-teal-700"
                                    >
                                        {t('admin.header.mark_all_read')}
                                    </button>
                                </div>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            onClick={() => markAsRead(notif.id)}
                                            className="group cursor-pointer border-b border-border/50 p-4 transition-colors hover:bg-neutral-50"
                                        >
                                            <div className="flex gap-3">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
                                                    <Info className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-neutral-900 transition-colors group-hover:text-blue-700">
                                                        {notif.data.title ||
                                                            'Notifikasi'}
                                                    </p>
                                                    <p className="mt-0.5 line-clamp-2 text-xs text-neutral-500">
                                                        {notif.data.message}
                                                    </p>
                                                    <p className="mt-2 text-[10px] text-neutral-400">
                                                        {new Date(
                                                            notif.created_at,
                                                        ).toLocaleString(
                                                            locale === 'id' ? 'id-ID' : 'en-US',
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center">
                                        <p className="text-sm text-neutral-400">
                                            {t('admin.header.no_notifications')}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="border-t border-border p-2">
                                <Link
                                    href="/admin/notifications"
                                    className="flex w-full items-center justify-center rounded-md py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                                >
                                    {t('admin.header.view_all_notifications')}
                                </Link>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-3 rounded-xl p-1.5 pr-3 transition-colors hover:bg-neutral-50"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200">
                                {auth.user.avatar ? (
                                    <img
                                        src={auth.user.avatar}
                                        alt={auth.user.name}
                                        className="h-full w-full rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-sm font-medium text-neutral-700">
                                        {getInitials(auth.user.name)}
                                    </span>
                                )}
                            </div>
                            <div className="hidden text-left md:block">
                                <p className="text-sm font-medium text-neutral-900">
                                    {auth.user.name}
                                </p>
                                <p className="text-xs text-neutral-500">
                                    {t('admin.header.administrator')}
                                </p>
                            </div>
                        </button>

                        {/* Dropdown */}
                        {showUserMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowUserMenu(false)}
                                />
                                <div className="absolute top-full right-0 z-50 mt-2 w-56 rounded-xl border border-neutral-100 bg-white py-2 shadow-lg">
                                    <div className="border-b border-neutral-100 px-4 py-2">
                                        <p className="text-sm font-medium text-neutral-900">
                                            {auth.user.name}
                                        </p>
                                        <p className="text-xs text-neutral-500">
                                            {auth.user.email}
                                        </p>
                                    </div>
                                    <Link
                                        href="/admin/profile"
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
                                    >
                                        <User className="h-4 w-4" />
                                        {t('admin.header.my_profile')}
                                    </Link>
                                    <Link
                                        href="/admin/settings"
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
                                    >
                                        <Settings className="h-4 w-4" />
                                        {t('admin.sidebar.settings')}
                                    </Link>
                                    <div className="mt-2 border-t border-neutral-100 pt-2">
                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            {t('admin.header.logout')}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
