import AdminLayout from '@/layouts/admin/admin-layout';
import { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import TwoFactorAuthenticationForm from './Partials/TwoFactorAuthenticationForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

interface EditProps {
    mustVerifyEmail: boolean;
    status?: string;
    twoFactorEnabled: boolean;
}

export default function Edit({
    mustVerifyEmail,
    status,
    twoFactorEnabled,
}: EditProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AdminLayout
            breadcrumbs={[{ title: 'Profile Saya', href: '/admin/profile' }]}
        >
            <Head title="Profile Saya" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-terra-900">
                        Pengaturan Profile
                    </h1>
                    <p className="mt-1 text-terra-500">
                        Kelola informasi profile dan keamanan akun Anda
                    </p>
                </div>

                <div className="space-y-8">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />

                    <UpdatePasswordForm />

                    {twoFactorEnabled && <TwoFactorAuthenticationForm />}

                    <DeleteUserForm />
                </div>
            </div>
        </AdminLayout>
    );
}
