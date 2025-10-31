import "dotenv/config";
import { sequelize } from "sequelize";

export const sequelize = new sequelize(process.env.DB_URL, {
	define: {
		freezeTableName: true,
		underscored: true,
	},
});

try {
	await sequelize.authenticate();
	console.log("Connexion a la DB ok");
} catch (error) {
	console.log("Connexion a la BDD non ok", error);
}
