import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.client.js";

class User extends Model {}

User.init(
	{
		username: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		email: {
			type: DataTypes.CITEXT,
			unique: true,
			allowNull: false,
		},
		password: {
			type: DataTypes.TEXT,
			unique: false,
			allowNull: false,
		},
		is_admin: {
			type: DataTypes.BOOLEAN,
			unique: false,
			defaultValue: false,
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "user",
	}
);

export default User;
