import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { FormEventHandler, useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { SharedData } from '@/types';
import { update as profileUpdate } from '@/routes/profile';
import { send as verificationSend } from '@/routes/verification';
import { Save } from 'lucide-react';

export default function UpdateProfileInformationForm({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage<SharedData>().props.auth.user;
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const { t } = useTranslation();

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setShowConfirmDialog(true);
    };

    const confirmSaveProfile = () => {
        patch(profileUpdate.url(), {
            onError: () => {
                setShowConfirmDialog(false);
            },
        });
    };

    return (
        <section className={`bg-white rounded-2xl p-6 shadow-sm border border-terra-100 ${className}`}>
            <header>
                <h2 className="text-lg font-semibold text-terra-900">
                    Profile Information
                </h2>
                <p className="mt-1 text-sm text-terra-500">
                    Update your account profile details and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div className="grid gap-2">
                    <Label htmlFor="name" className="text-terra-700">Full Name</Label>

                    <Input
                        id="name"
                        className="mt-1 block w-full bg-sand-50 border-terra-200 focus:border-wood focus:ring-wood/50 text-terra-900 rounded-xl py-2.5 h-auto px-4"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email" className="text-terra-700">Email</Label>

                    <Input
                        id="email"
                        type="email"
                        className="mt-1 block w-full bg-sand-50 border-terra-200 focus:border-wood focus:ring-wood/50 text-terra-900 rounded-xl py-2.5 h-auto px-4"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />

                    {mustVerifyEmail && user.email_verified_at === null && (
                        <div>
                            <p className="text-sm mt-2 text-terra-600">
                                Your email address is unverified.{' '}
                                <Link
                                    href={verificationSend.url()}
                                    method="post"
                                    as="button"
                                    className="underline text-terra-600 hover:text-terra-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wood"
                                >
                                    Click here to resend the verification email.
                                </Link>
                            </p>

                            {status === 'verification-link-sent' && (
                                <div className="mt-2 font-medium text-sm text-green-600">
                                    A new verification link has been sent to your email address.
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#a67c52] px-6 py-2.5 font-medium text-white shadow-md transition-all hover:bg-[#8e6843] active:scale-[0.98] disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        {processing ? 'Saving...' : 'Save Changes'}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-terra-500">Saved.</p>
                    </Transition>
                </div>
            </form>

            {/* Confirm Save Profile Info Dialog */}
            <ConfirmDialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
                title={t('admin.profile.confirm_save_info_title')}
                description={t('admin.profile.confirm_save_info_desc')}
                confirmText={t('admin.profile.confirm_save_info_button')}
                cancelText={t('common.cancel')}
                variant="default"
                isLoading={processing}
                onConfirm={confirmSaveProfile}
            />
        </section>
    );
}
