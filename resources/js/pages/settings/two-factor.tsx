import HeadingSmall from '@/components/heading-small';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { useTranslation } from '@/hooks/use-translation';
import SettingsLayout from '@/layouts/settings/layout';
import { disable, enable } from '@/routes/two-factor';
import { Form, Head } from '@inertiajs/react';
import { ShieldBan, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

interface TwoFactorProps {
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
}

export default function TwoFactor({
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: TwoFactorProps) {
    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();
    const { t } = useTranslation();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

    return (
        <SettingsLayout>
            <Head title={t('settings.two_factor.title')} />

            <div>
                <HeadingSmall
                    title={t('admin.profile.two_factor')}
                    description={t('admin.profile.two_factor')}
                />

                <div className="mt-6">
                    {twoFactorEnabled ? (
                        <div className="flex flex-col items-start justify-start space-y-4">
                            <Badge
                                variant="default"
                                className="bg-green-500 hover:bg-green-600"
                            >
                                {t('common.active')}
                            </Badge>
                            <p className="text-terra-500">
                                Dengan autentikasi dua faktor aktif, Anda akan
                                diminta memasukkan PIN keamanan saat login. PIN
                                ini dapat diambil dari aplikasi TOTP di ponsel
                                Anda (seperti Google Authenticator atau Authy).
                            </p>

                            <TwoFactorRecoveryCodes
                                recoveryCodesList={recoveryCodesList}
                                fetchRecoveryCodes={fetchRecoveryCodes}
                                errors={errors}
                            />

                            <div className="relative inline">
                                <Form {...disable.form()}>
                                    {({ processing }) => (
                                        <Button
                                            variant="destructive"
                                            type="submit"
                                            disabled={processing}
                                            className="rounded-sm"
                                        >
                                            <ShieldBan className="mr-2 h-4 w-4" />{' '}
                                            {t('admin.profile.disable_2fa')}
                                        </Button>
                                    )}
                                </Form>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-start justify-start space-y-4">
                            <Badge
                                variant="outline"
                                className="border-terra-300 text-terra-500"
                            >
                                {t('common.inactive')}
                            </Badge>
                            <p className="text-terra-500">
                                Aktifkan autentikasi dua faktor untuk menambah
                                lapisan keamanan pada akun Anda. Anda akan
                                diminta memasukkan PIN dari aplikasi TOTP setiap
                                kali login.
                            </p>

                            <div>
                                {hasSetupData ? (
                                    <Button
                                        onClick={() => setShowSetupModal(true)}
                                        className="rounded-sm bg-teal-500 text-white hover:bg-teal-600"
                                    >
                                        <ShieldCheck className="mr-2 h-4 w-4" />
                                        Lanjutkan Setup
                                    </Button>
                                ) : (
                                    <Form
                                        {...enable.form()}
                                        onSuccess={() =>
                                            setShowSetupModal(true)
                                        }
                                    >
                                        {({ processing }) => (
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="rounded-sm bg-teal-500 text-white hover:bg-teal-600"
                                            >
                                                <ShieldCheck className="mr-2 h-4 w-4" />
                                                {t('admin.profile.enable_2fa')}
                                            </Button>
                                        )}
                                    </Form>
                                )}
                            </div>
                        </div>
                    )}

                    <TwoFactorSetupModal
                        isOpen={showSetupModal}
                        onClose={() => setShowSetupModal(false)}
                        requiresConfirmation={requiresConfirmation}
                        twoFactorEnabled={twoFactorEnabled}
                        qrCodeSvg={qrCodeSvg}
                        manualSetupKey={manualSetupKey}
                        clearSetupData={clearSetupData}
                        fetchSetupData={fetchSetupData}
                        errors={errors}
                    />
                </div>
            </div>
        </SettingsLayout>
    );
}
