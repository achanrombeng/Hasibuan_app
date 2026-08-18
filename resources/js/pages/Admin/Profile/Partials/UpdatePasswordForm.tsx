import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import { update as userPasswordUpdate } from '@/routes/user-password';

export default function UpdatePasswordForm({
    className = '',
}: {
    className?: string;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(userPasswordUpdate.url(), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={`bg-white rounded-2xl p-6 shadow-sm border border-terra-100 ${className}`}>
            <header>
                <h2 className="text-lg font-semibold text-terra-900">
                    Update Password
                </h2>
                <p className="mt-1 text-sm text-terra-500">
                    Pastikan akun Anda menggunakan password yang panjang dan acak agar tetap aman.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div className="grid gap-2">
                    <Label htmlFor="current_password">Password Saat Ini</Label>

                    <Input
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        type="password"
                        className="mt-1 block w-full bg-sand-50 border-terra-200 focus:border-wood focus:ring-wood/50 text-terra-900 rounded-xl py-2.5 h-auto px-4"
                        autoComplete="current-password"
                    />

                    <InputError message={errors.current_password} className="mt-2" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password">Password Baru</Label>

                    <Input
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="mt-1 block w-full bg-sand-50 border-terra-200 focus:border-wood focus:ring-wood/50 text-terra-900 rounded-xl py-2.5 h-auto px-4"
                        autoComplete="new-password"
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password_confirmation">Konfirmasi Password</Label>

                    <Input
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type="password"
                        className="mt-1 block w-full bg-sand-50 border-terra-200 focus:border-wood focus:ring-wood/50 text-terra-900 rounded-xl py-2.5 h-auto px-4"
                        autoComplete="new-password"
                    />

                    <InputError message={errors.password_confirmation} className="mt-2" />
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
                        <p className="text-sm text-terra-500">Tersimpan.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
