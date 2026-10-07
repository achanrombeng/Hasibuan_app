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
  const siteName = siteSettings?.site_name || 'Hasibuan Design';
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
              <div className="grid gap-1.5">
                <Label htmlFor="name" className="text-[10px] tracking-[0.22em] uppercase font-medium text-neutral-700">
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
                  className="w-full border border-neutral-300/80 bg-neutral-50/40 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none transition-all"
                />
                <InputError message={errors.name} />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="email" className="text-[10px] tracking-[0.22em] uppercase font-medium text-neutral-700">
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
                  className="w-full border border-neutral-300/80 bg-neutral-50/40 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none transition-all"
                />
                <InputError message={errors.email} />
              </div>

              <div className="grid gap-1.5">
                <Label
                  htmlFor="password"
                  className="text-[10px] tracking-[0.22em] uppercase font-medium text-neutral-700"
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
                  className="w-full border border-neutral-300/80 bg-neutral-50/40 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none transition-all"
                />
                <InputError message={errors.password} />
              </div>

              <div className="grid gap-1.5">
                <Label
                  htmlFor="password_confirmation"
                  className="text-[10px] tracking-[0.22em] uppercase font-medium text-neutral-700"
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
                  className="w-full border border-neutral-300/80 bg-neutral-50/40 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none transition-all"
                />
                <InputError message={errors.password_confirmation} />
              </div>

              <button
                type="submit"
                tabIndex={5}
                disabled={processing}
                data-test="register-user-button"
                className="mt-2 flex w-full items-center justify-center gap-2 bg-[#111111] hover:bg-black px-6 py-3.5 text-[11px] tracking-[0.28em] uppercase font-medium text-white shadow-sm transition-all duration-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                {processing && <Spinner className="text-white" />}
                {t('auth.register.submit')}
              </button>
            </div>

            <div className="mt-4 pt-5 border-t border-neutral-100 text-center text-xs text-neutral-500 font-light">
              <span>{t('auth.register.has_account')}</span>{' '}
              <TextLink
                href={login()}
                tabIndex={6}
                className="font-medium text-neutral-900 hover:text-black tracking-[0.15em] uppercase text-[11px] underline underline-offset-4 ml-1 transition-colors"
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
