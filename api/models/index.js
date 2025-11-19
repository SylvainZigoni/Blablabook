import Author from "./author.model.js";
import Book from "./book.model.js";
import Category from "./category.model.js";
import User from "./user.model.js";
import Status from "./status.model.js";
import { sequelize } from "./sequelize.client.js";

// Association entre User et Book
User.belongsToMany(Book, {
	through: Status,
	foreignKey: "user_id",
});

Book.belongsToMany(User, {
	through: Status,
	foreignKey: "book_id",
});

// Association entre Author et Book
Author.belongsToMany(Book, {
	through: {
		model: "book_author",
		timestamps: false
	},
	foreignKey: "author_id",
});

Book.belongsToMany(Author, {
	through: {
		model: "book_author",
		timestamps: false
	},
	foreignKey: "book_id",
});

// Association entre Category et Book
Book.belongsToMany(Category, {
	through: {
		model: "book_category",
		timestamps: false
	},
	foreignKey: "book_id",
});

Category.belongsToMany(Book, {
	through: {
		model: "book_category",
		timestamps: false
	},
	foreignKey: "category_id",
});

export { User, Book, Author, Category, Status, sequelize };
