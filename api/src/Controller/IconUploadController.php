<?php

namespace App\Controller;

use App\Entity\Icon;
use App\Repository\IconRepository;
use App\Service\ImageService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class IconUploadController extends AbstractController
{
    public function __construct(
        private IconRepository $iconRepository,
        private EntityManagerInterface $entityManager,
        private ValidatorInterface $validator,
        private ImageService $imageService,
        private string $uploadDir
    ) {
    }

    #[Route('/api/icons/{id}/upload-image', name: 'api_icons_upload_image', methods: ['POST'])]
    public function uploadImage(int $id, Request $request): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        // Récupérer l'icône
        $icon = $this->iconRepository->find($id);

        if (!$icon) {
            return $this->json(['error' => 'Icon not found'], Response::HTTP_NOT_FOUND);
        }

        // Vérifier que l'icône appartient à l'utilisateur
        if ($icon->getUser() !== $user) {
            return $this->json(['error' => 'You do not own this icon'], Response::HTTP_FORBIDDEN);
        }

        /** @var UploadedFile $uploadedFile */
        $uploadedFile = $request->files->get('image');

        if (!$uploadedFile) {
            return $this->json([
                'error' => 'No file uploaded',
                'detail' => 'Please provide an image file with the key "image"'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Assigner le fichier à l'entité
        $icon->setImageFile($uploadedFile);

        // Valider l'entité (vérifie les contraintes : type de fichier, taille, etc.)
        $errors = $this->validator->validate($icon);

        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }

            return $this->json([
                'error' => 'Validation failed',
                'violations' => $errorMessages
            ], Response::HTTP_BAD_REQUEST);
        }

        // IMPORTANT: Forcer Doctrine à persister l'entité pour que VichUploader détecte le changement
        $this->entityManager->persist($icon);

        // Sauvegarder (VichUploader gère automatiquement l'upload lors du flush)
        $this->entityManager->flush();

        // Rafraîchir l'entité pour obtenir les données à jour (imageUrl avec le nouveau nom)
        $this->entityManager->refresh($icon);

        return $this->json([
            'message' => 'Image uploaded successfully',
            'icon' => [
                'id' => $icon->getId(),
                'title' => $icon->getTitle(),
                'imageUrl' => '/uploads/icons/' . $icon->getImageUrl(),
                'imageSize' => $icon->getImageSize()
            ]
        ], Response::HTTP_OK);
    }
}
