<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        <!-- K2 Logo positioned in the top left as per dashboard design -->
        <div id="app-logo" style="position: fixed; top: 20px; left: 20px; z-index: 50;">
            <img src="{{ asset('images/k2-logo.svg') }}" alt="K2 Carbon Credit" width="32" height="32" style="border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        </div>
        @inertia
    </body>
</html>
