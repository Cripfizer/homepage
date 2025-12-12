<?php

namespace App\EventListener;

use App\Entity\Icon;
use App\Service\ImageService;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\File\File;
use Vich\UploaderBundle\Event\Event;

class ImageUploadListener
{
    public function __construct(
        private ImageService $imageService,
        private string $uploadDirectory,
        private EntityManagerInterface $entityManager,
        private LoggerInterface $logger
    ) {
    }

    /**
     * Event déclenché AVANT l'upload d'une image par VichUploader
     * Supprime l'ancien fichier si présent
     */
    public function onPreUpload(Event $event): void
    {
        $this->logger->info('[ImageUploadListener] Event pre_upload déclenché');

        $object = $event->getObject();

        // Vérifier que c'est bien une Icon
        if (!$object instanceof Icon) {
            return;
        }

        $mapping = $event->getMapping();

        // Vérifier que c'est le mapping icon_images
        if ($mapping->getMappingName() !== 'icon_images') {
            return;
        }

        // Récupérer le nom de l'ancien fichier (s'il existe)
        $oldFilename = $object->getImageFilename();

        if (!$oldFilename) {
            $this->logger->info('[ImageUploadListener] No old file to delete');
            return;
        }

        $this->logger->info('[ImageUploadListener] Old filename: ' . $oldFilename);

        // Construire le chemin complet de l'ancien fichier
        $oldFilePath = $this->uploadDirectory . '/' . $oldFilename;

        // Supprimer l'ancien fichier s'il existe
        if (file_exists($oldFilePath)) {
            $deleted = $this->imageService->deleteImage($oldFilePath);
            $this->logger->info('[ImageUploadListener] Old file deleted in PRE_UPLOAD: ' . ($deleted ? 'yes' : 'no'));
        } else {
            $this->logger->info('[ImageUploadListener] Old file does not exist: ' . $oldFilePath);
        }
    }

    /**
     * Event déclenché après l'upload d'une image par VichUploader
     * Redimensionne et convertit l'image en WebP
     */
    public function onPostUpload(Event $event): void
    {
        $this->logger->info('[ImageUploadListener] Event post_upload déclenché');

        $object = $event->getObject();

        // Vérifier que c'est bien une Icon
        if (!$object instanceof Icon) {
            $this->logger->warning('[ImageUploadListener] Object is not an Icon instance');
            return;
        }

        $this->logger->info('[ImageUploadListener] Processing Icon ID: ' . $object->getId());

        $mapping = $event->getMapping();

        // Vérifier que c'est le mapping icon_images
        if ($mapping->getMappingName() !== 'icon_images') {
            $this->logger->warning('[ImageUploadListener] Wrong mapping: ' . $mapping->getMappingName());
            return;
        }

        // Récupérer le nom du fichier uploadé (sans extension WebP encore)
        // Utiliser getImageFilename() qui retourne le nom brut sans baseURL
        $filename = $object->getImageFilename();
        $this->logger->info('[ImageUploadListener] Filename from entity: ' . ($filename ?? 'null'));

        if (!$filename) {
            $this->logger->error('[ImageUploadListener] No filename found');
            return;
        }

        // Construire le chemin complet du fichier uploadé
        $originalFilePath = $this->uploadDirectory . '/' . $filename;
        $this->logger->info('[ImageUploadListener] Original file path: ' . $originalFilePath);

        if (!file_exists($originalFilePath)) {
            $this->logger->error('[ImageUploadListener] File does not exist: ' . $originalFilePath);
            return;
        }

        try {
            $this->logger->info('[ImageUploadListener] Starting image processing...');

            // Créer un objet File pour ImageService
            $file = new File($originalFilePath);

            // Traiter l'image : redimensionner et convertir en WebP
            // processImage retourne le nouveau nom de fichier (avec .webp)
            $webpFilename = $this->imageService->processImage($file, $originalFilePath);
            $this->logger->info('[ImageUploadListener] WebP file created: ' . $webpFilename);

            // Supprimer l'ancien fichier (celui avant conversion WebP)
            // Sauf si c'est déjà un fichier WebP
            if (!str_ends_with($filename, '.webp') && file_exists($originalFilePath)) {
                $deleted = $this->imageService->deleteImage($originalFilePath);
                $this->logger->info('[ImageUploadListener] Original file deleted: ' . ($deleted ? 'yes' : 'no'));
            }

            // Mettre à jour le nom du fichier dans l'entité
            // Note: On stocke juste le nom du fichier, pas le chemin complet
            $object->setImageUrl($webpFilename);

            // Mettre à jour la taille du fichier WebP
            $webpPath = $this->uploadDirectory . '/' . $webpFilename;
            if (file_exists($webpPath)) {
                $newSize = filesize($webpPath);
                $object->setImageSize($newSize);
                $this->logger->info('[ImageUploadListener] WebP size: ' . $newSize . ' bytes');
            }

            // IMPORTANT: Flush les changements car post_upload est après le flush de Vich
            $this->entityManager->flush();
            $this->logger->info('[ImageUploadListener] Changes flushed to database');

        } catch (\Exception $e) {
            // En cas d'erreur, on log mais on ne bloque pas l'upload
            // Le fichier original restera disponible
            $this->logger->error('[ImageUploadListener] Error processing image: ' . $e->getMessage());
            $this->logger->error('[ImageUploadListener] Stack trace: ' . $e->getTraceAsString());
        }
    }
}
