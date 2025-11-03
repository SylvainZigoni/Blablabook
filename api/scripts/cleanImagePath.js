// scripts/cleanImagePaths.js
import  Book  from '../models/book.model.js'; // adapte le chemin si nécessaire
import { sequelize } from '../models/sequelize.client.js';

/**
 * Fonction qui modifie le champs image_url de la table book
 * on a seed avec chemin complet il ne faut garder que le nom du fichier
 * 
 */
async function cleanImagePaths() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base réussie');

    const books = await Book.findAll();

    for (const book of books) {
      const currentPath = book.image_url;

      if (currentPath.startsWith('api/public/images/')) {
        // remplace 'api/public/images/' par rien
        // on ne garde que le nom du fichier
        const newPath = currentPath.replace('api/public/images/', '');
        await book.update({ image_url: newPath });
        console.log(`🔄 ${book.title} → ${newPath}`);
      }
    }

    console.log('✅ Tous les chemins ont été nettoyés');
  } catch (error) {
    console.error('❌ Erreur :', error);
  } finally {
    await sequelize.close();
  }
}

cleanImagePaths();