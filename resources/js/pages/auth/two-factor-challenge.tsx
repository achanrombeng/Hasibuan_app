import InputError from '@/components/input-error';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/hooks/use-translation';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/two-factor/login';
import { Form, Head } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Key, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function TwoFactorChallenge() {
  const { t } = useTranslation();
  const [showRecoveryInput, setShowRecoveryInput] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');

  const authConfigContent = useMemo<{
    title: string;
    description: string;
    toggleText: string;
  }>(() => {
    if (showRecoveryInput) {
      return {
        title: t('auth.two_factor.recovery_title'),
        description: t('auth.two_factor.recovery_description'),
        toggleText: t('auth.two_factor.use_auth_code'),
      };
    }

    return {
      title: t('auth.two_factor.title'),
      description: t('auth.two_factor.description'),
      toggleText: t('auth.two_factor.use_recovery_code'),
    };
  }, [showRecoveryInput, t]);

  const toggleRecoveryMode = (clearErrors: () => void): void => {
    setShowRecoveryInput(!showRecoveryInput);
    clearErrors();
    setCode('');
  };

  return (
    <AuthLayout
      title={authConfigContent.title}
      description={authConfigContent.description}
    >
      <Head title={t('auth.two_factor.page_title')} />

      <div className="mb-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-wood/10">
          {showRecoveryInput ? (
            <Key className="h-8 w-8 text-wood" />
          ) : (
            <ShieldCheck className="h-8 w-8 text-wood" />
          )}
        </div>
      </div>

      <div className="space-y-6">
        <Form
          {...store.form()}
          className="space-y-5"
          resetOnError
          resetOnSuccess={!showRecoveryInput}
        >
          {({ errors, processing, clearErrors }) => (
            <>
              {showRecoveryInput ? (
                <div className="grid gap-2">
                  <input
                    name="recovery_code"
                    type="text"
                    placeholder={t('auth.two_factor.recovery_placeholder')}
                    autoFocus={showRecoveryInput}
                    required
                    className="w-full rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-center font-mono tracking-wider text-terra-900 transition-all placeholder:text-terra-400 focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                  />
                  <InputError message={errors.recovery_code} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-3 text-center">
                  <div className="flex w-full items-center justify-center">
                    <InputOTP
                      name="code"
                      maxLength={OTP_MAX_LENGTH}
                      value={code}
                      onChange={(value) => setCode(value)}
                      disabled={processing}
                      pattern={REGEXP_ONLY_DIGITS}
                    >
                      <InputOTPGroup className="gap-2">
                        {Array.from({ length: OTP_MAX_LENGTH }, (_, index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="h-14 w-12 rounded-xl border-terra-200 bg-sand-50 text-xl focus:border-wood focus:ring-wood"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <InputError message={errors.code} />
                </div>
              )}

              <button
                type="submit"
                disabled={processing}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-terra-900 px-6 py-3.5 font-medium text-white shadow-sm transition-all duration-300 hover:bg-wood-dark hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processing && <Spinner className="text-white" />}
                {t('auth.two_factor.submit')}
              </button>

              <div className="text-center text-sm text-terra-500">
                <span>atau </span>
                <button
                  type="button"
                  className="font-medium text-wood underline underline-offset-4 transition-colors hover:text-wood-dark"
                  onClick={() => toggleRecoveryMode(clearErrors)}
                >
                  {authConfigContent.toggleText}
                </button>
              </div>
            </>
          )}
        </Form>
      </div>
    </AuthLayout>
  );
}
