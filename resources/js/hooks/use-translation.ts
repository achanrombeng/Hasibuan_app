import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export function useTranslation() {
  const { locale, translations } = usePage<SharedData>().props;

  function t(
    key: string,
    replacements?: Record<string, string | number>,
  ): string {
    let value = translations?.[key] ?? key;

    if (replacements) {
      Object.entries(replacements).forEach(([placeholder, replacement]) => {
        value = value.replace(
          new RegExp(`:${placeholder}`, 'g'),
          String(replacement),
        );
      });
    }

    return value;
  }

  return { t, locale };
}
