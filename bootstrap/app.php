<?php

use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

// Set Vercel-specific writable cache directories
if (getenv('VERCEL')) {
    foreach ([
        'APP_SERVICES_CACHE' => '/tmp/services.php',
        'APP_PACKAGES_CACHE' => '/tmp/packages.php',
        'APP_CONFIG_CACHE' => '/tmp/config.php',
        'APP_ROUTES_CACHE' => '/tmp/routes.php',
        'APP_EVENTS_CACHE' => '/tmp/events.php',
    ] as $key => $val) {
        putenv("{$key}={$val}");
        $_ENV[$key] = $val;
        $_SERVER[$key] = $val;
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
        $exceptions->render(function (\Throwable $e) {
            header('Content-Type: text/plain', true, 500);
            echo "EXCEPTION DIAGNOSTIC:\n";
            echo get_class($e) . ": " . $e->getMessage() . "\n\n";
            echo "STACK TRACE:\n" . $e->getTraceAsString() . "\n\n";
            if ($prev = $e->getPrevious()) {
                echo "PREVIOUS EXCEPTION:\n";
                echo get_class($prev) . ": " . $prev->getMessage() . "\n\n";
                echo "PREVIOUS STACK TRACE:\n" . $prev->getTraceAsString() . "\n\n";
            }
            exit;
        });
    })->create();

if (getenv('VERCEL')) {
    $storagePath = '/tmp/storage';
    foreach ([
        $storagePath,
        $storagePath . '/framework',
        $storagePath . '/framework/cache',
        $storagePath . '/framework/sessions',
        $storagePath . '/framework/views',
        $storagePath . '/logs',
    ] as $dir) {
        if (!is_dir($dir)) {
            mkdir($dir, 0777, true);
        }
    }
    $app->useStoragePath($storagePath);
}

return $app;
