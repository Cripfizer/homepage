# Projet Full Stack - Symfony 7.4 + Angular 21

Ce projet contient une API REST avec Symfony 7.4 et API Platform, et un front-end avec Angular 21.

## Structure du projet

```
.
├── api/          # Backend Symfony 7.4 + API Platform
└── front/        # Frontend Angular 21
```

## API (Backend)

### Technologies
- Symfony 7.4
- API Platform 4.2
- Doctrine ORM
- CORS configuré avec nelmio/cors-bundle

### Installation

```bash
cd api
composer install
```

### Configuration

1. Configurer la base de données dans `.env`:
```
DATABASE_URL="postgresql://user:password@127.0.0.1:5432/dbname?serverVersion=16&charset=utf8"
```

2. Créer la base de données:
```bash
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
```

### Démarrer le serveur

```bash
symfony serve
# ou
php -S localhost:8000 -t public
```

L'API sera accessible sur `http://localhost:8000/api`

## Front (Frontend)

### Technologies
- Angular 21
- TypeScript
- CSS

### Installation

```bash
cd front
npm install
```

### Démarrer le serveur de développement

```bash
npm start
# ou
ng serve
```

L'application sera accessible sur `http://localhost:4200`

## Développement

### Créer une ressource API

```bash
cd api
php bin/console make:entity --api-resource
```

### Générer un composant Angular

```bash
cd front
ng generate component nom-du-composant
```

## Configuration CORS

Le CORS est déjà configuré dans l'API via `nelmio/cors-bundle`. Par défaut, il accepte les requêtes depuis `http://localhost:4200`.

Pour modifier la configuration, éditez `api/config/packages/nelmio_cors.yaml`.

## Prochaines étapes

1. Créer vos entités dans `api/src/Entity/` ou `api/src/ApiResource/`
2. Développer vos composants Angular dans `front/src/app/`
3. Configurer les services Angular pour communiquer avec l'API
4. Ajouter l'authentification si nécessaire (JWT recommandé)
