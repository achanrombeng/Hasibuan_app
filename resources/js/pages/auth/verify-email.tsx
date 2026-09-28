import TextLink from '@/components/text-link';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/hooks/use-translation';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { send } from '@/routes/verification';
import { Form, Head } from '@inertiajs/react';
import { Mail } from 'lucide-react';

export default function VerifyEmail({ status }: { status?: string }) {
  const { t } = useTranslation();

  return (
    <AuthLayout
      title={t('auth.verify_email.title')}
      description={t('auth.verify_email.description')}
    >
      <Head title={t('auth.verify_email.page_title')} />

      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-wood/10">
          <Mail className="h-8 w-8 text-wood" />
        </div>
      </div>

      {status === 'verification-link-sent' && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-600">
          {t('auth.verify_email.link_sent')}
        </div>
      )}

      <Form {...send.form()} className="space-y-6 text-center">
        {({ processing }) => (
          <>
            <button
              type="submit"
              disabled={processing}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-terra-100 px-6 py-3.5 font-medium text-terra-900 transition-all duration-300 hover:bg-terra-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {processing && <Spinner />}
              {t('auth.verify_email.resend')}
            </button>

            <TextLink
              href={logout()}
              className="mx-auto block text-sm text-terra-500 transition-colors hover:text-wood"
            >
              {t('auth.verify_email.logout')}
            </TextLink>
          </>
        )}
      </Form>
    </AuthLayout>
  );
}
