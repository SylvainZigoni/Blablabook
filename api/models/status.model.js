import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.client.js";

class Status extends Model {}

Status.init(
	{
		status: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		book_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "user_book",
	}
);

export default Status;
