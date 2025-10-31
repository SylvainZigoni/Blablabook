import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.client.js";

class Statut extends Model {}

Statut.init(
	{
		statut: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "user_book",
	}
);

export default Statut;
