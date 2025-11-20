# Déployer le site sur internet

## Déployer sur un cloud (par exemple Render.com)
Le projet Blablabook s'appuyant sur la technologie Docker, nous allons utiliser cette dernière pour déployer notre application web sur internet.

### Etapes
1. Monter les images docker à l'aide du fichier `docker-compose.yml` :
```bash
# Dans le terminal apres etre aller dans le dossier du projet, executer la commande suivante
# Cette commande va créer à partir à partir de notre docker compose, 3 images et 3 conteneurs pour faire fonctionner notre application en local.
docker compose up -d --build
```

2. Ajouter un tag aux images docker pour le client et l'api
```bash
# Récupérer les images
docker images

# Ajouter un tag
docker tag <id de l'image api> <nom compte dockerhub>blablabook-api
docker tag <id de l'image cli> <nom compte dockerhub>blablabook-cli
```

3. Publier les images taggées sur **dockerhub**

```Bash
docker push <nom compte docker>/blablabook-api
docker push <nom compte docker>/blablabook-cli
```

4. Render

- Se connecter a render
- Créer un nouveau projet

5. Heberger la base de donnée sur postgres

- Ajouter un nouveau service et choisir postgres
- Choisir comme nom : `blablabook-db`
- Choisir comme Database : `blablabook`
- Choisir comme User : `blablabook`
- La méthode gratuite est suffisante
==> **Deploy Postgres Instance**

Il est important de bien noter l'ensemble des informations qui nous serons fournies :

```bash
- Port
- Database
- Username
- Password
- Internal Database URL # adresse pour se connecter à la BDD depuis un composant render
- External Database URL # adresse pour se connecter à la BDD en dehors de render
- PSQL Command # commande pour se connecter a la bdd depuis son terminam
```

- A partir de votre terminal executer les 3 scripts SQL présent dans api/data

```bash
# Se connecter a la base de donnée distante et forcer l'encodage en UTF8
# Permettre la recherche sans les accents
PGPASSWORD=<password> PGCLIENTENCODING=UTF8 psql\
  -h <hostname>.<server location>-postgres.render.com \
  -U blablabook \
  -d <database> \
  -p <port> \
  -f 00_enable_unaccent.sql
```

```bash
# Creation des tables
PGPASSWORD=<password> PGCLIENTENCODING=UTF8 psql\
  -h <hostname>.<server location>-postgres.render.com \
  -U blablabook \
  -d <database> \
  -p <port> \
  -f 01_create_tables.sql
```

```bash
#Seed des tables avec les données de test
PGPASSWORD=<password> PGCLIENTENCODING=UTF8 psql\
  -h <hostname>.<server location>-postgres.render.com \
  -U blablabook \
  -d <database> \
  -p <port> \
  -f 01_create_tables.sql
```

- Assurez vous que les données ont bien été chargées dans les tables :

```bash
# connexion a la bdd
<PSQL Command>
```

- Une fois connecté à la base de données, vérifier les tables :

```sql
SELECT * FROM book;
SELECT * FROM "user";
SELECT * FROM author;
SELECT * FROM category;
```

6. Creation du service API

- Sur render, ajouter un `New sevice`, `Web service`
- Utiliser une existing image : `<nom docker>/blablabook-api:latest`
- Connect
- Ajouter les variables d'environnement :
    - DB_URL : `<Internal Database URL>`
    - JWT_SECRET : `<Votre clef JWT>`
    - PORT : 3000

Renseigner l'adresse de la base de données postgres dans les variables d'environnement est suffisant pour lier la base de données et notre service api

**Noter l'adresse URL sur laquelle le serveur sera publié**

7. Création du service CLIENT

- Utiliser une existing image : `<nom docker>/blablabook-cli:latest`
- Connect
- Ajouter les variables d'environnement :
    - VITE_API_BASE_URL : `<URL du serveur backend>`
    - VITE_API_PUBLIC_URL : `<URL du serveur backend>`

Comme pour le serveur, renseigner les variables d'environnement est suffisant pour créer la connexion entre le front et le back.

L'URL fourni pour le service client est celle sur laquelle notre site pourra etre consulté.

8. Verification de la connexion

Il est possible que le serveur bloque les requetes API du frontend en fonction des paramètres de CORS renseignés.

Si tel est le cas :

- Ajouter l'url du front dans les CORS au niveau du fichier api/app.js
- Arreter l'ensemble des conteneurs via docker :

```bash
docker compose down
```

- Remonter l'ensemble des images :

```bash
Docker compose up -d --build
```

- Ajouter le tag avec votre nom dockerhub à l'image de l'api
- publier l'image sur Dockerhub
- Aller dans votre Web service API sur render, et redeployer le

9. Vérification que le compilateur est autorisé pour l'host render.
Si dans votre console de navigateur vous rencontrer des problèmes MINE c'est que ce n'est surrement pas le cas.

Si tel est le cas, modifier le fichier client/vite.config.js
```js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		allowedHosts: ['blablabook-cli.onrender.com']
	},
});
```

- Arreter l'ensemble des conteneurs via docker :

```bash
docker compose down
```

- Remonter l'ensemble des images :

```bash
Docker compose up -d --build
```

- Ajouter le tag avec votre nom dockerhub à l'image du client
- publier l'image sur Dockerhub
- Aller dans votre Web service client sur render, et redeployer le


## Bonus

La version gratuite de render fait que les services web deviennent inactifs au bout de 15min sans activité.
Pour contourner ce probleme, il est possible de paramétrer un service qui va pinger nos 2 URL (back et front) toutes les 10 minutes afin de s'assurer qu'ils ne passent pas en veille.

Le site UptimeRobot permet de réaliser ce ping toutes les 10 minutes.