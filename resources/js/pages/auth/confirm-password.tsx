import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/hooks/use-translation';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/password/confirm';
import { Form, Head } from '@inertiajs/react';
import { Lock } from 'lucide-react';

export default function ConfirmPassword() {
    const { t } = useTranslation();

    return (
        <AuthLayout
            title={t('auth.confirm_password.title')}
            description={t('auth.confirm_password.description')}
        >
            <Head title={t('auth.confirm_password.page_title')} />

            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-wood/10 rounded-full flex items-center justify-center mx-auto">
                    <Lock className="w-8 h-8 text-wood" />
                </div>
            </div>

            <Form {...store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <div className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-terra-700 font-medium">
                                {t('auth.confirm_password.password_label')}
                            </Label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                placeholder={t('auth.confirm_password.password_placeholder')}
                                autoComplete="current-password"
                                autoFocus
                                className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 placeholder:text-terra-400 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            data-test="confirm-password-button"
                            className="w-full bg-terra-900 hover:bg-wood-dark text-white font-medium py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                        >
                            {processing && <Spinner className="text-white" />}
                            {t('auth.confirm_password.submit')}
                        </button>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
