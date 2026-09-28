import { useTranslation } from '@/hooks/use-translation';
import { router } from '@inertiajs/react';
import { Globe } from 'lucide-react';
import { useState } from 'react';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'toggle';
  className?: string;
}

const languages = [
  { code: 'id', label: 'ID', name: 'Indonesia' },
  { code: 'en', label: 'EN', name: 'English' },
];

export default function LanguageSwitcher({
  variant = 'dropdown',
  className = '',
}: LanguageSwitcherProps) {
  const { locale } = useTranslation();
  const [open, setOpen] = useState(false);

  const switchLocale = (code: string) => {
    if (code === locale) {
      setOpen(false);
      return;
    }

    // 1. Immediately write to client-side cookie so next request sends it
    document.cookie = `locale=${code}; path=/; max-age=31536000; SameSite=Lax`;

    // 2. Post to backend to update session & server cookie
    router.post(
      '/locale',
      { locale: code },
      {
        preserveScroll: true,
        preserveState: false,
        onSuccess: () => {
          window.location.reload();
        },
        onError: () => {
          // Fallback reload if router error
          window.location.reload();
        },
        onFinish: () => setOpen(false),
      },
    );
  };

  if (variant === 'toggle') {
    const next = locale === 'id' ? 'en' : 'id';
    const nextLabel = locale === 'id' ? 'EN' : 'ID';
    return (
      <button
        type="button"
        onClick={() => switchLocale(next)}
        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold transition-all hover:bg-neutral-100 active:scale-95 ${className}`}
        title={
          locale === 'id' ? 'Switch to English' : 'Ubah ke Bahasa Indonesia'
        }
      >
        <Globe className="h-4 w-4 text-teal-600" />
        <span>{nextLabel}</span>
      </button>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold transition-all hover:bg-neutral-100"
      >
        <Globe className="h-4 w-4 text-teal-600" />
        <span>{(locale || 'en').toUpperCase()}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-1 w-36 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => switchLocale(lang.code)}
                className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-neutral-50 ${
                  locale === lang.code
                    ? 'bg-teal-50 font-semibold text-teal-700'
                    : 'text-neutral-700'
                }`}
              >
                <span className="font-mono text-xs">{lang.label}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
