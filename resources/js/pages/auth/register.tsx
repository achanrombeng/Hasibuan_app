import { login } from '@/routes';
import { store } from '@/routes/register';
import { Form, Head, usePage } from '@inertiajs/react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/hooks/use-translation';
import AuthLayout from '@/layouts/auth-layout';
import { SiteSettings } from '@/types';

export default function Register() {
  const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
  const siteName = siteSettings?.site_name || 'Ronica';
  const { t } = useTranslation();

  return (
    <AuthLayout
      title={t('auth.register.title')}
      description={t('auth.register.description', { siteName })}
    >
      <Head title={t('auth.register.page_title')} />
      <Form
        {...store.form()}
        resetOnSuccess={['password', 'password_confirmation']}
        disableWhileProcessing
        className="flex flex-col gap-5"
      >
        {({ processing, errors }) => (
          <>
            <div className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="name" className="font-medium text-neutral-700">
                  {t('auth.register.name_label')}
                </Label>
                <input
                  id="name"
                  type="text"
                  required
                  autoFocus
                  tabIndex={1}
                  autoComplete="name"
                  name="name"
                  placeholder={t('auth.register.name_placeholder')}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50 focus:outline-none"
                />
                <InputError message={errors.name} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="font-medium text-neutral-700">
                  {t('auth.register.email_label')}
                </Label>
                <input
                  id="email"
                  type="email"
                  required
                  tabIndex={2}
                  autoComplete="email"
                  name="email"
                  placeholder={t('auth.register.email_placeholder')}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50 focus:outline-none"
                />
                <InputError message={errors.email} />
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="password"
                  className="font-medium text-neutral-700"
                >
                  {t('auth.register.password_label')}
                </Label>
                <input
                  id="password"
                  type="password"
                  required
                  tabIndex={3}
                  autoComplete="new-password"
                  name="password"
                  placeholder={t('auth.register.password_placeholder')}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50 focus:outline-none"
                />
                <InputError message={errors.password} />
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="password_confirmation"
                  className="font-medium text-neutral-700"
                >
                  {t('auth.register.confirm_password_label')}
                </Label>
                <input
                  id="password_confirmation"
                  type="password"
                  required
                  tabIndex={4}
                  autoComplete="new-password"
                  name="password_confirmation"
                  placeholder={t('auth.register.confirm_password_placeholder')}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50 focus:outline-none"
                />
                <InputError message={errors.password_confirmation} />
              </div>

              <button
                type="submit"
                tabIndex={5}
                disabled={processing}
                data-test="register-user-button"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3.5 font-medium text-white shadow-sm transition-all duration-300 hover:bg-teal-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processing && <Spinner className="text-white" />}
                {t('auth.register.submit')}
              </button>
            </div>

            <div className="pt-2 text-center text-sm text-neutral-500">
              {t('auth.register.has_account')}{' '}
              <TextLink
                href={login()}
                tabIndex={6}
                className="font-medium text-teal-600 transition-colors hover:text-teal-700"
              >
                {t('auth.register.login_link')}
              </TextLink>
            </div>
          </>
        )}
      </Form>
    </AuthLayout>
  );
}
