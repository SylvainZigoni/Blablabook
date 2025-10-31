import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.client.js";

class Author extends Model {}

Author.init(
	{
		name: {
			type: DataTypes.STRING,
			unique: false,
			allowNull: false,
		},
		forname: {
			type: DataTypes.STRING,
			unique: false,
			allowNull: true,
		},
	},
	{
		sequelize,
		tableName: "author",
	}
);

export default Author;
