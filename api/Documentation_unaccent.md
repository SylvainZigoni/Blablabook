# Documentation - Recherche insensible aux accents avec PostgreSQL `unaccent`

## Problème initial

Lorsqu'un utilisateur recherchait un livre avec le titre "les miserables" (sans accent), aucun résultat n'était trouvé alors que le livre "Les Misérables" (avec accent) existait dans la base de données.

La recherche était sensible aux accents, ce qui limitait l'expérience utilisateur.

## Solution mise en place

Utilisation de l'extension PostgreSQL `unaccent` qui permet de normaliser les chaînes de caractères en supprimant les accents lors des comparaisons.

## Configuration automatique pour les nouveaux développeurs

L'extension `unaccent` s'active **automatiquement** lors du premier démarrage de la base de données grâce au fichier `api/data/00_enable_unaccent.sql`.

### Pour récupérer le projet

Vos collègues n'ont qu'à faire :

```bash
git pull
docker compose down
docker compose up -d
```

Aucune manipulation manuelle n'est nécessaire ! 🎉

## Étapes d'implémentation

### 1. Activation automatique de l'extension PostgreSQL

**Fichier :** `api/data/00_enable_unaccent.sql`

Ce fichier SQL s'exécute automatiquement au démarrage de PostgreSQL :

```sql
-- Activation de l'extension unaccent pour la recherche insensible aux accents
CREATE EXTENSION IF NOT EXISTS unaccent;
```

Les fichiers SQL dans le dossier `api/data` sont montés dans `/docker-entrypoint-initdb.d` du conteneur PostgreSQL et sont exécutés par ordre alphabétique lors de l'initialisation de la base de données.

**Activation manuelle (si nécessaire) :**

Si vous avez besoin d'activer l'extension manuellement sur une base de données existante, vous pouvez utiliser le script Node.js :

```bash
docker compose exec api node scripts/enableUnaccent.js
```

### 2. Modification de la méthode `getBooksByTitle`

**Fichier :** `api/controllers/book.controller.js`

**Avant :**
```javascript
const books = await Book.findAll({
    where: {
        title: {
            [Op.iLike]: `%${titleSearched}%`, // Sensible aux accents
        },
    },
    // ...
});
```

**Après :**
```javascript
const books = await Book.findAll({
    where: sequelize.where(
        sequelize.fn('unaccent', sequelize.col('title')),
        {
            [Op.iLike]: sequelize.fn('unaccent', `%${titleSearched}%`)
        }
    ),
    // ...
});
```

### 3. Modification de la méthode `getBooksByAuthor`

**Fichier :** `api/controllers/book.controller.js`

**Avant :**
```javascript
where: {
    [Op.or]: [
        { name: { [Op.iLike]: `%${authorSearched}%` } },
        { forname: { [Op.iLike]: `%${authorSearched}%` } },
    ],
}
```

**Après :**
```javascript
where: {
    [Op.or]: [
        sequelize.where(
            sequelize.fn('unaccent', sequelize.col('name')),
            {
                [Op.iLike]: sequelize.fn('unaccent', `%${authorSearched}%`)
            }
        ),
        sequelize.where(
            sequelize.fn('unaccent', sequelize.col('forname')),
            {
                [Op.iLike]: sequelize.fn('unaccent', `%${authorSearched}%`)
            }
        ),
    ],
}
```

## Comment ça fonctionne

La fonction `unaccent()` de PostgreSQL transforme une chaîne de caractères en supprimant tous les accents :

- "Les Misérables" → "Les Miserables"
- "Émile Zola" → "Emile Zola"
- "À la recherche du temps perdu" → "A la recherche du temps perdu"

En appliquant `unaccent()` à la fois sur :
1. La colonne de la base de données (`sequelize.col('title')`)
2. Le terme recherché (`%${titleSearched}%`)

On compare deux chaînes normalisées sans accents, rendant la recherche insensible aux accents.

## Exemples de requêtes générées

**Requête SQL générée :**
```sql
SELECT "id", "title"
FROM "book" AS "Book"
WHERE unaccent("title") ILIKE unaccent('%miserables%');
```

Cette requête trouvera :
- "Les Misérables"
- "les misérables"
- "LES MISERABLES"
- "Les Miserables"

## Tests

**Fichier :** `api/scripts/testUnaccent.js`

Ce script permet de tester que la recherche fonctionne avec et sans accents.

**Commande d'exécution :**
```bash
docker compose exec api node scripts/testUnaccent.js
```

**Résultat attendu :**
```
🔍 Recherche de 'misérables' (avec accent)...
✅ Résultats trouvés: 1
   - Les Misérables

🔍 Recherche de 'miserables' (sans accent)...
✅ Résultats trouvés: 1
   - Les Misérables

🎉 SUCCESS! La recherche fonctionne avec et sans accents!
```

## Routes concernées

- **Recherche par titre :** `GET /books/title/:titleSearched`
- **Recherche par auteur :** `GET /books/author/:authorSearched`

## Avantages de cette solution

✅ **Simple** : Utilise une extension native PostgreSQL
✅ **Performant** : Traitement côté base de données
✅ **Transparent** : Aucun changement nécessaire côté frontend
✅ **Automatique** : Fonctionne pour toutes les recherches
✅ **Extensible** : Peut être appliqué à d'autres colonnes si nécessaire

## Notes importantes

- L'extension `unaccent` s'active **automatiquement** lors du premier démarrage de Docker
- Si vous supprimez le volume Docker de la base de données, l'extension sera réactivée automatiquement au prochain `docker compose up`
- Cette solution fonctionne pour tous les types d'accents (français, espagnol, etc.)
- Le fichier `00_enable_unaccent.sql` utilise le préfixe `00_` pour s'exécuter en premier, avant la création des tables

## Maintenance future

Si vous ajoutez d'autres champs de recherche textuels, pensez à appliquer la même technique :

```javascript
where: sequelize.where(
    sequelize.fn('unaccent', sequelize.col('nom_du_champ')),
    {
        [Op.iLike]: sequelize.fn('unaccent', `%${termRecherche}%`)
    }
)
```
