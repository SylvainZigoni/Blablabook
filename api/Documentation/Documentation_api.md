# Documentation API Backend - BlablaBook

> Documentation technique complète du backend de l'application BlablaBook
>
> **Version:** 1.0.0
> **Dernière mise à jour:** 2025-11-10

---

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture du projet](#architecture-du-projet)
3. [Point d'entrée (app.js)](#point-dentrée-appjs)
4. [Système de routing](#système-de-routing)
5. [Contrôleurs](#contrôleurs)
6. [Middleware](#middleware)
7. [Modèles de données](#modèles-de-données)
8. [Relations entre modèles](#relations-entre-modèles)
9.  [Sécurité](#sécurité)
10. [Scripts utilitaires](#scripts-utilitaires)

---

## Vue d'ensemble

BlablaBook est une application de gestion de bibliothèque personnelle permettant aux utilisateurs de :
- Créer un compte et s'authentifier
- Rechercher des livres par titre ou auteur
- Ajouter des livres à leur bibliothèque personnelle
- Suivre leur statut de lecture (à lire, en cours, lu)

### Technologies back utilisées

| Technologie | Version | Usage |
|-------------|---------|-------|
| Node.js | - | Runtime JavaScript |
| Express | 5.1.0 | Framework web |
| PostgreSQL | - | Base de données |
| Sequelize | 6.37.7 | ORM |
| JWT | 9.0.2 | Authentification |
| Argon2 | 0.44.0 | Hachage de mots de passe |
| Joi | 18.0.1 | Validation des données |

---

## Architecture du projet

```
api/
├── app.js                          # Point d'entrée de l'application
├── package.json                    # Dépendances et scripts
├── .env.exemple                    # Template des variables d'environnement
├── Dockerfile.api                  # Configuration Docker
│
├── routes/                         # Définition des routes
│   ├── index.route.js             # Routeur principal
│   ├── auth.route.js              # Routes d'authentification
│   └── book.route.js              # Routes des livres
│
├── controllers/                    # Logique métier
│   ├── auth.controller.js         # Contrôleur d'authentification
│   └── book.controller.js         # Contrôleur des livres
│
├── middlewares/                    # Fonctions middleware
│   ├── is-authed.middleware.js    # Vérification JWT
│   └── is_admin.middleware.js     # Vérification admin
│
├── models/                         # Modèles de données
│   ├── index.js                   # Associations entre modèles
│   ├── sequelize.client.js        # Connexion à la base de données
│   ├── user.model.js              # Modèle Utilisateur
│   ├── book.model.js              # Modèle Livre
│   ├── author.model.js            # Modèle Auteur
│   ├── category.model.js          # Modèle Catégorie
│   └── status.model.js            # Modèle relation User-Book
│
├── data/                           # Fichiers de base de données
│   ├── create_tables.sql          # Création du schéma
│   └── seed_tables.sql            # Données de test
│
├── scripts/                        # Scripts utilitaires
│   └── cleanImagePath.js          # Nettoyage des chemins d'images
│
└── public/                         # Fichiers statiques
    └── images/                     # Images des livres
```


### Initialisation de la base de données

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE blablabook;

# Exécuter le script de création des tables
psql -U postgres -d blablabook -f data/create_tables.sql

# (Optionnel) Insérer des données de test
psql -U postgres -d blablabook -f data/seed_tables.sql
```

---

## Point d'entrée (app.js)

**Fichier:** `app.js`

### Responsabilités

Le fichier `app.js` configure l'application Express et démarre le serveur.

### Configuration

```javascript
import express from "express";
import cors from "cors";
import { xss } from "express-xss-sanitizer";
import apiRouter from "./routes/index.route.js";

const app = express();

// Middleware CORS - Autorise les requêtes depuis le frontend
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"]
}));

// Parsing du body en JSON
app.use(express.json());

// Servir les fichiers statiques (images)
app.use(express.static("public"));

// Protection XSS
app.use(xss());

// Montage du routeur principal
app.use(apiRouter);

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### Middleware appliqués globalement

| Middleware | Rôle |
|------------|------|
| `cors()` | Autorise les requêtes cross-origin depuis le frontend (localhost:5173) |
| `express.json()` | Parse le body des requêtes au format JSON |
| `express.static("public")` | Sert les fichiers statiques (images) depuis le dossier `public/` |
| `xss()` | Nettoie les entrées utilisateur contre les attaques XSS |

---

## Système de routing

### Routeur principal

**Fichier:** `routes/index.route.js`

```javascript
import { Router } from "express";
import authRouter from "./auth.route.js";
import bookRouter from "./book.route.js";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/books", bookRouter);

export default apiRouter;
```

**Organisation:**
- `/auth/*` → Routes d'authentification
- `/books/*` → Routes de gestion des livres

---

### Routes d'authentification

**Fichier:** `routes/auth.route.js`

| Méthode | Endpoint | Middleware | Contrôleur | Description |
|---------|----------|------------|------------|-------------|
| `POST` | `/auth/add` | - | `authController.registerUser` | Inscription d'un nouvel utilisateur |
| `POST` | `/auth/login` | - | `authController.loginUser` | Connexion utilisateur |
| `GET` | `/auth/profile` | `isAuthed` | `authController.getProfile` | Récupérer le profil (commenté) |

**Exemple de requête - Inscription:**

```javascript
POST /auth/add
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "passwordConfirm": "SecurePass123"
}
```

**Réponse:**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "is_admin": false,
  "created_at": "2025-11-10T12:00:00.000Z"
}
```

**Exemple de requête - Connexion:**

```javascript
POST /auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123"
}
```

**Réponse:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "is_admin": false
  }
}
```

---

### Routes des livres

**Fichier:** `routes/book.route.js`

| Méthode | Endpoint | Middleware | Contrôleur | Description |
|---------|----------|------------|------------|-------------|
| `GET` | `/books/random` | - | `bookController.getRandomBooks` | Obtenir 3 livres aléatoires |
| `GET` | `/books/title/:titleSearched` | `isAuthed` | `bookController.getBooksByTitle` | Rechercher par titre |
| `GET` | `/books/author/:authorSearched` | `isAuthed` | `bookController.getBooksByAuthor` | Rechercher par auteur |
| `GET` | `/books/:userId` | `isAuthed` | `bookController.getAllUserBooks` | Livres d'un utilisateur |
| `POST` | `/books/:userId/:bookId` | `isAuthed` | `bookController.addUserBook` | Ajouter à la bibliothèque |
| `DELETE` | `/books/:userId/:bookId` | `isAuthed` | `bookController.deleteUserBook` | Retirer de la bibliothèque |

**Exemple de requête - Recherche par titre:**

```javascript
GET /books/title/harry
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Réponse:**
```json
[
  {
    "id": 1,
    "title": "Harry Potter à l'école des sorciers",
    "date_parution": "1997-06-26",
    "image_url": "harry_potter_1.jpg",
    "summary": "Un jeune sorcier découvre son destin...",
    "authors": [
      {
        "id": 1,
        "name": "Rowling",
        "forname": "J.K."
      }
    ],
    "categories": [
      {
        "id": 2,
        "name": "Fantasy"
      }
    ],
    "userStatus": "à lire"
  }
]
```

**Exemple de requête - Ajouter un livre:**

```javascript
POST /books/1/42
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Réponse:**
```json
{
  "id": 15,
  "user_id": 1,
  "book_id": 42,
  "status": "à lire",
  "created_at": "2025-11-10T12:00:00.000Z"
}
```

---

## Contrôleurs

### Contrôleur d'authentification

**Fichier:** `controllers/auth.controller.js`

#### `registerUser(req, res)`

**Objectif:** Créer un nouveau compte utilisateur

**Processus:**
1. Validation des données avec Joi
2. Vérification de la correspondance des mots de passe
3. Vérification de l'unicité du username et email
4. Hachage du mot de passe avec Argon2
5. Création de l'utilisateur en base
6. Retour des données utilisateur (sans le mot de passe)

**Validation Joi:**
```javascript
const schema = Joi.object({
  username: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/[a-z]/)  // Au moins une minuscule
    .pattern(/[A-Z]/)  // Au moins une majuscule
    .pattern(/[0-9]/)  // Au moins un chiffre
    .required(),
  passwordConfirm: Joi.string().required()
});
```

#### `loginUser(req, res)`

**Objectif:** Authentifier un utilisateur et générer un token JWT

**Processus:**
1. Validation des credentials avec Joi
2. Recherche de l'utilisateur par username
3. Vérification du mot de passe avec Argon2
4. Génération d'un token JWT (expiration 1h)
5. Retour du token et des infos utilisateur


---

### Contrôleur des livres

**Fichier:** `controllers/book.controller.js`

#### `getRandomBooks(req, res)`

**Objectif:** Obtenir 3 livres aléatoires pour la page d'accueil

**Particularités:**
- Pas d'authentification requise (route publique)
- Inclut auteurs et catégories
- Tri aléatoire avec `sequelize.random()`

---

#### `getAllUserBooks(req, res)`

**Objectif:** Récupérer tous les livres de la bibliothèque d'un utilisateur

**Particularités:**
- Filtrage par `user_id`
- Récupère le statut de lecture depuis la table de liaison `user_book`
- Retourne uniquement les livres appartenant à l'utilisateur

---

#### `addUserBook(req, res)`

**Objectif:** Ajouter un livre à la bibliothèque d'un utilisateur

**Particularités:**
- Statut par défaut: `"à lire"`
- Contrainte UNIQUE empêche les doublons
- Retourne l'entrée créée dans la table `user_book`

**Codes de statut HTTP:**
- `201 Created` - Livre ajouté
- `409 Conflict` - Livre déjà dans la bibliothèque (violation contrainte UNIQUE)

---

#### `deleteUserBook(req, res)`

**Objectif:** Retirer un livre de la bibliothèque d'un utilisateur

**Codes de statut HTTP:**
- `204 No Content` - Suppression réussie
- `500 Internal Server Error` - Erreur serveur

---

#### `getBooksByTitle(req, res)`

**Objectif:** Rechercher des livres par titre (avec statut utilisateur)

**Processus:**
Recherche des livres avec titre correspondant (ILIKE)

**Particularités:**
- Recherche insensible à la casse (`ILIKE`)

---

#### `getBooksByAuthor(req, res)`

**Objectif:** Rechercher des livres par nom ou prénom d'auteur

**Particularités:**
- Recherche sur `name` OU `forname`


---

## Middleware

### Middleware d'authentification JWT

**Fichier:** `middlewares/is-authed.middleware.js`

**Objectif:** Vérifier la validité du token JWT et extraire les informations utilisateur

**Processus:**
```javascript
export default function isAuthed(req, res, next) {
  try {
    // 1. Récupération du header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Token manquant" });
    }

    // 2. Extraction du token (format: "Bearer <token>")
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Format de token invalide" });
    }

    // 3. Vérification et décodage du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Injection des données dans la requête
    req.userId = decoded.userId;
    req.userRole = decoded.isAdmin ? "admin" : "user";

    // 5. Passage au middleware suivant
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
}
```

**Données injectées dans `req`:**
- `req.userId` - ID de l'utilisateur
- `req.userRole` - `"admin"` ou `"user"`

**Utilisation:**
```javascript
// Dans une route
router.get("/books/:userId", isAuthed, bookController.getAllUserBooks);
```

**Codes de statut HTTP:**
- `401 Unauthorized` - Token manquant, invalide ou expiré

---

### Middleware d'autorisation Admin

**Fichier:** `middlewares/is_admin.middleware.js`

**Objectif:** Vérifier que l'utilisateur a le rôle administrateur

**Code:**
```javascript
export default function isAdmin(req, res, next) {
  if (req.userRole !== "admin") {
    return res.status(403).json({
      error: "Accès refusé. Privilèges administrateur requis."
    });
  }

  next();
}
```

**Utilisation:**
```javascript
// Doit être utilisé APRÈS isAuthed
router.delete("/admin/users/:id", isAuthed, isAdmin, adminController.deleteUser);
```

**Codes de statut HTTP:**
- `403 Forbidden` - Utilisateur non autorisé

**Note:** Ce middleware n'est actuellement utilisé dans aucune route de l'application.

---

## Modèles de données

### Schéma relationnel complet

```
┌──────────┐           ┌─────────────┐           ┌──────────┐
│   USER   │───────────│  USER_BOOK  │───────────│   BOOK   │
│          │           │  (Status)   │           │          │
│ id (PK)  │           │ id (PK)     │           │ id (PK)  │
│ username │           │ user_id FK  │           │ title    │
│ email    │           │ book_id FK  │           │ summary  │
│ password │           │ status      │           └──────────┘
│ is_admin │           └─────────────┘                │
└──────────┘                                          │
                                                      │
                                          ┌───────────┴────────────┐
                                          │                        │
                                   ┌──────────────┐        ┌─────────────┐
                                   │ BOOK_AUTHOR  │        │ BOOK_CATEGORY│
                                   │              │        │              │
                                   │ book_id   FK │        │ book_id   FK │
                                   │ author_id FK │        │ category_id FK│
                                   └──────┬───────┘        └──────┬───────┘
                                          │                       │
                                   ┌──────────┐           ┌──────────┐
                                   │  AUTHOR  │           │ CATEGORY │
                                   │          │           │          │
                                   │ id (PK)  │           │ id (PK)  │
                                   │ name     │           │ name     │
                                   │ forname  │           └──────────┘
                                   └──────────┘
```

---

## Sécurité

### 1. Hachage des mots de passe (Argon2)

**Bibliothèque:** `argon2`

**Lors de l'inscription:**
```javascript
import argon2 from "argon2";

const hashedPassword = await argon2.hash(password);
```

**Lors de la connexion:**
```javascript
const isValid = await argon2.verify(user.password, password);
```

**Avantages d'Argon2:**
- Résistant aux attaques par GPU
- Gagnant du Password Hashing Competition (2015)
- Protection contre les attaques rainbow tables

---

### 2. Authentification JWT

**Bibliothèque:** `jsonwebtoken`

**Génération du token:**
```javascript
const token = jwt.sign(
  {
    userId: user.id,
    username: user.username,
    isAdmin: user.is_admin
  },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);
```

**Vérification du token:**
```javascript
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

**Bonnes pratiques:**
- Token expire après 1 heure
- Secret stocké dans variable d'environnement
- Token transmis via header `Authorization: Bearer <token>`

---

### 3. Protection XSS

**Bibliothèque:** `express-xss-sanitizer`

```javascript
import { xss } from "express-xss-sanitizer";

app.use(xss());
```

**Effet:**
- Nettoie automatiquement les entrées utilisateur
- Supprime les balises HTML et scripts malveillants
- Protection contre les injections de code

---

### 4. CORS

**Bibliothèque:** `cors`

```javascript
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"]
}));
```

**Configuration:**
- Autorise uniquement le frontend local
- Bloque les requêtes depuis d'autres domaines

---

### 5. Validation des données (Joi)

**Bibliothèque:** `joi`

**Exemple - Validation inscription:**
```javascript
const schema = Joi.object({
  username: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/[a-z]/)  // Au moins une minuscule
    .pattern(/[A-Z]/)  // Au moins une majuscule
    .pattern(/[0-9]/)  // Au moins un chiffre
    .required(),
  passwordConfirm: Joi.string().required()
});

const { error } = schema.validate(req.body);
```

**Avantages:**
- Validation côté serveur
- Messages d'erreur clairs
- Prévention des injections SQL

---

### 6. Protection contre les injections SQL

**ORM Sequelize:**
- Utilise des requêtes paramétrées
- Échappe automatiquement les valeurs
- Protection native contre les injections SQL

**Exemple sécurisé:**
```javascript
// ✅ Sécurisé avec Sequelize
Book.findAll({
  where: { title: { [Op.iLike]: `%${userInput}%` } }
});

// ❌ Dangereux (SQL brut)
sequelize.query(`SELECT * FROM book WHERE title LIKE '%${userInput}%'`);
```

---

## Codes de statut HTTP utilisés

| Code | Nom | Usage |
|------|-----|-------|
| `200` | OK | Requête réussie (GET, login) |
| `201` | Created | Ressource créée (POST register, add book) |
| `204` | No Content | Suppression réussie (DELETE) |
| `400` | Bad Request | Validation Joi échouée |
| `401` | Unauthorized | Token manquant/invalide, credentials incorrects |
| `403` | Forbidden | Accès refusé (admin requis) |
| `404` | Not Found | Ressource introuvable |
| `409` | Conflict | Contrainte UNIQUE violée (username/email existant) |
| `500` | Internal Server Error | Erreur serveur non gérée |

---

## Commandes utiles

### Base de données

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE blablabook;

# Lister les bases de données
\l

# Se connecter à une base
\c blablabook

# Lister les tables
\dt

# Décrire une table
\d user

# Exécuter un script SQL
psql -U postgres -d blablabook -f data/create_tables.sql

# Dump de la base
pg_dump -U postgres blablabook > backup.sql

# Restaurer un dump
psql -U postgres -d blablabook < backup.sql
```

---

## Dépendances du projet

### Dependencies (Production)

```json
{
  "argon2": "^0.44.0",              // Hachage de mots de passe
  "cors": "^2.8.5",                 // Cross-Origin Resource Sharing
  "dotenv": "^17.2.3",              // Variables d'environnement
  "express": "^5.1.0",              // Framework web
  "express-xss-sanitizer": "^2.0.1", // Protection XSS
  "http-status-codes": "^2.3.0",    // Constantes HTTP
  "joi": "^18.0.1",                 // Validation de schémas
  "jsonwebtoken": "^9.0.2",         // JWT
  "pg": "^8.16.3",                  // Client PostgreSQL
  "sequelize": "^6.37.7"            // ORM
}
```

---

## Glossaire

| Terme | Définition |
|-------|------------|
| **ORM** | Object-Relational Mapping - Permet de manipuler la base de données avec des objets JavaScript |
| **JWT** | JSON Web Token - Standard d'authentification par token |
| **Middleware** | Fonction exécutée entre la réception de la requête et l'envoi de la réponse |
| **CORS** | Cross-Origin Resource Sharing - Mécanisme de sécurité pour les requêtes cross-domain |
| **XSS** | Cross-Site Scripting - Type d'attaque par injection de scripts malveillants |
| **Argon2** | Algorithme de hachage de mots de passe moderne et sécurisé |
| **CITEXT** | Case Insensitive TEXT - Type PostgreSQL pour texte insensible à la casse |
| **Junction table** | Table de jonction reliant deux tables dans une relation Many-to-Many |
| **FK** | Foreign Key - Clé étrangère référençant une autre table |
| **PK** | Primary Key - Clé primaire unique identifiant une ligne |

---

## Changelog

### Version 1.0.0 (2025-11-10)

**Fonctionnalités:**
- ✅ Système d'authentification JWT complet
- ✅ CRUD de bibliothèque utilisateur
- ✅ Recherche par titre et auteur
- ✅ Gestion des statuts de lecture
- ✅ Relations Many-to-Many (auteurs, catégories)
- ✅ Protection XSS et validation Joi
- ✅ Hachage Argon2

**Corrections:**
- ✅ Nettoyage des chemins d'images
- ✅ Gestion des erreurs uniformisée

---

## Auteurs

- **Équipe BlablaBook** - Développement initial

---

**Dernière mise à jour:** 2025-11-10
**Version de la documentation:** 1.0.0
