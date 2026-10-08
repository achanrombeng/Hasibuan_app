import InputError from '@/components/input-error';
import { ConfirmDialog } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import { update as userPasswordUpdate } from '@/routes/user-password';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';

export default function UpdatePasswordForm({
  className = '',
}: {
  className?: string;
}) {
  const passwordInput = useRef<HTMLInputElement>(null);
  const currentPasswordInput = useRef<HTMLInputElement>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { t } = useTranslation();

  const { data, setData, errors, put, reset, processing, recentlySuccessful } =
    useForm({
      current_password: '',
      password: '',
      password_confirmation: '',
    });

  const updatePassword: FormEventHandler = (e) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const confirmSavePassword = () => {
    put(userPasswordUpdate.url(), {
      preserveScroll: true,
      onSuccess: () => reset(),
      onError: (errors) => {
        setShowConfirmDialog(false);
        if (errors.password) {
          reset('password', 'password_confirmation');
          passwordInput.current?.focus();
        }

        if (errors.current_password) {
          reset('current_password');
          currentPasswordInput.current?.focus();
        }
      },
    });
  };

  return (
    <section
      className={`rounded-2xl border border-terra-100 bg-white p-6 shadow-sm ${className}`}
    >
      <header>
        <h2 className="text-lg font-semibold text-terra-900">
          Update Password
        </h2>
        <p className="mt-1 text-sm text-terra-500">
          Ensure your account is using a long, random password to stay secure.
        </p>
      </header>

      <form onSubmit={updatePassword} className="mt-6 space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="current_password">Current Password</Label>

          <Input
            id="current_password"
            ref={currentPasswordInput}
            value={data.current_password}
            onChange={(e) => setData('current_password', e.target.value)}
            type="password"
            className="mt-1 block h-auto w-full rounded-xl border-terra-200 bg-sand-50 px-4 py-2.5 text-terra-900 focus:border-wood focus:ring-wood/50"
            autoComplete="current-password"
          />

          <InputError message={errors.current_password} className="mt-2" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">New Password</Label>

          <Input
            id="password"
            ref={passwordInput}
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            type="password"
            className="mt-1 block h-auto w-full rounded-xl border-terra-200 bg-sand-50 px-4 py-2.5 text-terra-900 focus:border-wood focus:ring-wood/50"
            autoComplete="new-password"
          />

          <InputError message={errors.password} className="mt-2" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password_confirmation">Confirm Password</Label>

          <Input
            id="password_confirmation"
            value={data.password_confirmation}
            onChange={(e) => setData('password_confirmation', e.target.value)}
            type="password"
            className="mt-1 block h-auto w-full rounded-xl border-terra-200 bg-sand-50 px-4 py-2.5 text-terra-900 focus:border-wood focus:ring-wood/50"
            autoComplete="new-password"
          />

          <InputError message={errors.password_confirmation} className="mt-2" />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={processing}
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-6 py-2.5 font-medium text-white shadow-md transition-all hover:bg-black active:scale-[0.98] disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {processing ? 'Saving...' : 'Save Password'}
          </button>

          <Transition
            show={recentlySuccessful}
            enter="transition ease-in-out"
            enterFrom="opacity-0"
            leave="transition ease-in-out"
            leaveTo="opacity-0"
          >
            <p className="text-sm text-terra-500">Saved.</p>
          </Transition>
        </div>
      </form>

      {/* Confirm Save Password Dialog */}
      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title={t('admin.profile.confirm_save_password_title')}
        description={t('admin.profile.confirm_save_password_desc')}
        confirmText={t('admin.profile.confirm_save_password_button')}
        cancelText={t('common.cancel')}
        variant="default"
        isLoading={processing}
        onConfirm={confirmSavePassword}
      />
    </section>
  );
}
