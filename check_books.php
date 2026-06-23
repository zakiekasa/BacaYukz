<?php

$host = 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com';
$port = '4000';
$db = 'test';
$user = '2PX6bvbGgmhLZQ3.root';
$pass = '9PsREFzsM4Ao8gUL';

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";
    $options = [];
    
    $caPath = '/etc/ssl/cert.pem';
    if (file_exists($caPath)) {
        $options[PDO::MYSQL_ATTR_SSL_CA] = $caPath;
    }
    
    $pdo = new PDO($dsn, $user, $pass, $options);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $pdo->query("SELECT id, title, cover, created_at FROM books ORDER BY id DESC LIMIT 5");
    $books = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($books as $b) {
        $coverLength = strlen($b['cover']);
        $coverStart = substr($b['cover'], 0, 50);
        echo "ID: {$b['id']} | Title: {$b['title']} | Cover: {$coverStart}... (length: {$coverLength}) | Created At: {$b['created_at']}\n";
    }
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
