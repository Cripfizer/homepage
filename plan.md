# 📋 Plan de développement - Application gestionnaire de liens

## 📊 État du projet : 7% (8/111 étapes complétées)

---

## 🎯 Phase 1 : Configuration initiale de l'API (Backend)

### 1.1 Configuration de la base de données

- [✅] **1.** Configurer le fichier `.env` avec les credentials MySQL
- [✅] **2.** Créer la base de données via `doctrine:database:create`
- [✅] **3.** Vérifier la connexion à la base de données

### 1.2 Création des entités de base

- [✅] **4.** Créer l'entité `User` (id, email, password, createdAt)
- [✅] **5.** Créer l'entité `Icon` (id, title, type, imageUrl, backgroundColor, url, parentId, position, userId, createdAt, updatedAt)
- [✅] **6.** Ajouter les relations entre `User` et `Icon` (OneToMany)
- [✅] **7.** Ajouter la relation auto-référencée sur `Icon` pour les dossiers (parent/children)
- [✅] **8.** Générer et exécuter la première migration

### 1.3 Installation des dépendances API

- [ ] **9.** Installer LexikJWTAuthenticationBundle pour JWT (`composer require lexik/jwt-authentication-bundle`)
- [ ] **10.** Générer les clés SSL pour JWT (`php bin/console lexik:jwt:generate-keypair`)
- [ ] **11.** Configurer le security.yaml pour l'authentification JWT
- [ ] **12.** Installer le bundle de validation (`composer require symfony/validator`)

---

## 🔐 Phase 2 : Authentification (API)

### 2.1 Endpoints d'authentification

- [ ] **13.** Créer le endpoint POST `/api/register` (inscription)
- [ ] **14.** Hasher le mot de passe dans le contrôleur d'inscription
- [ ] **15.** Créer le endpoint POST `/api/login` (connexion - retourne JWT)
- [ ] **16.** Tester l'inscription avec Postman/Insomnia
- [ ] **17.** Tester la connexion et récupération du token JWT

### 2.2 Protection des routes

- [ ] **18.** Configurer les routes API pour nécessiter l'authentification JWT
- [ ] **19.** Tester l'accès aux routes protégées sans token (doit échouer)
- [ ] **20.** Tester l'accès aux routes protégées avec token valide (doit réussir)

---

## 📦 Phase 3 : CRUD des icônes (API)

### 3.1 Endpoints de base

- [ ] **21.** Créer le endpoint GET `/api/icons` (liste des icônes racine de l'utilisateur connecté)
- [ ] **22.** Créer le endpoint GET `/api/icons/{id}` (détails d'une icône)
- [ ] **23.** Créer le endpoint GET `/api/icons/{id}/children` (liste des icônes enfants d'un dossier)
- [ ] **24.** Créer le endpoint POST `/api/icons` (création d'une icône)
- [ ] **25.** Créer le endpoint PUT `/api/icons/{id}` (modification d'une icône)
- [ ] **26.** Créer le endpoint DELETE `/api/icons/{id}` (suppression d'une icône)

### 3.2 Validation et sécurité

- [ ] **27.** Ajouter les validations sur l'entité `Icon` (contraintes Assert)
- [ ] **28.** Vérifier que l'utilisateur ne peut accéder qu'à ses propres icônes
- [ ] **29.** Gérer la suppression en cascade des icônes enfants lors de la suppression d'un dossier
- [ ] **30.** Tester tous les endpoints avec Postman/Insomnia

### 3.3 Gestion du réordonnancement

- [ ] **31.** Créer le endpoint PATCH `/api/icons/reorder` (mise à jour des positions)
- [ ] **32.** Valider l'ordre des positions (pas de doublons, séquence correcte)
- [ ] **33.** Tester le réordonnancement via l'API

---

## 🖼️ Phase 4 : Upload d'images (API)

### 4.1 Configuration upload

- [ ] **34.** Installer VichUploaderBundle (`composer require vich/uploader-bundle`)
- [ ] **35.** Configurer le dossier de destination des uploads (`public/uploads/icons`)
- [ ] **36.** Ajouter le champ `imageFile` à l'entité `Icon` avec Vich

### 4.2 Endpoint upload

- [ ] **37.** Créer le endpoint POST `/api/icons/{id}/upload-image` (upload image)
- [ ] **38.** Limiter les formats acceptés (jpg, png, svg, webp)
- [ ] **39.** Limiter la taille max (2Mo recommandé)
- [ ] **40.** Retourner l'URL publique de l'image uploadée
- [ ] **41.** Tester l'upload d'image via Postman

---

## 🎨 Phase 5 : Setup du Frontend Angular

### 5.1 Installation des dépendances

- [ ] **42.** Installer Angular Material (`ng add @angular/material`)
- [ ] **43.** Choisir un thème sombre (Dark theme)
- [ ] **44.** Installer les modules nécessaires (HttpClient, FormsModule, ReactiveFormsModule)
- [ ] **45.** Configurer les imports globaux dans `app.config.ts`

### 5.2 Configuration HTTP et environnements

- [ ] **46.** Créer le fichier `src/environments/environment.ts` avec `apiUrl: 'http://localhost:8000'`
- [ ] **47.** Créer le service `AuthService` pour gérer l'authentification
- [ ] **48.** Créer l'intercepteur HTTP pour ajouter automatiquement le token JWT
- [ ] **49.** Créer le service `IconService` pour les appels API des icônes

---

## 🔐 Phase 6 : Authentification (Frontend)

### 6.1 Pages d'authentification

- [ ] **50.** Créer le composant `LoginComponent` (formulaire login)
- [ ] **51.** Créer le composant `RegisterComponent` (formulaire inscription)
- [ ] **52.** Implémenter la logique de connexion dans `AuthService`
- [ ] **53.** Stocker le token JWT dans localStorage
- [ ] **54.** Créer un guard `AuthGuard` pour protéger les routes

### 6.2 Routing

- [ ] **55.** Configurer les routes : `/login`, `/register`, `/` (protégée)
- [ ] **56.** Rediriger vers `/login` si non authentifié
- [ ] **57.** Rediriger vers `/` après connexion réussie
- [ ] **58.** Ajouter un bouton de déconnexion (clear localStorage + redirect)

---

## 🎨 Phase 7 : Interface principale (Frontend)

### 7.1 Composant principal

- [ ] **59.** Créer le composant `DashboardComponent` (page principale)
- [ ] **60.** Ajouter le fond noir et le style général Android-like
- [ ] **61.** Créer le composant `IconGridComponent` (grille d'icônes)
- [ ] **62.** Charger et afficher les icônes depuis l'API

### 7.2 Composant icône

- [ ] **63.** Créer le composant `IconItemComponent` (icône individuelle)
- [ ] **64.** Afficher le titre, l'image/icône Material, et le fond coloré
- [ ] **65.** Implémenter le clic sur une icône (ouvrir lien ou dossier)
- [ ] **66.** Ajouter l'icône "➕ Ajouter" en fin de liste

### 7.3 Gestion de la couleur adaptative

- [ ] **67.** Créer une fonction pour calculer la luminosité d'une couleur
- [ ] **68.** Ajuster automatiquement la couleur de l'icône/texte selon le fond
- [ ] **69.** Tester avec différentes couleurs (clair/sombre)

---

## ✏️ Phase 8 : Mode édition (Frontend)

### 8.1 Activation du mode édition

- [ ] **70.** Ajouter un bouton "Mode édition" dans `DashboardComponent`
- [ ] **71.** Afficher/masquer les boutons "Modifier" et "Supprimer" sous chaque icône
- [ ] **72.** Désactiver l'ouverture des liens en mode édition

### 8.2 Formulaire de création/modification

- [ ] **73.** Créer le composant `IconFormComponent` (modal ou page)
- [ ] **74.** Ajouter les champs : titre, type (lien/dossier), URL, couleur de fond
- [ ] **75.** Ajouter le sélecteur d'icône Material Icons
- [ ] **76.** Ajouter l'upload d'image personnalisée
- [ ] **77.** Soumettre le formulaire à l'API (POST ou PUT)

### 8.3 Suppression

- [ ] **78.** Implémenter la suppression avec confirmation
- [ ] **79.** Rafraîchir la liste après suppression

---

## 📂 Phase 9 : Navigation dans les dossiers (Frontend)

### 9.1 Gestion de la navigation

- [ ] **80.** Créer un service `NavigationService` pour gérer le dossier actuel
- [ ] **81.** Charger les icônes enfants lors du clic sur un dossier
- [ ] **82.** Ajouter le bouton "⬅ Retour" visible uniquement dans un sous-dossier
- [ ] **83.** Implémenter la navigation vers le dossier parent
- [ ] **84.** Gérer le breadcrumb (fil d'Ariane) optionnel

### 9.2 Animations de transition

- [ ] **85.** Ajouter l'animation de disparition (scale 0) des icônes actuelles
- [ ] **86.** Ajouter l'animation d'apparition (scale 1) des nouvelles icônes
- [ ] **87.** Utiliser Angular Animations pour fluidifier les transitions

---

## 🔄 Phase 10 : Drag & Drop (Frontend)

### 10.1 Réorganisation des icônes

- [ ] **88.** Installer/configurer Angular CDK Drag & Drop
- [ ] **89.** Activer le drag & drop uniquement en mode édition
- [ ] **90.** Mettre à jour l'ordre des icônes après un déplacement
- [ ] **91.** Sauvegarder le nouvel ordre via l'API (PATCH `/api/icons/reorder`)

---

## 🎨 Phase 11 : Améliorations UX/UI

### 11.1 Animations et feedback

- [ ] **92.** Ajouter des animations au survol des icônes
- [ ] **93.** Ajouter un effet de "press" au clic (comme Android)
- [ ] **94.** Afficher un loader pendant les appels API
- [ ] **95.** Afficher des messages de succès/erreur (toast/snackbar)

### 11.2 Responsive design

- [ ] **96.** Adapter la grille d'icônes aux petits écrans (mobile)
- [ ] **97.** Tester sur différentes tailles d'écran
- [ ] **98.** Ajuster les espacements et tailles d'icônes

---

## 🧪 Phase 12 : Tests et finalisation

### 12.1 Tests backend

- [ ] **99.** Tester tous les endpoints avec différents scénarios
- [ ] **100.** Vérifier la sécurité (accès non autorisés)
- [ ] **101.** Tester la validation des données

### 12.2 Tests frontend

- [ ] **102.** Tester la création/modification/suppression d'icônes
- [ ] **103.** Tester la navigation dans les dossiers (plusieurs niveaux)
- [ ] **104.** Tester le drag & drop
- [ ] **105.** Tester l'upload d'images
- [ ] **106.** Tester sur différents navigateurs

### 12.3 Documentation et déploiement

- [ ] **107.** Mettre à jour le README avec les instructions d'utilisation
- [ ] **108.** Documenter l'API (Swagger/OpenAPI si souhaité)
- [ ] **109.** Préparer le déploiement (configuration production)
- [ ] **110.** Déployer l'API (serveur, VPS, etc.)
- [ ] **111.** Déployer le frontend (Netlify, Vercel, etc.)

---

## 📈 Suivi de progression

**Légende :**
- [ ] À faire
- [⏳] En cours
- [✅] Terminé

**Comment utiliser ce plan :**

1. Cochez chaque étape au fur et à mesure
2. Partagez ce fichier dans vos prochaines conversations en indiquant le numéro d'étape actuel
3. Reprenez exactement où vous en étiez
4. Les étapes sont numérotées de 1 à 111 pour un suivi précis

**Exemple d'utilisation dans une nouvelle conversation :**
> "Voici le plan.md, je suis à l'étape 45. Peux-tu m'aider à la compléter ?"

---

## 🔧 Technologies utilisées

**Backend :**
- Symfony 7.4
- API Platform 4.2
- Doctrine ORM
- MySQL
- LexikJWTAuthenticationBundle
- VichUploaderBundle

**Frontend :**
- Angular 21
- Angular Material
- Angular CDK (Drag & Drop)
- TypeScript
- CSS

---

**Date de création :** 2025-12-04
**Version du plan :** 1.0
