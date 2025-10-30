import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.client.js";

class Book extends Model {}

Book.init(
	{
		title: {
			type: DataTypes.STRING,
			unique: false,
			allowNull: false,
		},
		date_parution: {
			type: DataTypes.DATE,
			unique: false,
			allowNull: true,
		},
		image_url: {
			type: DataTypes.STRING,
			unique: false,
			allowNull: true,
		},
		summary: {
			type: DataTypes.STRING,
			unique: false,
			allowNull: true,
		},
	},
	{
		sequelize,
		tableName: "book",
	}
);

export default Book;
