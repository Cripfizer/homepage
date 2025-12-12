<?php

/**
 * Script de test pour ImageService
 *
 * Usage: php test-image-service.php [chemin-vers-image]
 * Exemple: php test-image-service.php public/uploads/icons/test.jpg
 */

require_once __DIR__ . '/vendor/autoload.php';

use App\Service\ImageService;
use Symfony\Component\HttpFoundation\File\File;

// Vérifier les arguments
if ($argc < 2) {
    echo "Usage: php test-image-service.php [chemin-vers-image]\n";
    echo "Exemple: php test-image-service.php public/uploads/icons/test.jpg\n";
    exit(1);
}

$imagePath = $argv[1];

// Vérifier que le fichier existe
if (!file_exists($imagePath)) {
    echo "Erreur: Le fichier '$imagePath' n'existe pas.\n";
    exit(1);
}

echo "=== Test ImageService ===\n\n";
echo "Image source: $imagePath\n";

// Créer une instance d'ImageService
$imageService = new ImageService();

try {
    // Créer un objet File
    $file = new File($imagePath);

    echo "Taille originale: " . number_format(filesize($imagePath) / 1024, 2) . " KB\n";

    // Générer le chemin de destination
    $destinationPath = dirname($imagePath) . '/test-output-' . time();

    echo "\nTraitement en cours...\n";

    // Traiter l'image
    $webpFilename = $imageService->processImage($file, $destinationPath);

    echo "✓ Image traitée avec succès!\n\n";

    // Afficher les informations de l'image WebP générée
    $webpPath = dirname($imagePath) . '/' . $webpFilename;

    if (file_exists($webpPath)) {
        echo "Fichier WebP généré: $webpFilename\n";
        echo "Taille WebP: " . number_format(filesize($webpPath) / 1024, 2) . " KB\n";

        // Obtenir les informations de l'image
        $info = $imageService->getImageInfo($webpPath);
        if ($info) {
            echo "Dimensions: {$info['width']}x{$info['height']} px\n";
            echo "Type MIME: {$info['mime']}\n";
        }

        // Calculer la réduction de taille
        $originalSize = filesize($imagePath);
        $webpSize = filesize($webpPath);
        $reduction = (($originalSize - $webpSize) / $originalSize) * 100;

        echo "\nRéduction de taille: " . number_format($reduction, 1) . "%\n";

    } else {
        echo "Erreur: Le fichier WebP n'a pas été créé.\n";
        exit(1);
    }

} catch (\Exception $e) {
    echo "Erreur: " . $e->getMessage() . "\n";
    exit(1);
}

echo "\n=== Test terminé ===\n";
