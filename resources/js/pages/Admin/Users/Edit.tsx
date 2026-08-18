import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Eye, EyeOff, Save } from 'lucide-react';
import { useState } from 'react';

interface UserData {
    id: number;
    name: string;
    email: string;
    roles: string[];
}

interface EditUserProps {
    user: UserData;
    roles: string[];
}

const roleLabels: Record<string, string> = {
    'super-admin': 'Super Admin',
    admin: 'Admin',
    manager: 'Manager',
    staff: 'Staff',
    customer: 'Customer',
};

export default function EditUser({ user, roles }: EditUserProps) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        role: user.roles[0] || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Manajemen User', href: '/admin/users' },
                { title: 'Edit User', href: `/admin/users/${user.id}/edit` },
            ]}
        >
            <Head title={`Edit User: ${user.name}`} />

            <div className="mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/users"
                        className="rounded-lg p-2 text-terra-600 transition-colors hover:bg-terra-100"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-terra-900">
                            Edit User
                        </h1>
                        <p className="mt-1 text-terra-500">
                            Perbarui informasi user
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-2xl border border-terra-100 bg-white p-6 shadow-sm"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium text-terra-700">
                            Nama Lengkap
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                            placeholder="Masukkan nama lengkap"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-terra-700">
                            Email
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                            placeholder="email@example.com"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-terra-700">
                            Password Baru{' '}
                            <span className="text-terra-400">
                                (kosongkan jika tidak ingin mengubah)
                            </span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 pr-12 text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                                placeholder="Masukkan password baru"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 right-4 -translate-y-1/2 text-terra-400 hover:text-terra-600"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-terra-700">
                            Role
                        </label>
                        <select
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                        >
                            <option value="">Pilih Role</option>
                            {roles.map((role) => (
                                <option key={role} value={role}>
                                    {roleLabels[role] || role}
                                </option>
                            ))}
                        </select>
                        {errors.role && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.role}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-terra-100 pt-4">
                        <Link
                            href="/admin/users"
                            className="rounded-xl border border-terra-200 px-6 py-2.5 text-terra-700 transition-colors hover:bg-terra-50"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-xl bg-terra-900 px-6 py-2.5 text-white transition-colors hover:bg-wood-dark disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
