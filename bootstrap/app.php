<?php

use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

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
        $exceptions->report(function (\Throwable $e) {
            error_log("LARAVEL CAUGHT EXCEPTION: " . $e->getMessage() . "\n" . $e->getTraceAsString());
        });
    })->create();
