import "dotenv/config";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(process.env.DB_URL, {
	define: {
		freezeTableName: true,
		underscored: true,
	},
	dialectOptions: {
		charset: 'utf8',
	},
});

try {
	await sequelize.authenticate();
	console.log("Connexion a la DB ok");
} catch (error) {
	console.log("Connexion a la BDD non ok", error);
}
