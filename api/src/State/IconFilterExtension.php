<?php

namespace App\State;

use ApiPlatform\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use App\Entity\Icon;
use Doctrine\ORM\QueryBuilder;
use Symfony\Bundle\SecurityBundle\Security;

class IconFilterExtension implements QueryCollectionExtensionInterface
{
    public function __construct(
        private Security $security
    ) {
    }

    public function applyToCollection(
        QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string $resourceClass,
        Operation $operation = null,
        array $context = []
    ): void {
        if (Icon::class !== $resourceClass) {
            return;
        }

        $user = $this->security->getUser();
        if (!$user) {
            return;
        }

        $rootAlias = $queryBuilder->getRootAliases()[0];

        // Toujours filtrer par utilisateur connecté
        $queryBuilder->andWhere(sprintf('%s.user = :current_user', $rootAlias));
        $queryBuilder->setParameter('current_user', $user);

        // Si aucun filtre "parent" n'est fourni, afficher uniquement les racines
        $filters = $context['filters'] ?? [];
        if (!isset($filters['parent'])) {
            $queryBuilder->andWhere(sprintf('%s.parent IS NULL', $rootAlias));
        }

        // Ordre par position
        $queryBuilder->orderBy(sprintf('%s.position', $rootAlias), 'ASC');
    }
}
