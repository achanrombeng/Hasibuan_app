import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/hooks/use-translation';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head, Link } from '@inertiajs/react';

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
        <div className="mb-6 border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-center text-xs font-light tracking-wide text-emerald-800">
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
              {/* Email Address */}
              <div className="grid gap-1.5">
                <Label
                  htmlFor="email"
                  className="text-[10px] tracking-[0.22em] uppercase font-medium text-neutral-700"
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
                  className="w-full border border-neutral-300/80 bg-neutral-50/40 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none transition-all"
                />
                <InputError message={errors.email} />
              </div>

              {/* Password */}
              <div className="grid gap-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-[10px] tracking-[0.22em] uppercase font-medium text-neutral-700"
                  >
                    {t('auth.login.password_label')}
                  </Label>
                  {canResetPassword && (
                    <TextLink
                      href={request()}
                      className="text-[11px] tracking-wider uppercase text-neutral-500 hover:text-black transition-colors font-light"
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
                  className="w-full border border-neutral-300/80 bg-neutral-50/40 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none transition-all"
                />
                <InputError message={errors.password} />
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2.5 pt-1">
                <Checkbox
                  id="remember"
                  name="remember"
                  tabIndex={3}
                  className="border-neutral-300 rounded-[2px] data-[state=checked]:border-neutral-900 data-[state=checked]:bg-neutral-900"
                />
                <Label
                  htmlFor="remember"
                  className="cursor-pointer text-xs font-light text-neutral-600 select-none"
                >
                  {t('auth.login.remember_me')}
                </Label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                tabIndex={4}
                disabled={processing}
                data-test="login-button"
                className="mt-2 flex w-full items-center justify-center gap-2 bg-[#111111] hover:bg-black px-6 py-3.5 text-[11px] tracking-[0.28em] uppercase font-medium text-white shadow-sm transition-all duration-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                {processing && <Spinner className="text-white" />}
                {t('auth.login.submit')}
              </button>

              {/* Register Link */}
              {canRegister && (
                <div className="mt-4 pt-5 border-t border-neutral-100 text-center text-xs text-neutral-500 font-light">
                  <span>{t('auth.login.no_account') || "Don't have an account?"}</span>{' '}
                  <Link
                    href="/register"
                    className="font-medium text-neutral-900 hover:text-black tracking-[0.15em] uppercase text-[11px] underline underline-offset-4 ml-1 transition-colors"
                  >
                    {t('auth.login.register_link') || 'Register'}
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </Form>
    </AuthLayout>
  );
}
