/**
 * CSRF & Fetch Utilities for secure API / AJAX requests in Laravel & Inertia
 */

export function getCsrfToken(): string {
  if (typeof document === 'undefined') return '';

  const meta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
  if (meta?.content) {
    return meta.content;
  }

  return getCookie('XSRF-TOKEN');
}

export function getCookie(name: string): string {
  if (typeof document === 'undefined') return '';

  const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : '';
}

export function getCsrfHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...customHeaders,
  };

  const metaToken = typeof document !== 'undefined'
    ? (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null)?.content
    : null;

  if (metaToken) {
    headers['X-CSRF-TOKEN'] = metaToken;
  }

  const xsrfCookie = getCookie('XSRF-TOKEN');
  if (xsrfCookie) {
    headers['X-XSRF-TOKEN'] = xsrfCookie;
  }

  return headers;
}
