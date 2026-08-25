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
      'Disable 2FA',
      'Are you sure you want to disable two-factor authentication?',
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
          Add additional security to your account using two-factor authentication.
        </p>
      </header>

      <div className="mt-6">
        {twoFactorEnabled ? (
          <div className="flex flex-col items-start justify-start space-y-4">
            <Badge
              variant="default"
              className="border-none bg-green-100 text-green-700 hover:bg-green-200"
            >
              Enabled
            </Badge>
            <p className="text-sm text-terra-600">
              When two-factor authentication is enabled, you will be prompted for a secure, random token during authentication. You may retrieve this token from your phone's Google Authenticator application.
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
                <ShieldBan className="mr-2 h-4 w-4" /> Disable 2FA
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-start justify-start space-y-4">
            <Badge
              variant="destructive"
              className="border-none bg-red-100 text-red-700 hover:bg-red-200"
            >
              Disabled
            </Badge>
            <p className="text-sm text-terra-600">
              When you enable two-factor authentication, you will be prompted for a secure, random token during authentication. You may retrieve this token from your phone's Google Authenticator application.
            </p>

            <div>
              {hasSetupData ? (
                <button
                  type="button"
                  onClick={() => setShowSetupModal(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#a67c52] px-6 py-2.5 font-medium text-white shadow-md transition-all hover:bg-[#8e6843] active:scale-[0.98]"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Continue Setup
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleEnable}
                  disabled={enabling}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#a67c52] px-6 py-2.5 font-medium text-white shadow-md transition-all hover:bg-[#8e6843] active:scale-[0.98] disabled:opacity-50"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Enable 2FA
                </button>
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
