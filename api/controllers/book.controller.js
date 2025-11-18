import { Book, Author, Category, User, Status } from "../models/index.js";
import { StatusCodes } from "http-status-codes";
import { sequelize } from "../models/sequelize.client.js";
import { Op } from "sequelize";

const bookController = {
	async getRandomBooks(req, res) {
		try {
			const books = await Book.findAll({
				order: sequelize.random(),
				limit: 3,
				include: [
					{
						model: Author,
						attributes: ["name", "forname"],
						through: { attributes: [] }, // On spécifie que l'on veut renvoyer que les attributs définis juste avant
					},
					{
						model: Category,
						attributes: ["name"],
						through: { attributes: [] },
					},
				],
			});

			res.status(StatusCodes.OK).json(books);
		} catch (error) {
			console.error(
				"Impossible de récupérer les livres aléatoires :",
				error
			);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				error: "Erreur interne du serveur",
			});
		}
	},

	async getBookById(req, res) {
		try {
			const { bookId, userId } = req.params;

			const book = await Book.findOne({
				where: { id: bookId },
				include: [
					{
						model: Author,
						attributes: ["name", "forname"],
						through: { attributes: [] },
					},
					{
						model: Category,
						attributes: ["name"],
						through: { attributes: [] },
					},
					{
						model: User,
						// Je veux renvoyer uniquement le statut du livre pour cet utilisateur
						where: { id: userId },
						attributes: ["id", "username"],
						through: {
							attributes: ["status"],
							as: "Status", // Utilisation d'un alias pour forcer le format de l'objet renvoyé par sequelize, pour faciliter le traitement coté front
						},
						required: false, // Pour inclure le livre même si l'utilisateur ne l'a pas
					},
				],
			});

			if (!book) {
				return res.status(StatusCodes.NOT_FOUND).json({
					error: "Livre non trouvé",
				});
			}

			res.status(StatusCodes.OK).json(book);
		} catch (error) {
			console.error("Impossible de récupérer le livre :", error);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				error: "Erreur interne du serveur",
			});
		}
	},

	async getAllUserBooks(req, res) {
		try {
			const userId = req.params.userId;
			// récupérer tous les livres de l'utilisateurs qui a un id qui correspond à userId
			// inclure les auteurs, catégories et le statut de chaque livre( via book_user)
			const userBooks = await Book.findAll({
				include: [
					{
						model: Author,
						attributes: ["name", "forname"],
						through: { attributes: [] },
					},
					{
						model: Category,
						attributes: ["name"],
						through: { attributes: [] },
					},
					{
						model: User,
						where: { id: userId },
						attributes: ["id", "username"],
						through: {
							attributes: ["status"],
							as: "Status",
						},
					},
				],
			});

			res.status(StatusCodes.OK).json(userBooks);
		} catch (error) {
			console.error(
				"Impossible de récupérer les livres de l'utilisateur :",
				error
			);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				error: "Erreur interne du serveur",
			});
		}
	},

	async deleteUserBook(req, res) {
		try {
			const { userId, bookId } = req.params;

			await Status.destroy({
				where: {
					user_id: userId,
					book_id: bookId,
				},
			});

			res.status(StatusCodes.OK).json({
				message: "Livre supprimé de la bibliothèque de l'utilisateur.",
			});
		} catch (error) {
			console.error(
				"Impossible de supprimer le livre de l'utilisateur :",
				error
			);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				error: "Erreur interne du serveur",
			});
		}
	},

	async addUserBook(req, res) {
		try {
			const { userId, bookId } = req.params;

			await Status.create({
				user_id: userId,
				book_id: bookId,
				status: "à lire", // Statut par défaut
			});

			res.status(StatusCodes.CREATED).json({
				message: "Livre ajouté à la bibliothèque de l'utilisateur.",
			});
		} catch (error) {
			console.error(
				"Impossible d'ajouter le livre à la bibliothèque de l'utilisateur :",
				error
			);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				error: "Erreur interne du serveur",
			});
		}
	},

	async updateUserBook(req, res) {
		try {
			// Lorsque l'utilisateur va séléctionner le statut d'un livre je veux récupérer l'id du l'utilisateur, l'id du livre et le statut qu'il a choisit
			const { userId, bookId } = req.params; // userId et bookId sont envoyé via l'url du endpoint
			const { status } = req.body; // Le statut est recu par le body de la requete

			await Status.update(
				{ status: status },
				{
					where: {
						user_id: userId,
						book_id: bookId,
					},
				}
			);

			res.status(StatusCodes.OK).json({
				message: "Statut du livre de l'utilisateur mis à jour.",
			});
		} catch (error) {
			console.error(
				"Impossible de mettre à jour le statut du livre de l'utilisateur :",
				error
			);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				error: "Erreur interne du serveur",
			});
		}
	},

	async getBooksByTitle(req, res) {
		try {
			const { titleSearched } = req.params;
			const userId = req.userId; // Récupéré depuis le middleware d'authentification car non envoyé dans le body (un requete GET n'envoie ne peut pas envoyer de données dans le body)

			// Rechercher les livres avec associations (insensible aux accents grâce à unaccent)
			const books = await Book.findAll({
				where: sequelize.where(
					// Création d'une fonction avec sequelize que s'appellera "unaccent" et que s'effectuera sur la colonne titre
					sequelize.fn("unaccent", sequelize.col("title")),
					{
						// Recherche via la fonction de titleSearched
						[Op.iLike]: sequelize.fn(
							"unaccent",
							`%${titleSearched}%`
						),
					}
				),
				include: [
					{
						model: Author,
						attributes: ["name", "forname"],
						through: { attributes: [], as: "Authors" },
					},

					{
						model: Category,
						attributes: ["name"],
						through: { attributes: [], as: "Categories" },
					},
					{
						model: User,
						where: { id: userId },
						attributes: ["id", "username"],
						through: {
							attributes: ["status"],
							as: "Status",
						},

						// required est spécifique a sequelize. Ca correspond ici a un left join, pour s'assurer que l'on inclue les lignes qui n'ont pas de statut
						required: false,
					},
				],
			});

			// Envoyer la réponse si ok
			res.status(StatusCodes.OK).json(books);
		} catch (error) {
			console.error("Erreur lors de la recherche de livres :", error);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				error: "Erreur interne du serveur",
			});
		}
	},

	async getBooksByAuthor(req, res) {
		try {
			const { authorSearched } = req.params;
			const userId = req.userId;

			const books = await Book.findAll({
				include: [
					{
						model: Author,
						where: {
							[Op.or]: [
								sequelize.where(
									sequelize.fn(
										"unaccent",
										sequelize.col("name")
									),
									{
										[Op.iLike]: sequelize.fn(
											"unaccent",
											`%${authorSearched}%`
										),
									}
								),
								sequelize.where(
									sequelize.fn(
										"unaccent",
										sequelize.col("forname")
									),
									{
										[Op.iLike]: sequelize.fn(
											"unaccent",
											`%${authorSearched}%`
										),
									}
								),
							],
						},
						attributes: ["name", "forname"],
						through: { attributes: [] },
					},
					{
						model: Category,
						attributes: ["name"],
						through: { attributes: [] },
					},
					{
						model: User,
						where: { id: userId },
						attributes: ["id", "username"],
						through: {
							attributes: ["status"],
							as: "Status",
						},

						required: false,
					},
				],
			});

			res.status(StatusCodes.OK).json(books);
		} catch (error) {
			console.error(
				"Erreur lors de la recherche de livres par auteur :",
				error
			);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				error: "Erreur interne du serveur",
			});
		}
	},
};

export default bookController;
