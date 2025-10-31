import Author from "./author.model.js";
import Book from "./book.model.js";
import Category from "./category.model.js";
import User from "./user.model.js";
import Statut from "./statut.model.js";
import { sequelize } from "./sequelize.client.js";

// Association entre User et Book
User.belongsToMany(Book, {
	through: Statut,
	foreignKey: "user_id",
});

Book.belongsToMany(User, {
	through: Statut,
	foreignKey: "book_id",
});

// Association entre Author et Book
Author.belongsToMany(Book, {
	through: "book_author",
	foreignKey: "author_id",
});

Book.belongsToMany(Author, {
	through: "book_author",
	foreignKey: "book_id",
});

// Association entre Category et Book
Book.belongsToMany(Category, {
	through: "book_category",
	foreignKey: "book_id",
});

Category.belongsToMany(Book, {
	through: "book_category",
	foreignKey: "category_id",
});

export { User, Book, Author, Category, sequelize };
