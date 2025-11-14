import "dotenv/config";
import { sequelize } from "../models/sequelize.client.js";

async function enableUnaccent() {
	try {
		console.log("Activation de l'extension unaccent...");

		// Activer l'extension unaccent
		await sequelize.query('CREATE EXTENSION IF NOT EXISTS unaccent;');

		console.log("Extension unaccent activée avec succès !");

		// Tester l'extension
		const [results] = await sequelize.query(
			"SELECT unaccent('Les Misérables') as test;"
		);
		console.log("Test de l'extension :", results[0].test);

		process.exit(0);
	} catch (error) {
		console.error("Erreur lors de l'activation de l'extension :", error.message);
		process.exit(1);
	}
}

enableUnaccent();
