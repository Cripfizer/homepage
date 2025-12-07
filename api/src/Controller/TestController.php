<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class TestController extends AbstractController
{
    /**
     * Endpoint de test pour vérifier la protection JWT
     * Accessible uniquement avec un token JWT valide
     */
    #[Route('/api/test/protected', name: 'api_test_protected', methods: ['GET'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function testProtected(): JsonResponse
    {
        $user = $this->getUser();

        return $this->json([
            'message' => 'Access granted! You are authenticated.',
            'user' => [
                'email' => $user->getUserIdentifier(),
                'roles' => $user->getRoles()
            ]
        ]);
    }

    /**
     * Endpoint de test réservé aux admins
     * Accessible uniquement avec un token JWT ayant ROLE_ADMIN
     */
    #[Route('/api/test/admin', name: 'api_test_admin', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function testAdmin(): JsonResponse
    {
        $user = $this->getUser();

        return $this->json([
            'message' => 'Access granted! You are an admin.',
            'user' => [
                'email' => $user->getUserIdentifier(),
                'roles' => $user->getRoles()
            ]
        ]);
    }

    /**
     * Endpoint public pour comparer
     * Accessible sans authentification
     */
    #[Route('/api/test/public', name: 'api_test_public', methods: ['GET'])]
    public function testPublic(): JsonResponse
    {
        return $this->json([
            'message' => 'This is a public endpoint. No authentication required.'
        ]);
    }
}
