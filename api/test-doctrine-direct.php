<?php

require_once __DIR__.'/vendor/autoload.php';

use Doctrine\DBAL\DriverManager;
use Doctrine\DBAL\Configuration;

echo "Testing Doctrine DBAL connection directly...\n\n";

$connectionParams = [
    'dbname' => 'homepage_db',
    'user' => 'root',
    'password' => '',
    'host' => '127.0.0.1',
    'port' => 3306,
    'driver' => 'pdo_mysql',
    'charset' => 'utf8mb4',
    'driverOptions' => [
        PDO::ATTR_TIMEOUT => 30,
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ],
];

echo "Connection params:\n";
print_r($connectionParams);
echo "\n";

try {
    $config = new Configuration();
    $connection = DriverManager::getConnection($connectionParams, $config);

    echo "Attempting to execute query (will auto-connect)...\n";

    $result = $connection->executeQuery('SELECT 1 as test');
    $data = $result->fetchAssociative();

    echo "✅ Connected and query executed successfully!\n";
    echo "Query result: " . print_r($data, true) . "\n";

} catch (\Exception $e) {
    echo "❌ ERREUR: " . $e->getMessage() . "\n";
    echo "Type: " . get_class($e) . "\n";
    echo "\nStack trace:\n" . $e->getTraceAsString() . "\n";
}
