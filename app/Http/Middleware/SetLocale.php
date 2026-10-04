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
        $defaultLocale = 'en';
        $locale = 'en';

        if (session('locale') !== $locale) {
            session(['locale' => $locale]);
        }

        App::setLocale($locale);

        $response = $next($request);

        if ($request->cookie('locale') !== 'en') {
            return $response->withCookie(
                cookie('locale', 'en', 60 * 24 * 365, null, null, false, false)
            );
        }

        return $response;
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
