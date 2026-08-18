import { update } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/hooks/use-translation';
import AuthLayout from '@/layouts/auth-layout';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { t } = useTranslation();

    return (
        <AuthLayout
            title={t('auth.reset_password.title')}
            description={t('auth.reset_password.description')}
        >
            <Head title={t('auth.reset_password.page_title')} />

            <Form
                {...update.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <div className="grid gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-terra-700 font-medium">
                                Email
                            </Label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                readOnly
                                className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-terra-100 text-terra-600 cursor-not-allowed"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-terra-700 font-medium">
                                {t('auth.reset_password.new_password_label')}
                            </Label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                autoComplete="new-password"
                                autoFocus
                                placeholder={t('auth.reset_password.new_password_placeholder')}
                                className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 placeholder:text-terra-400 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation" className="text-terra-700 font-medium">
                                {t('auth.reset_password.confirm_password_label')}
                            </Label>
                            <input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                autoComplete="new-password"
                                placeholder={t('auth.reset_password.confirm_password_placeholder')}
                                className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 placeholder:text-terra-400 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all"
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            data-test="reset-password-button"
                            className="mt-2 w-full bg-terra-900 hover:bg-wood-dark text-white font-medium py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                        >
                            {processing && <Spinner className="text-white" />}
                            {t('auth.reset_password.submit')}
                        </button>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
