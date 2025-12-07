<?php

require_once __DIR__.'/vendor/autoload.php';

echo "Testing PDO connection with Composer autoload...\n\n";

$dsn = "mysql:host=127.0.0.1;port=3306;dbname=homepage_db;charset=utf8mb4";
$username = "root";
$password = "";

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $result = $pdo->query("SELECT 1 as test");
    $row = $result->fetch(PDO::FETCH_ASSOC);

    echo "✅ CONNEXION RÉUSSIE via PDO avec autoload\n";
    echo "Result: " . print_r($row, true) . "\n";

} catch (PDOException $e) {
    echo "❌ ERREUR: " . $e->getMessage() . "\n";
    echo "Code: " . $e->getCode() . "\n";
}
