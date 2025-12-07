# 📋 Plan de développement - Phase 2 : Frontend Angular

## 📊 État : Phase Backend complétée (45/45 ✅) - Phase Frontend à démarrer (0/66)

**Référence** : Ce plan continue le [plan.md](./plan.md) et s'appuie sur [info/forclaude-2.md](./info/forclaude-2.md)

---

## 🎯 Vue d'ensemble de la Phase 2

Cette phase se concentre sur le développement complet du frontend Angular pour créer une interface utilisateur moderne, fluide et inspirée d'Android. Le backend API est entièrement fonctionnel et documenté dans `forclaude-2.md`.

**Objectif** : Application web complète avec authentification, gestion d'icônes/dossiers, drag & drop, et upload d'images.

---

## 📦 Phase 5 : Services et configuration Angular (Étapes 46-49)

**Objectif** : Mettre en place l'architecture de services pour communiquer avec l'API Symfony.

### Milestone 1 : Configuration environnement
- **[46]** Créer les fichiers d'environnement (dev et prod) avec `apiUrl`

### Milestone 2 : AuthService et sécurité
- **[47]** Implémenter `AuthService` (register, login, logout, token management)
- **[48]** Créer l'intercepteur HTTP JWT (auto-ajout du token aux requêtes)

### Milestone 3 : IconService
- **[49]** Implémenter `IconService` (CRUD, reorder, upload) avec gestion JSON-LD

**Livrables** :
- ✓ Services configurés et prêts à utiliser
- ✓ Gestion automatique du token JWT
- ✓ Parsing des réponses JSON-LD (`hydra:member`)

**Points critiques** :
- Utiliser `localStorage` pour le token JWT
- Intercepteur doit gérer les erreurs 401 (redirection login)
- JSON-LD : Extraire `hydra:member` pour les collections

---

## 🔐 Phase 6 : Authentification Frontend (Étapes 50-58)

**Objectif** : Pages de connexion/inscription et protection des routes.

### Milestone 4 : Pages d'authentification
- **[50-51]** Créer `LoginComponent` et `RegisterComponent` avec Angular Material
- **[52-53]** Implémenter la logique d'authentification et stockage token
- **[54]** Créer `AuthGuard` pour protéger les routes privées

### Milestone 5 : Routing et navigation
- **[55-57]** Configurer les routes (`/login`, `/register`, `/`) avec protection
- **[58]** Implémenter la déconnexion (bouton dans la toolbar)

**Livrables** :
- ✓ Formulaires de login/register avec validation
- ✓ Routes protégées par `AuthGuard`
- ✓ Redirection automatique si non authentifié
- ✓ Bouton de déconnexion fonctionnel

**Design** :
- Formulaires Material avec `MatFormField`, `MatInput`, `MatButton`
- Messages d'erreur avec `MatSnackBar`
- Thème sombre (déjà configuré dans `custom-theme.scss`)

---

## 🎨 Phase 7 : Interface principale et grille d'icônes (Étapes 59-69)

**Objectif** : Créer le dashboard principal avec affichage des icônes.

### Milestone 6 : Dashboard et grille
- **[59-61]** Créer `DashboardComponent` avec fond noir Android-like et `IconGridComponent`
- **[62]** Charger et afficher les icônes depuis l'API (racine par défaut)

### Milestone 7 : Composant icône individuelle
- **[63-64]** Créer `IconItemComponent` (titre, image/icône Material, fond coloré)
- **[65]** Implémenter le clic (ouvrir lien externe ou naviguer dans dossier)
- **[66]** Ajouter l'icône "➕ Ajouter" en fin de grille

### Milestone 8 : Couleur adaptative
- **[67-69]** Calculer la luminosité du fond et ajuster la couleur du texte/icône automatiquement

**Livrables** :
- ✓ Grille d'icônes responsive (CSS Grid)
- ✓ Icônes cliquables (liens s'ouvrent dans nouvel onglet, dossiers naviguent)
- ✓ Contraste automatique selon couleur de fond
- ✓ Bouton "Ajouter" toujours visible

**Design** :
- Icônes carrées avec coins arrondis
- Effet de survol subtil
- Police claire et lisible
- Espacement uniforme entre les icônes

---

## ✏️ Phase 8 : Mode édition et gestion des icônes (Étapes 70-79)

**Objectif** : Permettre la création, modification et suppression d'icônes.

### Milestone 9 : Activation mode édition
- **[70-72]** Ajouter un toggle "Mode édition" avec boutons Modifier/Supprimer sous chaque icône

### Milestone 10 : Formulaire d'icône
- **[73-74]** Créer `IconFormComponent` (modal `MatDialog`) avec champs : titre, type, URL, couleur
- **[75]** Ajouter un sélecteur d'icône Material Icons (recherche + aperçu)
- **[76]** Implémenter l'upload d'image personnalisée (alternative à Material Icon)
- **[77]** Soumettre le formulaire à l'API (POST pour création, PUT pour modification)

### Milestone 11 : Suppression
- **[78-79]** Implémenter la suppression avec confirmation (`MatDialog`) et rafraîchissement

**Livrables** :
- ✓ Mode édition avec boutons visibles/cachés
- ✓ Modal de création/édition avec tous les champs
- ✓ Sélecteur d'icônes Material avec recherche
- ✓ Upload d'image avec preview
- ✓ Suppression avec confirmation

**Points critiques** :
- Désactiver l'ouverture des liens en mode édition
- Validation côté client (formulaire réactif)
- Upload via `FormData` multipart
- Rafraîchir la grille après création/modification/suppression

---

## 📂 Phase 9 : Navigation dans les dossiers (Étapes 80-87)

**Objectif** : Permettre la navigation dans l'arborescence de dossiers.

### Milestone 12 : Service de navigation
- **[80-81]** Créer `NavigationService` (stack de dossiers, charger enfants)
- **[82-83]** Ajouter le bouton "⬅ Retour" (visible uniquement dans un sous-dossier)
- **[84]** Implémenter le breadcrumb optionnel (fil d'Ariane)

### Milestone 13 : Animations de transition
- **[85-87]** Animations de disparition/apparition des icônes lors du changement de dossier

**Livrables** :
- ✓ Navigation dans l'arborescence (plusieurs niveaux)
- ✓ Bouton retour fonctionnel
- ✓ Breadcrumb pour visualiser le chemin
- ✓ Transitions fluides entre les vues

**Design** :
- Animation scale 0 → 1 pour l'apparition
- Animation scale 1 → 0 pour la disparition
- Durée : 200-300ms avec easing
- Utiliser Angular Animations (`@angular/animations`)

---

## 🔄 Phase 10 : Drag & Drop (Étapes 88-91)

**Objectif** : Réorganiser les icônes par glisser-déposer.

### Milestone 14 : Configuration Drag & Drop
- **[88-89]** Configurer Angular CDK Drag & Drop (actif uniquement en mode édition)
- **[90]** Mettre à jour l'ordre local après un déplacement
- **[91]** Sauvegarder le nouvel ordre via PATCH `/api/icons/reorder`

**Livrables** :
- ✓ Drag & Drop fonctionnel en mode édition
- ✓ Réorganisation visuelle instantanée
- ✓ Persistance des positions via l'API
- ✓ Indicateur visuel pendant le drag (placeholder)

**Points critiques** :
- Utiliser `cdkDropList` et `cdkDrag`
- Calculer les nouvelles positions (0, 1, 2, ...)
- Envoyer le tableau `[{id, position}, ...]` à l'API

---

## 🎨 Phase 11 : Améliorations UX/UI (Étapes 92-98)

**Objectif** : Peaufiner l'expérience utilisateur et le responsive.

### Milestone 15 : Animations et feedback
- **[92-93]** Animations au survol et effet "press" au clic (ripple Android)
- **[94]** Afficher un loader (spinner) pendant les appels API
- **[95]** Messages de succès/erreur avec `MatSnackBar`

### Milestone 16 : Responsive design
- **[96-98]** Adapter la grille aux écrans mobiles (2 colonnes sur téléphone, 4+ sur desktop)

**Livrables** :
- ✓ Micro-animations fluides et naturelles
- ✓ Feedback visuel immédiat (loader, toasts)
- ✓ Interface parfaitement responsive
- ✓ Tests sur mobile, tablette, desktop

**Design** :
- Utiliser CSS Grid avec `auto-fit` et `minmax()`
- Breakpoints : mobile (<600px), tablette (600-1024px), desktop (>1024px)
- Ripple effect Material sur les icônes

---

## 🧪 Phase 12 : Tests et finalisation (Étapes 99-111)

**Objectif** : Valider le bon fonctionnement et préparer la production.

### Milestone 17 : Tests backend
- **[99-101]** Tester tous les endpoints (scénarios normaux et erreurs)

### Milestone 18 : Tests frontend
- **[102-106]** Tests manuels complets (CRUD, navigation, drag & drop, upload, multi-navigateurs)

### Milestone 19 : Documentation et déploiement
- **[107-109]** README, documentation API, configuration production
- **[110-111]** Déploiement API (VPS/Cloud) et Frontend (Netlify/Vercel)

**Livrables** :
- ✓ Application testée et stable
- ✓ Documentation à jour
- ✓ Déploiement en production
- ✓ URLs publiques fonctionnelles

---

## 🔑 Informations clés pour le développement

### Backend API (déjà prêt)

**Base URL** : `http://localhost:8000`

**Endpoints authentification** :
- `POST /api/register` → Créer un compte
- `POST /api/login` → Se connecter (retourne JWT)

**Endpoints Icons (CRUD)** :
- `GET /api/icons` → Liste racine
- `GET /api/icons?parent=/api/icons/{id}` → Enfants d'un dossier
- `GET /api/icons/{id}` → Détail
- `POST /api/icons` → Créer
- `PUT /api/icons/{id}` → Modifier
- `DELETE /api/icons/{id}` → Supprimer
- `PATCH /api/icons/reorder` → Réorganiser
- `POST /api/icons/{id}/upload-image` → Upload image

**Headers requis** :
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/ld+json
```

**Format JSON-LD** :
- Collections : `response['hydra:member']` (array)
- Items : `response` direct

### Technologies Frontend

**Stack** :
- Angular 21.0.0 (standalone components)
- Angular Material 21.0.2 (thème sombre déjà configuré)
- Angular CDK (Drag & Drop)
- TypeScript 5.7+
- SCSS

**Modules clés** :
- `HttpClient` (déjà configuré)
- `provideAnimationsAsync()` (déjà configuré)
- `MatDialog`, `MatSnackBar`, `MatFormField`, `MatButton`, `MatCard`, `MatIcon`, `MatToolbar`

---

## 📈 Stratégie d'exécution recommandée

### Approche itérative par milestones

**Sprint 1** : Configuration et authentification (Milestones 1-5, étapes 46-58)
- Services de base + Pages login/register
- Objectif : Pouvoir se connecter et être redirigé vers le dashboard vide

**Sprint 2** : Interface principale (Milestones 6-8, étapes 59-69)
- Dashboard + Grille d'icônes + Icônes individuelles
- Objectif : Voir ses icônes et cliquer dessus

**Sprint 3** : Édition et création (Milestones 9-11, étapes 70-79)
- Mode édition + Formulaire + Suppression
- Objectif : Créer, modifier et supprimer des icônes

**Sprint 4** : Navigation et drag & drop (Milestones 12-14, étapes 80-91)
- Navigation dans dossiers + Réorganisation
- Objectif : Application pleinement fonctionnelle

**Sprint 5** : Polish et déploiement (Milestones 15-19, étapes 92-111)
- UX/UI + Tests + Déploiement
- Objectif : Application en production

---

## 🎓 Points d'attention pour le développement

### Angular 21 (Standalone)

✅ **À faire** :
- Utiliser standalone components partout
- Configurer les providers dans `app.config.ts`
- Importer les modules Material directement dans les composants

❌ **À éviter** :
- NgModule (obsolète dans cette approche)
- CommonModule dans imports (déjà inclus par défaut)

### API Platform JSON-LD

✅ **À faire** :
- Toujours parser `response['hydra:member']` pour les collections
- Utiliser `application/ld+json` dans les headers
- Gérer les erreurs 401 (token expiré)

❌ **À éviter** :
- Oublier d'extraire `hydra:member`
- Utiliser `application/json` (ne fonctionnera pas)

### Sécurité

✅ **À faire** :
- Stocker le token dans `localStorage`
- Ajouter le token automatiquement via intercepteur
- Rediriger vers `/login` si 401
- Nettoyer le `localStorage` à la déconnexion

❌ **À éviter** :
- Stocker le token dans une variable globale (perdu au refresh)
- Oublier de gérer l'expiration du token (1h par défaut)

---

## 📦 Fichiers à créer (aperçu)

### Services
- `src/app/services/auth.service.ts`
- `src/app/services/icon.service.ts`
- `src/app/services/navigation.service.ts`
- `src/app/interceptors/auth.interceptor.ts`

### Guards
- `src/app/guards/auth.guard.ts`

### Components
- `src/app/components/login/login.component.ts`
- `src/app/components/register/register.component.ts`
- `src/app/components/dashboard/dashboard.component.ts`
- `src/app/components/icon-grid/icon-grid.component.ts`
- `src/app/components/icon-item/icon-item.component.ts`
- `src/app/components/icon-form/icon-form.component.ts`

### Environnements
- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

### Models
- `src/app/models/user.model.ts`
- `src/app/models/icon.model.ts`

---

## ✅ Checklist de démarrage

Avant de commencer la Phase 2 :

- [✅] Backend API fonctionnel (vérifié dans `forclaude-2.md`)
- [✅] Angular Material installé et configuré
- [ ] Serveur Symfony en cours d'exécution (`symfony server:start`)
- [ ] Serveur Angular prêt à démarrer (`cd front && ng serve`)
- [ ] Compte de test créé (déjà disponible : `antoine@test.fr` / `password0`)
- [ ] Ce plan-2.md lu et compris

---

## 🚀 Comment utiliser ce plan

1. **Travailler par milestones** : Chaque milestone est un ensemble cohérent de fonctionnalités
2. **Valider après chaque milestone** : Tester manuellement avant de passer à la suivante
3. **Suivre l'ordre** : Les milestones ont des dépendances (ex: auth avant dashboard)
4. **Référencer les étapes** : Utiliser les numéros [46-111] pour communiquer la progression
5. **Consulter forclaude-2.md** : Pour les détails techniques du backend

**Exemple d'utilisation** :
> "Je démarre le Sprint 1, Milestone 1 (étape 46). Peux-tu m'aider à créer les fichiers d'environnement ?"

---

**Date de création** : 2025-12-07
**Version** : 1.0
**Dépend de** : plan.md, forclaude-2.md
**Couverture** : Étapes 46-111 (Frontend complet)

---

**Prochaine étape recommandée** : Milestone 1 - Configuration environnement (étape 46)
