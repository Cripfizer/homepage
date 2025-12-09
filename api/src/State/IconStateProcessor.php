<?php

namespace App\State;

use ApiPlatform\Doctrine\Common\State\PersistProcessor;
use ApiPlatform\Doctrine\Common\State\RemoveProcessor;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Icon;
use App\Repository\IconRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class IconStateProcessor implements ProcessorInterface
{
    public function __construct(
        private PersistProcessor $persistProcessor,
        private RemoveProcessor $removeProcessor,
        private IconRepository $iconRepository,
        private Security $security
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Icon|null
    {
        $user = $this->security->getUser();

        if (!$user) {
            throw new AccessDeniedHttpException('User not authenticated');
        }

        if (!$data instanceof Icon) {
            throw new \InvalidArgumentException('Expected Icon entity');
        }

        // POST - Création d'une nouvelle icône
        if ($operation->getMethod() === 'POST') {
            $data->setUser($user);

            // Auto-assign position if not set (or is default 0)
            if ($data->getPosition() === null || $data->getPosition() === 0) {
                // Get the max position for this user and parent
                $maxPosition = $this->iconRepository->getMaxPosition($user, $data->getParent());
                $data->setPosition($maxPosition + 1);
            }

            return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
        }

        // PUT - Modification d'une icône existante
        if ($operation->getMethod() === 'PUT') {
            // Le problème : API Platform charge l'entité via le Provider,
            // puis la DÉSÉRIALISE avec les données JSON, ce qui écrase le user avec null
            // car user n'est pas dans le groupe icon:write.

            // Solution : récupérer l'entité originale pour vérifier le propriétaire,
            // puis réassigner le user après désérialisation
            $originalIcon = $this->iconRepository->find($uriVariables['id']);

            if (!$originalIcon) {
                throw new AccessDeniedHttpException('Icon not found');
            }

            // Vérifier que l'utilisateur possède bien cette icône
            if ($originalIcon->getUser() !== $user) {
                throw new AccessDeniedHttpException('You cannot modify this icon');
            }

            // Réassigner l'utilisateur car la désérialisation l'a mis à null
            $data->setUser($user);

            return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
        }

        // DELETE - Suppression d'une icône
        if ($operation->getMethod() === 'DELETE') {
            if ($data->getUser() !== $user) {
                throw new AccessDeniedHttpException('You cannot delete this icon');
            }
            return $this->removeProcessor->process($data, $operation, $uriVariables, $context);
        }

        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
