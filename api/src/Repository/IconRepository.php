<?php

namespace App\Repository;

use App\Entity\Icon;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Icon>
 */
class IconRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Icon::class);
    }

    /**
     * Find all root icons for a user (icons without parent)
     */
    public function findRootIconsByUser(int $userId): array
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.user = :userId')
            ->andWhere('i.parent IS NULL')
            ->setParameter('userId', $userId)
            ->orderBy('i.position', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find all children icons of a parent
     */
    public function findChildrenByParent(int $parentId, int $userId): array
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.user = :userId')
            ->andWhere('i.parent = :parentId')
            ->setParameter('userId', $userId)
            ->setParameter('parentId', $parentId)
            ->orderBy('i.position', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Get the maximum position for icons of a user at a given level
     */
    public function getMaxPosition($user, ?Icon $parent = null): int
    {
        $qb = $this->createQueryBuilder('i')
            ->select('MAX(i.position)')
            ->andWhere('i.user = :user')
            ->setParameter('user', $user);

        if ($parent === null) {
            $qb->andWhere('i.parent IS NULL');
        } else {
            $qb->andWhere('i.parent = :parent')
               ->setParameter('parent', $parent);
        }

        $result = $qb->getQuery()->getSingleScalarResult();

        return $result ?? -1;
    }
}
