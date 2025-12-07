<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Icon;
use App\Repository\IconRepository;
use Symfony\Bundle\SecurityBundle\Security;

class IconStateProvider implements ProviderInterface
{
    public function __construct(
        private IconRepository $iconRepository,
        private Security $security
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $user = $this->security->getUser();

        if (!$user) {
            return null;
        }

        // GET ou PUT d'un item spécifique
        if (isset($uriVariables['id'])) {
            $icon = $this->iconRepository->find($uriVariables['id']);

            // Vérifier que l'icône appartient à l'utilisateur
            if ($icon && $icon->getUser() === $user) {
                error_log("Provider: Found icon {$icon->getId()} for user {$user->getEmail()}");
                return $icon;
            }

            error_log("Provider: Icon not found or doesn't belong to user");
            return null;
        }

        // Ce provider ne gère pas les collections
        return null;
    }
}
