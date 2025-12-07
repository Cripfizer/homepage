<?php

echo "=== Test de connexion MySQL ===\n\n";

// Test 1: Extensions chargées
echo "Extensions PDO chargées:\n";
echo "- PDO: " . (extension_loaded('pdo') ? 'OUI' : 'NON') . "\n";
echo "- PDO MySQL: " . (extension_loaded('pdo_mysql') ? 'OUI' : 'NON') . "\n\n";

// Test 2: Tentative de connexion
echo "Tentative de connexion à MySQL...\n";

$configs = [
    'localhost' => 'mysql:host=localhost;port=3306;dbname=homepage_db',
    '127.0.0.1' => 'mysql:host=127.0.0.1;port=3306;dbname=homepage_db',
];

foreach ($configs as $label => $dsn) {
    echo "\nTest avec $label ($dsn):\n";
    try {
        $pdo = new PDO($dsn, 'root', '', [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_TIMEOUT => 5,
        ]);
        echo "✅ CONNEXION RÉUSSIE!\n";
        $stmt = $pdo->query('SELECT 1 as test');
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "✅ Requête test: " . $result['test'] . "\n";
        $pdo = null;
    } catch (PDOException $e) {
        echo "❌ ÉCHEC: " . $e->getMessage() . "\n";
    }
}

echo "\n=== Fin du test ===\n";
