<?php

use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

// Set Vercel-specific writable cache and storage directories
if (getenv('VERCEL') || getenv('LAMBDA_TASK_ROOT') || file_exists('/var/task')) {
    foreach ([
        'APP_SERVICES_CACHE' => '/tmp/services.php',
        'APP_PACKAGES_CACHE' => '/tmp/packages.php',
        'APP_CONFIG_CACHE' => '/tmp/config.php',
        'APP_ROUTES_CACHE' => '/tmp/routes.php',
        'APP_EVENTS_CACHE' => '/tmp/events.php',
        'LARAVEL_STORAGE_PATH' => '/tmp/storage',
    ] as $key => $val) {
        putenv("{$key}={$val}");
        $_ENV[$key] = $val;
        $_SERVER[$key] = $val;
    }

    $storagePath = '/tmp/storage';
    foreach ([
        $storagePath,
        $storagePath . '/framework',
        $storagePath . '/framework/cache',
        $storagePath . '/framework/sessions',
        $storagePath . '/framework/views',
        $storagePath . '/logs',
        $storagePath . '/app',
        $storagePath . '/app/public',
        $storagePath . '/app/public/covers',
        $storagePath . '/app/public/avatars',
    ] as $dir) {
        if (!is_dir($dir)) {
            mkdir($dir, 0777, true);
        }
    }
}

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();

if (getenv('VERCEL') || getenv('LAMBDA_TASK_ROOT') || file_exists('/var/task')) {
    $app->useStoragePath('/tmp/storage');
}

return $app;
