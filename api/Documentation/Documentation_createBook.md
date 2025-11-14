# Comment fonctionne la méthode createBook

## Introduction

La méthode `createBook` permet à un administrateur de **créer un nouveau livre** dans la base de données. Cette méthode se trouve dans le fichier [admin.controller.js](api/controllers/admin.controller.js#L336).

## Que peut-on définir lors de la création ?

L'administrateur peut définir **6 informations** pour un nouveau livre :
- Le **titre** du livre (OBLIGATOIRE)
- Le **résumé** (description du livre) - optionnel
- La **date de parution** - optionnel
- L'**image de couverture** (URL de l'image) - optionnel
- L'**auteur** (via son ID) - optionnel
- La **catégorie** (via son ID) - optionnel

**Important :** Seul le titre est obligatoire. Toutes les autres informations peuvent être ajoutées plus tard via la modification du livre.

## Comment ça marche ? (Étape par étape)

### Étape 1 : Définir les règles de validation

On définit des **règles strictes** pour s'assurer que les données envoyées sont correctes. On utilise la bibliothèque **Joi** pour ça.

```javascript
const createBookSchema = Joi.object({
    title: Joi.string().trim().min(1).max(255).required()
        .messages({
            'string.empty': 'Le champ "title" est requis.',
            'string.min': 'Le titre ne peut pas être vide.',
            'string.max': 'Le titre ne peut pas dépasser 255 caractères.',
            'any.required': 'Le champ "title" est requis.'
        }),
    summary: Joi.string().trim().allow('', null),
    date_parution: Joi.date().max('now').allow(null)
        .messages({
            'date.max': 'La date de parution ne peut pas être dans le futur.'
        }),
    image_url: Joi.string().trim().uri().allow('', null)
        .messages({
            'string.uri': `L'URL de l'image doit être valide.`
        }),
    authorId: Joi.number().integer().positive().allow(null)
        .messages({
            'number.base': `L'ID de l'auteur doit être un nombre.`,
            'number.integer': `L'ID de l'auteur doit être un entier.`,
            'number.positive': `L'ID de l'auteur doit être positif.`
        }),
    categoryId: Joi.number().integer().positive().allow(null)
        .messages({
            'number.base': `L'ID de la catégorie doit être un nombre.`,
            'number.integer': `L'ID de la catégorie doit être un entier.`,
            'number.positive': `L'ID de la catégorie doit être positif.`
        })
});
```

**Ce que ça veut dire :**
- **title** : OBLIGATOIRE, texte entre 1 et 255 caractères
- **summary** : texte optionnel, peut être vide ou null
- **date_parution** : date optionnelle, mais ne peut pas être dans le futur
- **image_url** : URL optionnelle, doit être une URL valide si fournie
- **authorId** : nombre entier positif optionnel (l'ID d'un auteur existant)
- **categoryId** : nombre entier positif optionnel (l'ID d'une catégorie existante)

### Étape 2 : Valider les données reçues

On vérifie que les données envoyées par l'administrateur respectent bien les règles définies à l'étape 1 :

```javascript
const { error, value } = createBookSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
});
```

**Ce que ça fait :**
- `abortEarly: false` : vérifie toutes les erreurs en une fois (au lieu de s'arrêter à la première)
- `stripUnknown: true` : ignore les champs qui ne sont pas dans le schéma

Si des erreurs sont détectées, on renvoie un message d'erreur détaillé :

```javascript
if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
        error: error.details.map(detail => detail.message)
    });
}
```

### Étape 3 : Créer le livre avec les informations de base

On crée d'abord le livre avec les informations de base (sans les relations) :

```javascript
const newBook = await Book.create({
    title: value.title,
    summary: value.summary || null,
    date_parution: value.date_parution || null,
    image_url: value.image_url || null
});
```

**Pourquoi en deux temps ?**
- On crée d'abord le livre pour obtenir son ID
- Ensuite on pourra ajouter les relations (auteur et catégorie) en utilisant cet ID

### Étape 4 : Ajouter l'auteur (si fourni)

Si un ID d'auteur a été fourni, on vérifie qu'il existe et on crée la relation :

```javascript
if (value.authorId) {
    const author = await Author.findByPk(value.authorId);
    if (!author) {
        return res.status(StatusCodes.NOT_FOUND).json({
            error: `L'auteur avec l'ID ${value.authorId} n'existe pas.`
        });
    }
    await newBook.addAuthor(author);
}
```

**Ce qui se passe ici :**
1. On cherche l'auteur dans la base de données avec l'ID fourni
2. Si l'auteur n'existe pas, on renvoie une erreur 404
3. Si l'auteur existe, on crée le lien entre le livre et l'auteur

### Étape 5 : Ajouter la catégorie (si fournie)

De la même manière, si un ID de catégorie a été fourni, on vérifie qu'elle existe et on crée la relation :

```javascript
if (value.categoryId) {
    const category = await Category.findByPk(value.categoryId);
    if (!category) {
        return res.status(StatusCodes.NOT_FOUND).json({
            error: `La catégorie avec l'ID ${value.categoryId} n'existe pas.`
        });
    }
    await newBook.addCategory(category);
}
```

**Ce qui se passe ici :**
1. On cherche la catégorie dans la base de données avec l'ID fourni
2. Si la catégorie n'existe pas, on renvoie une erreur 404
3. Si la catégorie existe, on crée le lien entre le livre et la catégorie

### Étape 6 : Recharger le livre avec toutes ses informations

Pour renvoyer le livre complet avec toutes ses relations, on le recharge depuis la base de données :

```javascript
const bookWithAssociations = await Book.findByPk(newBook.id, {
    include: [
        { model: Author, through: { attributes: [] } },
        { model: Category, through: { attributes: [] } }
    ]
});
```

**Pourquoi recharger le livre ?**
- Quand on crée le livre, on n'a que ses informations de base
- En le rechargeant avec `include`, on récupère aussi l'auteur et la catégorie associés
- `through: { attributes: [] }` permet de ne pas inclure les données de la table de liaison (on veut juste l'auteur et la catégorie)

### Étape 7 : Renvoyer le livre créé

On renvoie le livre nouvellement créé avec toutes ses informations :

```javascript
res.status(StatusCodes.CREATED).json(bookWithAssociations);
```

Le code de statut **201 (CREATED)** indique qu'une nouvelle ressource a été créée avec succès.

## Gestion des erreurs

Le code gère plusieurs types d'erreurs possibles :

### 1. Erreur de validation
Si les données ne respectent pas les règles (titre manquant, URL invalide, etc.) :
```javascript
if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
        error: error.details.map(detail => detail.message)
    });
}
```

### 2. Auteur non trouvé
Si l'ID de l'auteur fourni n'existe pas dans la base de données :
```javascript
if (!author) {
    return res.status(StatusCodes.NOT_FOUND).json({
        error: `L'auteur avec l'ID ${value.authorId} n'existe pas.`
    });
}
```

### 3. Catégorie non trouvée
Si l'ID de la catégorie fourni n'existe pas dans la base de données :
```javascript
if (!category) {
    return res.status(StatusCodes.NOT_FOUND).json({
        error: `La catégorie avec l'ID ${value.categoryId} n'existe pas.`
    });
}
```

### 4. Erreur générale
Pour toutes les autres erreurs imprévues :
```javascript
console.error("Erreur lors de la création du livre :", error);
res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: "Erreur serveur",
});
```

## Schéma récapitulatif

```
Requête de l'admin
       ↓
1. Valider les données avec Joi
       ↓
2. Créer le livre avec les infos de base
       ↓
3. Ajouter l'auteur (si fourni)
       ↓
4. Ajouter la catégorie (si fournie)
       ↓
5. Recharger le livre avec toutes ses relations
       ↓
6. Renvoyer le livre créé
```

## Exemples d'utilisation

### Exemple 1 : Créer un livre avec seulement le titre (minimum requis)

**Requête HTTP**
```
POST /books
Content-Type: application/json

{
  "title": "Le Petit Prince"
}
```

**Réponse**
```json
{
  "id": 42,
  "title": "Le Petit Prince",
  "summary": null,
  "date_parution": null,
  "image_url": null,
  "Authors": [],
  "Categories": []
}
```

### Exemple 2 : Créer un livre complet avec toutes les informations

**Requête HTTP**
```
POST /books
Content-Type: application/json

{
  "title": "Le Seigneur des Anneaux",
  "summary": "Un roman épique de fantasy...",
  "date_parution": "1954-07-29",
  "image_url": "https://example.com/lotr.jpg",
  "authorId": 5,
  "categoryId": 3
}
```

**Réponse**
```json
{
  "id": 43,
  "title": "Le Seigneur des Anneaux",
  "summary": "Un roman épique de fantasy...",
  "date_parution": "1954-07-29",
  "image_url": "https://example.com/lotr.jpg",
  "Authors": [
    {
      "id": 5,
      "name": "Tolkien",
      "forname": "J.R.R."
    }
  ],
  "Categories": [
    {
      "id": 3,
      "name": "Fantasy"
    }
  ]
}
```

### Exemple 3 : Erreur - Titre manquant

**Requête HTTP**
```
POST /books
Content-Type: application/json

{
  "summary": "Un livre sans titre"
}
```

**Réponse**
```json
{
  "error": [
    "Le champ \"title\" est requis."
  ]
}
```

### Exemple 4 : Erreur - Auteur inexistant

**Requête HTTP**
```
POST /books
Content-Type: application/json

{
  "title": "Un nouveau livre",
  "authorId": 999
}
```

**Réponse**
```json
{
  "error": "L'auteur avec l'ID 999 n'existe pas."
}
```

## Différences avec updateBook

| Aspect | createBook | updateBook |
|--------|-----------|------------|
| **Objectif** | Créer un nouveau livre | Modifier un livre existant |
| **Champs obligatoires** | Titre obligatoire | Aucun champ obligatoire |
| **ID nécessaire** | Non (généré automatiquement) | Oui (dans l'URL) |
| **Relations** | Peut ajouter auteur et catégorie | Ne peut pas modifier les relations |
| **Code HTTP** | 201 (CREATED) | 200 (OK) |
| **Méthode HTTP** | POST | PUT/PATCH |

## Points importants à retenir

1. **Seul le titre est obligatoire** : On peut créer un livre avec juste un titre et ajouter le reste plus tard
2. **Validation stricte** : Toutes les données sont vérifiées avant la création
3. **Vérification des relations** : Si on fournit un auteur ou une catégorie, le code vérifie qu'ils existent vraiment
4. **Création en plusieurs étapes** : D'abord le livre, puis les relations
5. **Retour complet** : Le livre est renvoyé avec toutes ses informations et relations
6. **Messages d'erreur clairs** : Si quelque chose ne va pas, l'administrateur sait exactement quel est le problème

## Cas d'usage typiques

### Cas 1 : Ajout rapide d'un livre
L'admin vient de recevoir un nouveau livre et veut juste l'enregistrer rapidement avec son titre. Il pourra compléter les informations plus tard.

### Cas 2 : Ajout complet d'un livre
L'admin a toutes les informations sous la main (titre, résumé, date, image, auteur, catégorie) et crée le livre avec tout en une fois.

### Cas 3 : Ajout d'un livre avec un nouvel auteur
L'admin doit d'abord créer l'auteur (via `addAuthor`), puis créer le livre en utilisant l'ID de l'auteur nouvellement créé.

## Fichiers liés

- Contrôleur : [admin.controller.js:336](api/controllers/admin.controller.js#L336)
- Modèle Book : [book.model.js](api/models/book.model.js)
- Documentation updateBook : [documentation-updateBook.md](documentation-updateBook.md)
