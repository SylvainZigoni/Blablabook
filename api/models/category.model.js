import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.client.js";

class Category extends Model {}

Category.init(
	{
		name: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "category",
	}
);

export default Category;
