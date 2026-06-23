<?php

if (isset($_SERVER['REQUEST_URI']) && $_SERVER['REQUEST_URI'] === '/test-db-connection') {
    header('Content-Type: text/plain');
    echo "Testing Database Connection...\n";
    echo "DB_HOST: " . (getenv('DB_HOST') ?: 'not set') . "\n";
    echo "DB_PORT: " . (getenv('DB_PORT') ?: 'not set') . "\n";
    echo "DB_DATABASE: " . (getenv('DB_DATABASE') ?: 'not set') . "\n";
    echo "DB_USERNAME: " . (getenv('DB_USERNAME') ?: 'not set') . "\n";
    
    try {
        $dsn = "mysql:host=" . getenv('DB_HOST') . ";port=" . getenv('DB_PORT') . ";dbname=" . getenv('DB_DATABASE') . ";charset=utf8mb4";
        $options = [];
        
        $caPath = getenv('MYSQL_ATTR_SSL_CA') ?: (
            file_exists('/etc/pki/tls/certs/ca-bundle.crt') 
                ? '/etc/pki/tls/certs/ca-bundle.crt' 
                : (file_exists('/etc/ssl/certs/ca-certificates.crt') ? '/etc/ssl/certs/ca-certificates.crt' : null)
        );
        
        if ($caPath) {
            echo "Using SSL CA Path: " . $caPath . "\n";
            $options[\PDO::MYSQL_ATTR_SSL_CA] = $caPath;
        } else {
            echo "No SSL CA Path found or set.\n";
        }
        
        $pdo = new \PDO($dsn, getenv('DB_USERNAME'), getenv('DB_PASSWORD'), $options);
        echo "SUCCESS: Connected successfully to the database!\n";
    } catch (\Throwable $e) {
        echo "ERROR: " . $e->getMessage() . "\n";
        echo "TRACE:\n" . $e->getTraceAsString() . "\n";
    }
    exit;
}

// Forward Vercel serverless requests to Laravel's public entrypoint
require __DIR__ . '/../public/index.php';
