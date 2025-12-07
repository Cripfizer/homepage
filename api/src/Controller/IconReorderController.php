<?php

namespace App\Controller;

use App\Repository\IconRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class IconReorderController extends AbstractController
{
    public function __construct(
        private IconRepository $iconRepository,
        private EntityManagerInterface $entityManager
    ) {
    }

    #[Route('/api/icons/reorder', name: 'api_icons_reorder', methods: ['PATCH'])]
    public function reorder(Request $request): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['icons']) || !is_array($data['icons'])) {
            return $this->json([
                'error' => 'Invalid request format',
                'detail' => 'Expected format: {"icons": [{"id": 1, "position": 0}, ...]}'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Récupérer tous les IDs à mettre à jour
        $iconIds = array_column($data['icons'], 'id');

        if (empty($iconIds)) {
            return $this->json(['error' => 'No icons to reorder'], Response::HTTP_BAD_REQUEST);
        }

        // Charger toutes les icônes en une seule requête
        $icons = $this->iconRepository->findBy(['id' => $iconIds]);

        // Vérifier que toutes les icônes appartiennent à l'utilisateur
        $iconsById = [];
        foreach ($icons as $icon) {
            if ($icon->getUser() !== $user) {
                return $this->json([
                    'error' => 'Forbidden',
                    'detail' => "You don't own icon with id {$icon->getId()}"
                ], Response::HTTP_FORBIDDEN);
            }
            $iconsById[$icon->getId()] = $icon;
        }

        // Vérifier que toutes les icônes demandées existent
        if (count($iconsById) !== count($iconIds)) {
            return $this->json([
                'error' => 'Not found',
                'detail' => 'Some icons were not found'
            ], Response::HTTP_NOT_FOUND);
        }

        // Mettre à jour les positions
        $updated = [];
        foreach ($data['icons'] as $iconData) {
            if (!isset($iconData['id']) || !isset($iconData['position'])) {
                return $this->json([
                    'error' => 'Invalid data',
                    'detail' => 'Each icon must have "id" and "position" fields'
                ], Response::HTTP_BAD_REQUEST);
            }

            $iconId = $iconData['id'];
            $newPosition = $iconData['position'];

            // Valider la position
            if (!is_int($newPosition) || $newPosition < 0) {
                return $this->json([
                    'error' => 'Invalid position',
                    'detail' => "Position must be a positive integer for icon {$iconId}"
                ], Response::HTTP_BAD_REQUEST);
            }

            $icon = $iconsById[$iconId];
            $icon->setPosition($newPosition);
            $updated[] = [
                'id' => $icon->getId(),
                'title' => $icon->getTitle(),
                'position' => $icon->getPosition()
            ];
        }

        $this->entityManager->flush();

        return $this->json([
            'message' => 'Icons reordered successfully',
            'updated' => $updated
        ], Response::HTTP_OK);
    }
}
