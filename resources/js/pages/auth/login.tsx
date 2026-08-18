import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/hooks/use-translation';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    const { t } = useTranslation();

    return (
        <AuthLayout
            title={t('auth.login.title')}
            description={t('auth.login.description')}
        >
            <Head title={t('auth.login.page_title')} />

            {status && (
                <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="email"
                                    className="font-medium text-neutral-700"
                                >
                                    {t('auth.login.email_label')}
                                </Label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder={t('auth.login.email_placeholder')}
                                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50 focus:outline-none"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="password"
                                        className="font-medium text-neutral-700"
                                    >
                                        {t('auth.login.password_label')}
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-sm text-teal-600 transition-colors hover:text-teal-700"
                                            tabIndex={5}
                                        >
                                            {t('auth.login.forgot_password')}
                                        </TextLink>
                                    )}
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder={t('auth.login.password_placeholder')}
                                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50 focus:outline-none"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="border-neutral-300 data-[state=checked]:border-teal-600 data-[state=checked]:bg-teal-600"
                                />
                                <Label
                                    htmlFor="remember"
                                    className="cursor-pointer text-sm text-neutral-600"
                                >
                                    {t('auth.login.remember_me')}
                                </Label>
                            </div>

                            <button
                                type="submit"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3.5 font-medium text-white shadow-sm transition-all duration-300 hover:bg-teal-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing && (
                                    <Spinner className="text-white" />
                                )}
                                {t('auth.login.submit')}
                            </button>
                        </div>

                        {canRegister && (
                            <div className="pt-2 text-center text-sm text-neutral-500">
                                {t('auth.login.no_account')}{' '}
                                <TextLink
                                    href={register()}
                                    tabIndex={5}
                                    className="font-medium text-teal-600 transition-colors hover:text-teal-700"
                                >
                                    {t('auth.login.register_link')}
                                </TextLink>
                            </div>
                        )}
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
