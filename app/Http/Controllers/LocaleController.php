<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LocaleController extends Controller
{
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'locale' => ['required', 'string', 'in:id,en'],
        ]);

        $locale = $validated['locale'];

        // Store in session + cookie
        session(['locale' => $locale]);
        app()->setLocale($locale);

        return redirect()->back()->withCookie(
            cookie('locale', $locale, 60 * 24 * 365, null, null, false, false)
        );
    }
}
