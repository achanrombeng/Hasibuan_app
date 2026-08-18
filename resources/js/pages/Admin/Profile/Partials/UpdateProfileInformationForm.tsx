import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { FormEventHandler } from 'react';
import { SharedData } from '@/types';
import { update as profileUpdate } from '@/routes/profile';
import { send as verificationSend } from '@/routes/verification';

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

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(profileUpdate.url());
    };

    return (
        <section className={`bg-white rounded-2xl p-6 shadow-sm border border-terra-100 ${className}`}>
            <header>
                <h2 className="text-lg font-semibold text-terra-900">
                    Informasi Profile
                </h2>
                <p className="mt-1 text-sm text-terra-500">
                    Update detail akun profile dan email Anda.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div className="grid gap-2">
                    <Label htmlFor="name" className="text-terra-700">Nama</Label>

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
                                Alamat email Anda belum diversifikasi.{' '}
                                <Link
                                    href={verificationSend.url()}
                                    method="post"
                                    as="button"
                                    className="underline text-terra-600 hover:text-terra-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wood"
                                >
                                    Klik disini untuk mengirim ulang email verifikasi.
                                </Link>
                            </p>

                            {status === 'verification-link-sent' && (
                                <div className="mt-2 font-medium text-sm text-green-600">
                                    Link verifikasi baru telah dikirim ke email Anda.
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <Button disabled={processing} className="bg-terra-900 hover:bg-wood-dark text-white rounded-xl">
                        Simpan
                    </Button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-terra-500">Simpan.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
