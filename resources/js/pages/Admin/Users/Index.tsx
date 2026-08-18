import Pagination from '@/components/pagination';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Pencil,
    Plus,
    Search,
    Shield,
    Trash2,
    User,
    UserCog,
} from 'lucide-react';
import { useState } from 'react';

interface AdminUser {
    id: number;
    name: string;
    email: string;
    roles: string[];
    created_at: string;
}

interface UsersIndexProps {
    users: {
        data: AdminUser[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    filters?: { filter?: Record<string, string> };
    roles: string[];
}

const roleColors: Record<string, string> = {
    'super-admin': 'bg-red-100 text-red-700',
    admin: 'bg-purple-100 text-purple-700',
    manager: 'bg-blue-100 text-blue-700',
    staff: 'bg-green-100 text-green-700',
    customer: 'bg-terra-100 text-terra-700',
};

const roleLabels: Record<string, string> = {
    'super-admin': 'Super Admin',
    admin: 'Admin',
    manager: 'Manager',
    staff: 'Staff',
    customer: 'Customer',
};

export default function UsersIndex({ users, filters }: UsersIndexProps) {
    // Safely get filter name - check if filter is an object
    const filterName =
        filters?.filter && typeof filters.filter === 'object'
            ? filters.filter.name
            : '';
    const [search, setSearch] = useState(filterName || '');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const confirmDelete = (id: number) => {
        setDeleteId(id);
    };

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/admin/users/${deleteId}`, {
                onFinish: () => setDeleteId(null),
            });
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/users', search ? { 'filter[name]': search } : {}, {
            preserveState: true,
        });
    };

    return (
        <AdminLayout
            breadcrumbs={[{ title: 'Manajemen User', href: '/admin/users' }]}
        >
            <Head title="Manajemen User" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-terra-900">
                            Manajemen User
                        </h1>
                        <p className="mt-1 text-terra-500">
                            Kelola user admin dan staff
                        </p>
                    </div>
                    <Link
                        href="/admin/users/create"
                        className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 font-medium text-white transition-all hover:bg-wood-dark"
                    >
                        <Plus className="h-5 w-5" />
                        Tambah User
                    </Link>
                </div>

                {/* Search */}
                <div className="rounded-2xl border border-terra-100 bg-white p-4 shadow-sm">
                    <form onSubmit={handleSearch} className="relative max-w-md">
                        <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-terra-400" />
                        <input
                            type="text"
                            placeholder="Cari nama atau email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-terra-200 bg-sand-50 py-2.5 pr-4 pl-10 text-terra-900 transition-all placeholder:text-terra-400 focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                        />
                    </form>
                </div>

                {/* Users Table */}
                <div className="overflow-hidden rounded-2xl border border-terra-100 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-terra-100 bg-sand-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-terra-600">
                                        User
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-terra-600">
                                        Role
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-terra-600">
                                        Terdaftar
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-medium text-terra-600">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-terra-100">
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="py-8 text-center text-terra-500"
                                        >
                                            Tidak ada user ditemukan
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="transition-colors hover:bg-sand-50/50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-terra-100">
                                                        {user.roles.includes(
                                                            'super-admin',
                                                        ) ? (
                                                            <Shield className="h-5 w-5 text-red-600" />
                                                        ) : user.roles.includes(
                                                              'admin',
                                                          ) ? (
                                                            <UserCog className="h-5 w-5 text-purple-600" />
                                                        ) : (
                                                            <User className="h-5 w-5 text-terra-600" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-terra-900">
                                                            {user.name}
                                                        </p>
                                                        <p className="text-sm text-terra-500">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles.map(
                                                        (role: string) => (
                                                            <span
                                                                key={role}
                                                                className={`rounded-full px-2 py-1 text-xs font-medium ${roleColors[role] || 'bg-terra-100 text-terra-700'}`}
                                                            >
                                                                {roleLabels[
                                                                    role
                                                                ] || role}
                                                            </span>
                                                        ),
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-terra-600">
                                                {user.created_at}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/users/${user.id}/edit`}
                                                        className="rounded-lg p-2 text-terra-500 transition-colors hover:bg-terra-100"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                    {!user.roles.includes(
                                                        'super-admin',
                                                    ) && (
                                                        <button
                                                            onClick={() =>
                                                                confirmDelete(
                                                                    user.id,
                                                                )
                                                            }
                                                            className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <Pagination
                        paginator={users}
                        className="border-t border-terra-100 px-6 py-4"
                    />
                </div>
            </div>

            <Dialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Hapus</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus user ini? Tindakan
                            ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteId(null)}
                        >
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
