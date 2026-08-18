<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    private const SUPPORTED_LOCALES = ['en', 'id'];

    public function handle(Request $request, Closure $next): Response
    {
        // Priority: session (explicit switch) > cookie (persists across sessions) > config (defaults to 'en')
        $locale = session('locale')
            ?? $request->cookie('locale')
            ?? config('app.locale', 'en');

        if (! in_array($locale, self::SUPPORTED_LOCALES, true)) {
            $locale = config('app.locale', 'en');
        }

        App::setLocale($locale);

        return $next($request);
    }

    /**
     * Detect locale from the browser's Accept-Language header.
     * Indonesian users (id, id-ID) get 'id', everyone else gets 'en'.
     */
    private function detectFromBrowser(Request $request): ?string
    {
        $preferred = $request->getPreferredLanguage(self::SUPPORTED_LOCALES);

        return $preferred && in_array($preferred, self::SUPPORTED_LOCALES, true)
            ? $preferred
            : null;
    }
}
