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

        // Store in session (immediate, reliable) + cookie (persists across sessions)
        session(['locale' => $validated['locale']]);

        return redirect()->back()->withCookie(
            cookie('locale', $validated['locale'], 60 * 24 * 365)
        );
    }
}
