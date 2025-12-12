<?php

namespace App\Service;

use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Symfony\Component\HttpFoundation\File\File;

class ImageService
{
    private ImageManager $manager;

    // Configuration
    private const TARGET_SIZE = 210;      // Taille minimale pour écrans 4K (3x de 70px)
    private const WEBP_QUALITY = 85;      // Qualité WebP (0-100)
    private const ALLOWED_FORMATS = ['jpeg', 'jpg', 'png', 'gif', 'webp'];

    public function __construct()
    {
        // Utilise le driver GD (natif PHP)
        $this->manager = new ImageManager(new Driver());
    }

    /**
     * Redimensionne et convertit une image en WebP
     *
     * @param File $file Le fichier image source
     * @param string $destinationPath Le chemin de destination (sans extension)
     * @return string Le nom du fichier WebP généré
     * @throws \Exception Si l'image ne peut pas être traitée
     */
    public function processImage(File $file, string $destinationPath): string
    {
        // Vérifier le format
        $extension = strtolower($file->guessExtension() ?? '');
        if (!in_array($extension, self::ALLOWED_FORMATS)) {
            throw new \Exception("Format non supporté: {$extension}");
        }

        try {
            // Charger l'image
            $image = $this->manager->read($file->getPathname());

            // Récupérer les dimensions originales
            $width = $image->width();
            $height = $image->height();

            // Calculer les nouvelles dimensions en conservant les proportions
            // La plus petite dimension doit être TARGET_SIZE
            if ($width < $height) {
                // Image portrait ou carrée - redimensionner par largeur
                $newWidth = self::TARGET_SIZE;
                $newHeight = (int) round(($height / $width) * self::TARGET_SIZE);
            } else {
                // Image paysage - redimensionner par hauteur
                $newHeight = self::TARGET_SIZE;
                $newWidth = (int) round(($width / $height) * self::TARGET_SIZE);
            }

            // Redimensionner l'image
            $image->scale($newWidth, $newHeight);

            // Générer le nom du fichier WebP
            $webpFilename = pathinfo($destinationPath, PATHINFO_FILENAME) . '.webp';
            $webpPath = pathinfo($destinationPath, PATHINFO_DIRNAME) . '/' . $webpFilename;

            // Convertir et sauvegarder en WebP
            $image->toWebp(self::WEBP_QUALITY)->save($webpPath);

            return $webpFilename;

        } catch (\Exception $e) {
            throw new \Exception("Erreur lors du traitement de l'image: " . $e->getMessage());
        }
    }

    /**
     * Supprime un fichier image
     *
     * @param string $path Le chemin complet du fichier
     * @return bool True si supprimé, false sinon
     */
    public function deleteImage(string $path): bool
    {
        if (file_exists($path)) {
            return unlink($path);
        }
        return false;
    }

    /**
     * Obtient les informations sur l'image traitée
     *
     * @param string $path Le chemin du fichier
     * @return array{width: int, height: int, size: int, mime: string}|null
     */
    public function getImageInfo(string $path): ?array
    {
        if (!file_exists($path)) {
            return null;
        }

        $imageInfo = getimagesize($path);
        if (!$imageInfo) {
            return null;
        }

        return [
            'width' => $imageInfo[0],
            'height' => $imageInfo[1],
            'size' => filesize($path),
            'mime' => $imageInfo['mime']
        ];
    }
}
