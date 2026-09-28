import AdminLayout from '@/layouts/admin/admin-layout';
import { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

interface EditProps {
  mustVerifyEmail: boolean;
  status?: string;
  twoFactorEnabled: boolean;
}

export default function Edit({ mustVerifyEmail, status }: EditProps) {
  const { auth } = usePage<SharedData>().props;

  return (
    <AdminLayout
      breadcrumbs={[{ title: 'My Profile', href: '/admin/profile' }]}
    >
      <Head title="My Profile" />

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-terra-900">
            Profile Settings
          </h1>
          <p className="mt-1 text-terra-500">
            Manage your profile information and account security
          </p>
        </div>

        <div className="space-y-8">
          <UpdateProfileInformationForm
            mustVerifyEmail={mustVerifyEmail}
            status={status}
          />

          <UpdatePasswordForm />
        </div>
      </div>
    </AdminLayout>
  );
}
