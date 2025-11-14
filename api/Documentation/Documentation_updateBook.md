# Comment fonctionne la méthode updateBook

## Introduction

La méthode `updateBook` permet à un administrateur de **modifier les informations d'un livre** qui existe déjà dans la base de données. Cette méthode se trouve dans le fichier [admin.controller.js](api/controllers/admin.controller.js#L245).

## Que peut-on modifier ?

L'administrateur peut modifier **4 choses** sur un livre :
- Le **titre** du livre
- Le **résumé** (description du livre)
- La **date de parution**
- L'**image de couverture** (URL de l'image)

**Important :** On ne peut pas modifier les auteurs et les catégories. Si on doit les changer, il faut supprimer le livre et en créer un nouveau.

## Comment ça marche ? (Étape par étape)

### Étape 1 : Définir les règles de validation

Avant même de toucher à la base de données, on définit des **règles** pour s'assurer que les données envoyées sont correctes. On utilise une bibliothèque appelée **Joi** pour ça.

```javascript
const updateBookSchema = Joi.object({
    title: Joi.string().trim().min(1).max(255)
        .messages({
            'string.empty': 'Le titre ne peut pas être vide.',
            'string.min': 'Le titre ne peut pas être vide.',
            'string.max': 'Le titre ne peut pas dépasser 255 caractères.'
        }),
    summary: Joi.string().trim().allow('', null),
    date_parution: Joi.date().max('now')
        .messages({
            'date.max': 'La date de parution ne peut pas être dans le futur.'
        }),
    image_url: Joi.string().trim().allow('', null)
});
```

**Ce que ça veut dire :**
- **title** : doit être un texte entre 1 et 255 caractères
- **summary** : peut être du texte, vide ou null (pas obligatoire)
- **date_parution** : doit être une date, mais pas dans le futur
- **image_url** : peut être du texte, vide ou null (pas obligatoire)

### Étape 2 : Récupérer l'ID du livre

On récupère l'identifiant du livre depuis l'URL de la requête :

```javascript
const bookId = req.params.id;
```

**Exemple :** Si l'URL est `/books/5`, alors `bookId` sera `5`.

### Étape 3 : Valider les données reçues

On vérifie que les données envoyées par l'administrateur respectent bien les règles définies à l'étape 1 :

```javascript
const { error, value } = updateBookSchema.validate(req.body, {
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

### Étape 4 : Vérifier que le livre existe

On cherche le livre dans la base de données :

```javascript
const book = await Book.findByPk(bookId);
if (!book) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: 'Livre non trouvé.' });
}
```

**Si le livre n'existe pas**, on renvoie une erreur 404 (Not Found).

### Étape 5 : Mettre à jour les champs

On modifie uniquement les champs qui ont été envoyés dans la requête :

```javascript
if (value.title !== undefined) {
    book.title = value.title;
}
if (value.summary !== undefined) {
    book.summary = value.summary || null;
}
if (value.date_parution !== undefined) {
    book.date_parution = value.date_parution;
}
if (value.image_url !== undefined) {
    book.image_url = value.image_url || null;
}
```

**Pourquoi `!== undefined` ?**
- Ça permet de ne modifier que les champs qui ont été envoyés
- Si on envoie juste le titre, seul le titre sera modifié (les autres champs restent inchangés)

### Étape 6 : Sauvegarder dans la base de données

On enregistre les modifications dans la base de données :

```javascript
await book.save();
```

### Étape 7 : Renvoyer le livre modifié

On renvoie le livre avec ses nouvelles informations :

```javascript
res.status(StatusCodes.OK).json(book);
```

## Gestion des erreurs

Le code gère plusieurs types d'erreurs possibles :

### 1. Erreur de validation Sequelize
Si la base de données détecte que les données ne sont pas valides :
```javascript
if (error.name === 'SequelizeValidationError') {
    return res.status(StatusCodes.BAD_REQUEST).json({
        error: error.errors.map(e => e.message)
    });
}
```

### 2. Erreur de doublon
Si on essaie de créer un livre qui existe déjà :
```javascript
if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(StatusCodes.CONFLICT).json({
        error: 'Un livre avec ces informations existe déjà.'
    });
}
```

### 3. Erreur de données invalides
Si les données ne correspondent pas au format attendu par la base de données :
```javascript
if (error.name === 'SequelizeDatabaseError') {
    return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Données invalides.'
    });
}
```

### 4. Erreur générale
Pour toutes les autres erreurs imprévues :
```javascript
console.error("Erreur lors de la mise à jour du livre :", error);
res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erreur serveur" });
```

## Schéma récapitulatif

```
Requête de l'admin
       ↓
1. Récupérer l'ID du livre
       ↓
2. Valider les données avec Joi
       ↓
3. Vérifier que le livre existe
       ↓
4. Modifier les champs nécessaires
       ↓
5. Sauvegarder dans la base de données
       ↓
6. Renvoyer le livre modifié
```

## Exemple d'utilisation

### Requête HTTP
```
PUT /books/5
Content-Type: application/json

{
  "title": "Le Seigneur des Anneaux - Edition 2024",
  "date_parution": "2024-01-15"
}
```

### Réponse
```json
{
  "id": 5,
  "title": "Le Seigneur des Anneaux - Edition 2024",
  "summary": "Un roman épique...",
  "date_parution": "2024-01-15",
  "image_url": "https://example.com/image.jpg"
}
```

## Points importants à retenir

1. **Validation des données** : On vérifie toujours les données avant de les enregistrer
2. **Modification partielle** : On peut modifier seulement certains champs, pas besoin de tout renvoyer
3. **Sécurité** : Le code protège contre les erreurs et les données invalides
4. **Messages d'erreur clairs** : Si quelque chose ne va pas, l'administrateur sait pourquoi
5. **Pas de modification des relations** : On ne peut pas changer les auteurs/catégories pour garder la cohérence

## Fichiers liés

- Contrôleur : [admin.controller.js:245](api/controllers/admin.controller.js#L245)
- Modèle Book : [book.model.js](api/models/book.model.js)
