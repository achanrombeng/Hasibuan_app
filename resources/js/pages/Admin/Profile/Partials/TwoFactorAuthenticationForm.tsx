import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { ConfirmDialog, useConfirmDialog } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { disable, enable } from '@/routes/two-factor';
import { SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { ShieldBan, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

// Simplified Hook usage wrapper or direct component
export default function TwoFactorAuthenticationForm({
  className = '',
}: {
  className?: string;
}) {
  const { auth } = usePage<SharedData>().props;
  const twoFactorEnabled = auth.user.two_factor_enabled;

  // We need to re-implement the hook usage or import it if possible
  // The previous file used a hook `useTwoFactorAuth`. Let's assume it works.
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

  const [showSetupModal, setShowSetupModal] = useState<boolean>(false);
  const [enabling, setEnabling] = useState(false);
  const [disabling, setDisabling] = useState(false);
  const { state: confirmState, showConfirm, closeConfirm } = useConfirmDialog();

  const handleEnable = () => {
    setEnabling(true);
    router.post(
      enable.url(),
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          setShowSetupModal(true);
          setEnabling(false);
        },
        onError: () => setEnabling(false),
      },
    );
  };

  const handleDisable = () => {
    showConfirm(
      'Nonaktifkan 2FA',
      'Apakah Anda yakin ingin menonaktifkan 2FA?',
      () => {
        setDisabling(true);
        router.delete(disable.url(), {
          preserveScroll: true,
          onFinish: () => setDisabling(false),
        });
      },
      'danger',
    );
  };

  return (
    <section
      className={`rounded-2xl border border-terra-100 bg-white p-6 shadow-sm ${className}`}
    >
      <header>
        <h2 className="text-lg font-semibold text-terra-900">
          Two-Factor Authentication
        </h2>
        <p className="mt-1 text-sm text-terra-500">
          Tambahkan keamanan ekstra pada akun Anda menggunakan autentikasi dua
          faktor.
        </p>
      </header>

      <div className="mt-6">
        {twoFactorEnabled ? (
          <div className="flex flex-col items-start justify-start space-y-4">
            <Badge
              variant="default"
              className="border-none bg-green-100 text-green-700 hover:bg-green-200"
            >
              Aktif
            </Badge>
            <p className="text-sm text-terra-600">
              Saat autentikasi dua faktor diaktifkan, Anda akan diminta token
              acak yang aman saat login. Anda dapat mengambil token ini dari
              aplikasi Google Authenticator di telepon Anda.
            </p>

            <TwoFactorRecoveryCodes
              recoveryCodesList={recoveryCodesList}
              fetchRecoveryCodes={fetchRecoveryCodes}
              errors={errors}
            />

            <div className="relative inline">
              <Button
                variant="destructive"
                onClick={handleDisable}
                disabled={disabling}
                className="border-none bg-red-50 text-red-600 hover:bg-red-100"
              >
                <ShieldBan className="mr-2 h-4 w-4" /> Nonaktifkan 2FA
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-start justify-start space-y-4">
            <Badge
              variant="destructive"
              className="border-none bg-red-100 text-red-700 hover:bg-red-200"
            >
              Nonaktif
            </Badge>
            <p className="text-sm text-terra-600">
              Saat anda mengaktifkan autentikasi dua faktor, Anda akan diminta
              token acak yang aman saat login. Token ini dapat diambil dari
              aplikasi Google Authenticator di telepon Anda.
            </p>

            <div>
              {hasSetupData ? (
                <Button
                  onClick={() => setShowSetupModal(true)}
                  className="rounded-xl bg-terra-900 text-white hover:bg-wood-dark"
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Lanjutkan Setup
                </Button>
              ) : (
                <Button
                  onClick={handleEnable}
                  disabled={enabling}
                  className="rounded-xl bg-terra-900 text-white hover:bg-wood-dark"
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Aktifkan 2FA
                </Button>
              )}
            </div>
          </div>
        )}

        <TwoFactorSetupModal
          isOpen={showSetupModal}
          onClose={() => setShowSetupModal(false)}
          requiresConfirmation={false}
          twoFactorEnabled={!!twoFactorEnabled}
          qrCodeSvg={qrCodeSvg}
          manualSetupKey={manualSetupKey}
          clearSetupData={clearSetupData}
          fetchSetupData={fetchSetupData}
          errors={errors}
        />
      </div>

      <ConfirmDialog
        open={confirmState.open}
        onOpenChange={closeConfirm}
        title={confirmState.title}
        description={confirmState.description}
        variant={confirmState.variant}
        onConfirm={confirmState.onConfirm}
      />
    </section>
  );
}
