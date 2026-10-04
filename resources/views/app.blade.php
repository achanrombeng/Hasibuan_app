<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        {{-- Default SEO Meta Tags --}}
        <meta name="author" content="Ronica Outdoor Furniture">
        <meta name="theme-color" content="#BB976D">
        <meta name="msapplication-TileColor" content="#BB976D">

        {{-- Default Open Graph --}}
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="Ronica Outdoor Furniture">
        <meta property="og:locale" content="en_US">
        <meta property="og:image" content="{{ url('/logo.png') }}">
        <meta property="og:image:width" content="1024">
        <meta property="og:image:height" content="400">

        {{-- Default Twitter Card --}}
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:site" content="@ronica">
        <meta name="twitter:image" content="{{ url('/logo.png') }}">

        {{-- Geo Tags for Local SEO --}}
        <meta name="geo.region" content="ID">
        <meta name="geo.placename" content="Indonesia">

        {{-- Verification Tags (update with actual codes) --}}
        {{-- <meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE"> --}}
        {{-- <meta name="facebook-domain-verification" content="YOUR_FB_VERIFICATION_CODE"> --}}

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <title inertia>{{ config('app.name', 'Ronica') }}</title>

        {{-- Favicon --}}
        <link rel="icon" href="/favicon.png" type="image/png">
        <link rel="apple-touch-icon" href="/favicon.png">
        <link rel="manifest" href="/site.webmanifest">

        {{-- Preconnect for Performance --}}
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link rel="dns-prefetch" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        {{-- Midtrans Snap --}}
        <script type="text/javascript"
                src="{{ config('midtrans.is_production') ? 'https://app.midtrans.com/snap/snap.js' : 'https://app.sandbox.midtrans.com/snap/snap.js' }}"
                data-client-key="{{ config('midtrans.client_key') }}"></script>


        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
