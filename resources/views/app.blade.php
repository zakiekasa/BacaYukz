<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <script>
            (function () {
                const savedTheme = localStorage.getItem('theme') || 'light';
                document.documentElement.setAttribute('data-bs-theme', savedTheme);
            })();
        </script>

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
        <!-- Bootstrap CSS -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        <!-- FontAwesome -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

        <style>
            /* Dark Mode custom overrides */
            [data-bs-theme="dark"] body {
                background-color: #121212 !important;
                color: #e0e0e0 !important;
            }
            [data-bs-theme="dark"] .bg-white {
                background-color: #1a1a1a !important;
                color: #e0e0e0 !important;
            }
            [data-bs-theme="dark"] .text-dark {
                color: #ffffff !important;
            }
            [data-bs-theme="dark"] .bg-light {
                background-color: #242424 !important;
                color: #e0e0e0 !important;
            }
            [data-bs-theme="dark"] .border {
                border-color: #2d2d2d !important;
            }
            [data-bs-theme="dark"] .border-bottom {
                border-bottom-color: #2d2d2d !important;
            }
            [data-bs-theme="dark"] .border-top {
                border-top-color: #2d2d2d !important;
            }
            [data-bs-theme="dark"] .card {
                background-color: #1a1a1a !important;
                color: #e0e0e0 !important;
                border-color: #2d2d2d !important;
            }
            [data-bs-theme="dark"] .navbar {
                background-color: #1a1a1a !important;
                border-color: #2d2d2d !important;
            }
            [data-bs-theme="dark"] .nav-link {
                color: #c0c0c0 !important;
            }
            [data-bs-theme="dark"] .nav-link:hover {
                color: #ffffff !important;
            }
            [data-bs-theme="dark"] .text-secondary {
                color: #aaaaaa !important;
            }
            [data-bs-theme="dark"] .text-muted {
                color: #888888 !important;
            }
            [data-bs-theme="dark"] input.form-control, 
            [data-bs-theme="dark"] select.form-select {
                background-color: #242424 !important;
                color: #ffffff !important;
                border-color: #3d3d3d !important;
            }
            [data-bs-theme="dark"] input.form-control::placeholder {
                color: #666666 !important;
            }
            [data-bs-theme="dark"] .btn-light {
                background-color: #242424 !important;
                color: #ffffff !important;
                border-color: #3d3d3d !important;
            }
            [data-bs-theme="dark"] .btn-light:hover {
                background-color: #2d2d2d !important;
            }
            [data-bs-theme="dark"] .bg-body-tertiary {
                background-color: #121212 !important;
            }
            [data-bs-theme="dark"] .chapter-card {
                border-color: #2d2d2d !important;
                background-color: #242424 !important;
            }
            [data-bs-theme="dark"] .medium-content {
                color: #e0e0e0 !important;
            }
            [data-bs-theme="dark"] .medium-content pre {
                background-color: #1e1e1e !important;
                color: #e0e0e0 !important;
            }
        </style>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />

        <!-- Bootstrap JS Bundle -->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    </body>
</html>
