import {
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Send,
  Youtube,
} from 'lucide-react';

export interface SocialItem {
  id: string;
  platform: string;
  url: string;
  label?: string;
}

export const PLATFORM_PRESETS = [
  {
    id: 'instagram',
    name: 'Instagram',
    placeholder: 'https://instagram.com/username',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    placeholder: 'https://facebook.com/page',
  },
  { id: 'tiktok', name: 'TikTok', placeholder: 'https://tiktok.com/@username' },
  {
    id: 'youtube',
    name: 'YouTube',
    placeholder: 'https://youtube.com/@channel',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    placeholder: 'https://wa.me/6281234567890',
  },
  { id: 'twitter', name: 'X / Twitter', placeholder: 'https://x.com/username' },
  {
    id: 'pinterest',
    name: 'Pinterest',
    placeholder: 'https://pinterest.com/username',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    placeholder: 'https://linkedin.com/company/name',
  },
  {
    id: 'threads',
    name: 'Threads',
    placeholder: 'https://threads.net/@username',
  },
  { id: 'telegram', name: 'Telegram', placeholder: 'https://t.me/channel' },
  { id: 'custom', name: 'Custom / Lainnya', placeholder: 'https://...' },
];

export function PlatformIcon({
  platform,
  className = 'h-4 w-4',
}: {
  platform: string;
  className?: string;
}) {
  switch (platform) {
    case 'instagram':
      return <Instagram className={className} />;
    case 'facebook':
      return <Facebook className={className} />;
    case 'tiktok':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
        </svg>
      );
    case 'youtube':
      return <Youtube className={className} />;
    case 'whatsapp':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      );
    case 'twitter':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case 'pinterest':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
        </svg>
      );
    case 'linkedin':
      return <Linkedin className={className} />;
    case 'threads':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.186 24C5.452 24 0 18.548 0 11.814S5.452-.372 12.186-.372c3.487 0 6.643 1.396 8.948 3.654l-2.697 2.697C16.822 4.39 14.619 3.4 12.186 3.4 7.545 3.4 3.772 7.173 3.772 11.814c0 4.642 3.773 8.414 8.414 8.414 4.093 0 7.498-2.927 8.262-6.845H12.186v-3.772h12.06c.116.634.186 1.28.186 1.942 0 6.793-5.395 12.447-12.246 12.447z" />
        </svg>
      );
    case 'telegram':
      return <Send className={className} />;
    default:
      return <Globe className={className} />;
  }
}

export function getPlatformBadgeStyle(platform: string) {
  switch (platform) {
    case 'instagram':
      return 'text-pink-600 bg-pink-50 border-pink-200';
    case 'facebook':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'tiktok':
      return 'text-neutral-900 bg-neutral-100 border-neutral-200';
    case 'youtube':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'whatsapp':
      return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    case 'twitter':
      return 'text-neutral-900 bg-neutral-100 border-neutral-200';
    case 'pinterest':
      return 'text-red-700 bg-red-50 border-red-200';
    case 'linkedin':
      return 'text-blue-700 bg-blue-50 border-blue-200';
    case 'threads':
      return 'text-neutral-900 bg-neutral-100 border-neutral-200';
    case 'telegram':
      return 'text-sky-500 bg-sky-50 border-sky-200';
    default:
      return 'text-teal-600 bg-teal-50 border-teal-200';
  }
}
