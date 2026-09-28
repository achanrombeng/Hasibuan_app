import { login } from '@/routes';
import { email } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
  const { t } = useTranslation();

  return (
    <AuthLayout
      title={t('auth.forgot_password.title')}
      description={t('auth.forgot_password.description')}
    >
      <Head title={t('auth.forgot_password.page_title')} />

      {status && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-600">
          {status}
        </div>
      )}

      <div className="space-y-6">
        <Form {...email.form()}>
          {({ processing, errors }) => (
            <>
              <div className="grid gap-2">
                <Label htmlFor="email" className="font-medium text-terra-700">
                  {t('auth.forgot_password.email_label')}
                </Label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="off"
                  autoFocus
                  placeholder={t('auth.forgot_password.email_placeholder')}
                  className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all placeholder:text-terra-400 focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                />
                <InputError message={errors.email} />
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={processing}
                  data-test="email-password-reset-link-button"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-terra-900 px-6 py-3.5 font-medium text-white shadow-sm transition-all duration-300 hover:bg-wood-dark hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {processing && (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  )}
                  {t('auth.forgot_password.submit')}
                </button>
              </div>
            </>
          )}
        </Form>

        <div className="text-center text-sm text-terra-500">
          <span>{t('auth.forgot_password.back_to_login')} </span>
          <TextLink
            href={login()}
            className="font-medium text-wood transition-colors hover:text-wood-dark"
          >
            {t('auth.forgot_password.login_page')}
          </TextLink>
        </div>
      </div>
    </AuthLayout>
  );
}
