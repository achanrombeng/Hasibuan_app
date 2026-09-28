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
              <Label htmlFor="email" className="font-medium text-terra-700">
                Email
              </Label>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-terra-200 bg-terra-100 px-4 py-3 text-terra-600"
              />
              <InputError message={errors.email} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password" className="font-medium text-terra-700">
                {t('auth.reset_password.new_password_label')}
              </Label>
              <input
                id="password"
                type="password"
                name="password"
                autoComplete="new-password"
                autoFocus
                placeholder={t('auth.reset_password.new_password_placeholder')}
                className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all placeholder:text-terra-400 focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
              />
              <InputError message={errors.password} />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="password_confirmation"
                className="font-medium text-terra-700"
              >
                {t('auth.reset_password.confirm_password_label')}
              </Label>
              <input
                id="password_confirmation"
                type="password"
                name="password_confirmation"
                autoComplete="new-password"
                placeholder={t(
                  'auth.reset_password.confirm_password_placeholder',
                )}
                className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all placeholder:text-terra-400 focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
              />
              <InputError message={errors.password_confirmation} />
            </div>

            <button
              type="submit"
              disabled={processing}
              data-test="reset-password-button"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-terra-900 px-6 py-3.5 font-medium text-white shadow-sm transition-all duration-300 hover:bg-wood-dark hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
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
