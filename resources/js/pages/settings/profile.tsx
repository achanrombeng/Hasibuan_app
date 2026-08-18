import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SettingsLayout from '@/layouts/settings/layout';

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslation();

    return (
        <SettingsLayout>
            <Head title={t('settings.profile.title')} />

            <div className="space-y-8">
                <div>
                    <HeadingSmall
                        title={t('settings.profile.update_info')}
                        description={t('settings.profile.update_info')}
                    />

                    <div className="mt-6">
                        <Form
                            {...ProfileController.update.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            className="space-y-6"
                        >
                            {({ processing, recentlySuccessful, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">{t('settings.profile.name')}</Label>
                                        <Input
                                            id="name"
                                            className="mt-1 block w-full rounded-sm border-terra-200 focus:border-teal-500 focus:ring-teal-500"
                                            defaultValue={auth.user.name}
                                            name="name"
                                            required
                                            autoComplete="name"
                                            placeholder="Nama lengkap"
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.name}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">
                                            {t('settings.profile.email')}
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            className="mt-1 block w-full rounded-sm border-terra-200 focus:border-teal-500 focus:ring-teal-500"
                                            defaultValue={auth.user.email}
                                            name="email"
                                            required
                                            autoComplete="username"
                                            placeholder="Email"
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.email}
                                        />
                                    </div>

                                    {mustVerifyEmail &&
                                        auth.user.email_verified_at ===
                                            null && (
                                            <div className="rounded-sm border border-yellow-200 bg-yellow-50 p-4">
                                                <p className="text-sm text-yellow-700">
                                                    Email Anda belum
                                                    terverifikasi.{' '}
                                                    <Link
                                                        href={send()}
                                                        as="button"
                                                        className="font-medium text-yellow-800 underline hover:text-yellow-900"
                                                    >
                                                        Klik di sini untuk
                                                        mengirim ulang email
                                                        verifikasi.
                                                    </Link>
                                                </p>

                                                {status ===
                                                    'verification-link-sent' && (
                                                    <p className="mt-2 text-sm font-medium text-green-600">
                                                        Link verifikasi baru
                                                        telah dikirim ke email
                                                        Anda.
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                    <div className="flex items-center gap-4">
                                        <Button
                                            disabled={processing}
                                            data-test="update-profile-button"
                                            className="rounded-sm bg-teal-500 text-white hover:bg-teal-600"
                                        >
                                            Simpan
                                        </Button>

                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-in-out"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-green-600">
                                                Tersimpan
                                            </p>
                                        </Transition>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>
                </div>

                <hr className="border-terra-100" />

                <DeleteUser />
            </div>
        </SettingsLayout>
    );
}
