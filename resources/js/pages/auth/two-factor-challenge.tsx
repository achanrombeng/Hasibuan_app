import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import { useTranslation } from '@/hooks/use-translation';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/two-factor/login';
import { Form, Head } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useMemo, useState } from 'react';
import { ShieldCheck, Key } from 'lucide-react';

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

            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-wood/10 rounded-full flex items-center justify-center mx-auto">
                    {showRecoveryInput ? (
                        <Key className="w-8 h-8 text-wood" />
                    ) : (
                        <ShieldCheck className="w-8 h-8 text-wood" />
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
                                        className="w-full px-4 py-3 rounded-xl border border-terra-200 bg-sand-50 text-terra-900 placeholder:text-terra-400 focus:outline-none focus:ring-2 focus:ring-wood/50 focus:border-wood transition-all text-center font-mono tracking-wider"
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
                                                {Array.from(
                                                    { length: OTP_MAX_LENGTH },
                                                    (_, index) => (
                                                        <InputOTPSlot
                                                            key={index}
                                                            index={index}
                                                            className="w-12 h-14 text-xl border-terra-200 bg-sand-50 rounded-xl focus:ring-wood focus:border-wood"
                                                        />
                                                    ),
                                                )}
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>
                                    <InputError message={errors.code} />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-terra-900 hover:bg-wood-dark text-white font-medium py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                            >
                                {processing && <Spinner className="text-white" />}
                                {t('auth.two_factor.submit')}
                            </button>

                            <div className="text-center text-sm text-terra-500">
                                <span>atau </span>
                                <button
                                    type="button"
                                    className="text-wood font-medium hover:text-wood-dark transition-colors underline underline-offset-4"
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
