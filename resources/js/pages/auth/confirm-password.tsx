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

      <div className="mb-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-wood/10">
          <Lock className="h-8 w-8 text-wood" />
        </div>
      </div>

      <Form {...store.form()} resetOnSuccess={['password']}>
        {({ processing, errors }) => (
          <div className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="password" className="font-medium text-terra-700">
                {t('auth.confirm_password.password_label')}
              </Label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder={t('auth.confirm_password.password_placeholder')}
                autoComplete="current-password"
                autoFocus
                className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-terra-900 transition-all placeholder:text-terra-400 focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
              />
              <InputError message={errors.password} />
            </div>

            <button
              type="submit"
              disabled={processing}
              data-test="confirm-password-button"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-terra-900 px-6 py-3.5 font-medium text-white shadow-sm transition-all duration-300 hover:bg-wood-dark hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
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
