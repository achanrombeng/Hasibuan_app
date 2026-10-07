import { SiteSettings } from '@/types';
import { usePage } from '@inertiajs/react';

export default function AppLogo() {
  const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
  const siteName = siteSettings?.site_name || 'Hasibuan Design';
  const siteLogo = siteSettings?.site_logo || '/images/hasibuan-logo.png';

  return (
    <>
      <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-neutral-100 p-1">
        <img
          src={siteLogo}
          alt={siteName}
          className="h-full w-full object-contain"
        />
      </div>
      <div className="ml-1 grid flex-1 text-left text-sm">
        <span className="mb-0.5 truncate leading-tight font-semibold">
          {siteName}
        </span>
      </div>
    </>
  );
}
