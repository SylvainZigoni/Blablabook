// scripts/cleanImagePaths.js
import { Book } from '../models/index.js'; // adapte le chemin si nécessaire
import sequelize from '../config/database.js'; // adapte selon ton fichier de config

async function cleanImagePaths() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base réussie');

    const books = await Book.findAll();

    for (const book of books) {
      const currentPath = book.image_url;

      if (currentPath.startsWith('api/public/images/')) {
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
