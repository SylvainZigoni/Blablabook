import { Book, Author, Category, User, Status } from "../models/index.js";
import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";
import Joi from "joi";

const adminController = {

// Administration des catégories 
    async getAllCategories(req, res) {
        try {

            const categories = await Category.findAll();
           
            res.status(StatusCodes.OK).json({ categories });
        }
        catch (error) {
            console.error("Erreur lors de la récupération des catégories :", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Erreur serveur" });
        }
    },

    async createCategory(req, res) {
        const { name } = req.body;

        if (!name || name.trim() === "") {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Le nom de la catégorie est requis." });
        }

        try {
            const existingCategory = await Category.findOne({ where: { name: { [Op.iLike]: name.trim() } } });
            if (existingCategory) {
                return res.status(StatusCodes.CONFLICT).json({ message: "Une catégorie avec ce nom existe déjà." });
            }

            const newCategory = await Category.create({ name: name.trim() });

            res.status(StatusCodes.CREATED).json({ category: newCategory });
        } catch (error) {
            console.error("Erreur lors de la création de la catégorie :", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Erreur serveur" });
        }
    },

    async deleteCategory(req, res) {
        const { id } = req.params;
        
        try {
            const category = await Category.findOne({ where: { id } });
            if (!category) {
                return res.status(StatusCodes.NOT_FOUND).json({ message: "Catégorie non trouvée." });
            }

            await category.destroy();

            res.status(StatusCodes.OK).json({ message: "Catégorie supprimée avec succès." });
        } catch (error) {
            console.error("Erreur lors de la suppression de la catégorie :", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Erreur serveur" });
        }
    },

    async updateCategory(req, res) {
    const { id } = req.params;
    const { oldName, newName } = req.body;

    if (!oldName || oldName.trim() === "" || !newName || newName.trim() === "") {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Les noms de catégorie sont requis." });
    }

    try {
        const category = await Category.findOne({ where: { id } });
        if (!category) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Catégorie non trouvée." });
        }

        // Vérifier si une autre catégorie avec le nouveau nom existe déjà
        const existingCategory = await Category.findOne({ 
            where: { 
                name: newName.trim() 
            } 
        });

        // Vérifier que ce n'est pas la même catégorie
        if (existingCategory && existingCategory.id !== parseInt(id)) {
            return res.status(StatusCodes.CONFLICT).json({ message: "Une catégorie avec ce nom existe déjà." });
        }

        category.name = newName.trim();
        await category.save();

        res.status(StatusCodes.OK).json({ category });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la catégorie :", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Erreur serveur" });
    }
},

// Administration des auteurs
    async getAllAuthors(req, res) {
        try {
            const authors = await Author.findAll(
                { attributes: ['name', 'forname'] }
            );
            res.status(StatusCodes.OK).json(authors);
        } catch (error) {
            console.error("Erreur lors de la récupération des auteurs :", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Erreur serveur",
            });
        }
    },

    async addAuthor(req, res) {
        try {
            const { name, forname } = req.body;
            if (!name || typeof name !== 'string' || name.trim() === '') {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Le champ "name" est requis.' });
        }

            const newAuthor = await Author.create({
                name: name.trim(),
                forname: forname ? forname.trim() : null            
            });

            res.status(StatusCodes.CREATED).json(newAuthor);

        } catch (error) {
            console.error("Erreur lors de l'ajout de l'auteur :", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Erreur serveur",
            });
        }
    },

    async deleteAuthor(req, res) {
        try {
            const authorId = req.params.id;
            const deletedAuthor = await Author.destroy({
                where: { id: authorId }
            });

            if (deletedAuthor === 0) {
                return res.status(StatusCodes.NOT_FOUND).json({ message: 'Auteur non trouvé.' });
            }

            res.status(StatusCodes.NO_CONTENT).send();

        } catch (error) {
            console.error("Erreur lors de la suppression de l'auteur :", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Erreur serveur",
            });
        }
    },

    async updateAuthor(req, res) {
        try {
            const authorId = req.params.id;
            const { name, forname } = req.body;

            const author = await Author.findByPk(authorId);
            if (!author) {
                return res.status(StatusCodes.NOT_FOUND).json({ message: 'Auteur non trouvé.' });
            }

            if (name && typeof name === 'string' && name.trim() !== '') {
                author.name = name.trim();
            }
            if (forname && typeof forname === 'string') {
                author.forname = forname.trim();
            }

            await author.save();

            res.status(StatusCodes.OK).json(author);

        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'auteur :", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Erreur serveur",
            });
        }
    },

// Administration des utilisateurs
     async getAllUsers(req, res) {
        try {
            const users = await User.findAll({
                attributes: ['id', 'username', 'email', 'is_admin']
            });
            res.status(StatusCodes.OK).json(users);
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs :", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Erreur serveur",
            });
        }
    },

    async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            const deletedUser = await User.destroy({
                where: { id: userId }
            });

            if (deletedUser === 0) {
                return res.status(StatusCodes.NOT_FOUND).json({ message: 'Utilisateur non trouvé.' });
            }

            res.status(StatusCodes.NO_CONTENT).json({ message: 'Utilisateur supprimé avec succès.' });

        } catch (error) {
            console.error("Erreur lors de la suppression de l'utilisateur :", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Erreur serveur",
            });
        }
    },      

    async updateUser(req, res) {
        try {
            const userId = req.params.id;
            const { username, email, is_admin } = req.body;

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(StatusCodes.NOT_FOUND).json({ message: 'Utilisateur non trouvé.' });
            }

            if (username && typeof username === 'string' && username.trim() !== '') {
                user.username = username.trim();
            }
            if (email && typeof email === 'string' && email.trim() !== '') {
                user.email = email.trim();
            }
            if (typeof is_admin === 'boolean') {
                user.is_admin = is_admin;
            }

            await user.save();

            res.status(StatusCodes.OK).json(user);

        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Erreur serveur",
            });
        }
    },
    
    async getUserById(req, res) {           
        const userId = req.params.id;   
        try {
            const user =  await User.findByPk(userId, {
                attributes: ['id', 'username', 'email', 'is_admin']
            });
            if (!user) {
                return res.status(StatusCodes.NOT_FOUND).json({ message: 'Utilisateur non trouvé.' });
            }
            res.status(StatusCodes.OK).json(user);
        } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur :", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Erreur serveur",
            });
        }
    },

// Administration des livres 
    async getAllBooks(req, res) {
        try {
            const books = await Book.findAll({
                include: [
                    { model: Author, attributes: ['name', 'forname'] },
                    { model: Category, attributes: ['name'] }
                ]
            });

            res.status(StatusCodes.OK).json(books);
        } catch (error) {
            console.error("Erreur lors de la récupérations des livres", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: "Erreur serveur",
            });
        }
    },

    async getBookById(req, res) {
        try {
            const bookId = req.params.id;
            const book = await Book.findByPk(bookId, {
                include: [
                    { model: Author, attributes: ['name', 'forname'] },
                    { model: Category, attributes: ['name'] }
                ]
            });

            if (!book) {
                return res.status(StatusCodes.NOT_FOUND).json({ error: "Livre non trouvé" });
            }

            res.status(StatusCodes.OK).json(book);
        } catch (error) {
            console.error("Erreur lors de la récupération du livre :", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: "Erreur serveur",
            });
        }
    },

    async deleteBook(req, res) {
    try {
        const bookId = req.params.id;
        const deletedBook = await Book.destroy({ where: { id: bookId } });
        
        if (!deletedBook) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Livre non trouvé.' });
        }

        res.status(StatusCodes.OK).json({ message: 'Livre supprimé avec succès.' });

    } catch (error) {
        console.error("Erreur lors de la suppression du livre :", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erreur serveur" });
    }
    },

    async updateBook(req, res) {

    // L'admin se trouve sur la page de modification d'un livre.
    // Il peut modifier le titre, le résumé, la date de publication et l'image de couverture
    // Il ne peut pas modifier les auteurs et les catégories dans un soucis de cohérence. Si besoin, il peut supprimer le livre et le recréer.

    // Schéma de validation Joi

        const updateBookSchema = Joi.object({
            title: Joi.string().trim().min(1).max(255)
                .messages({
                    'string.empty': 'Le titre ne peut pas être vide.',
                    'string.min': 'Le titre ne peut pas être vide.',
                    'string.max': 'Le titre ne peut pas dépasser 255 caractères.'
                }),
            summary: Joi.string().trim().allow('', null),
            date_parution: Joi.date().max('now')
                .messages({
                    'date.max': 'La date de parution ne peut pas être dans le futur.'
                }),
            image_url: Joi.string().trim().allow('', null)
        });

        // Logique de mise à jour du livre

        try {
            // Récupérer l'ID du livre à partir des paramètres de la requête
            const bookId = req.params.id;

            // Validation des données avec Joi
            const { error, value } = updateBookSchema.validate(req.body, {
                abortEarly: false,
                stripUnknown: true
            });

            // Gérer les erreurs de validation - Renvoye un objet propre avec les messages d'erreur

            if (error) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: error.details.map(detail => detail.message)
                });
            }

            // Vérifier que le livre existe
            const book = await Book.findByPk(bookId);
            if (!book) {
                return res.status(StatusCodes.NOT_FOUND).json({ error: 'Livre non trouvé.' });
            }

            // Mise à jour des champs validés
            if (value.title !== undefined) {
                book.title = value.title;
            }
            if (value.summary !== undefined) {
                book.summary = value.summary || null;
            }
            if (value.date_parution !== undefined) {
                book.date_parution = value.date_parution;
            }
            if (value.image_url !== undefined) {
                book.image_url = value.image_url || null;
            }

            // Sauvegarde des modifications
            await book.save();

            // Retourne le livre modifié
            res.status(StatusCodes.OK).json(book);

            // Gestion d'erreurs assez complète pour identifier les potentiels problèmes lors des tests.
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: error.errors.map(e => e.message)
                });
            }
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(StatusCodes.CONFLICT).json({
                    error: 'Un livre avec ces informations existe déjà.'
                });
            }
            if (error.name === 'SequelizeDatabaseError') {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: 'Données invalides.'
                });
            }
            console.error("Erreur lors de la mise à jour du livre :", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erreur serveur" });
        }
    },

    async createBook(req, res) {

        // L'admin peut créer un nouveau livre en fournissant le titre, le résumé, la date de publication, l'image de couverture, l'auteur et la catégorie.
        // Un livre doit obligatoirement avoir un titre
        // Les autres informations peuvent être rajoutées par la suite via la modification du livre.

        // Schéma de validation Joi
        const createBookSchema = Joi.object({
            title: Joi.string().trim().min(1).max(255).required()
                .messages({
                    'string.empty': 'Le champ "title" est requis.',
                    'string.min': 'Le titre ne peut pas être vide.',
                    'string.max': 'Le titre ne peut pas dépasser 255 caractères.',
                    'any.required': 'Le champ "title" est requis.'
                }),
            summary: Joi.string().trim().allow('', null),
            date_parution: Joi.date().max('now').allow(null)
                .messages({
                    'date.max': 'La date de parution ne peut pas être dans le futur.'
                }),
            image_url: Joi.string().trim().uri().allow('', null)
                .messages({
                    'string.uri': `L'URL de l'image doit être valide.`
                }),
            authorId: Joi.number().integer().positive().allow(null)
                .messages({
                    'number.base': `L'ID de l'auteur doit être un nombre.`,
                    'number.integer': `L'ID de l'auteur doit être un entier.`,
                    'number.positive': `L'ID de l'auteur doit être positif.`
                }),
            categoryId: Joi.number().integer().positive().allow(null)
                .messages({
                    'number.base': `L'ID de la catégorie doit être un nombre.`,
                    'number.integer': `L'ID de la catégorie doit être un entier.`,
                    'number.positive': `L'ID de la catégorie doit être positif.`
                })
        });

        try {
            // Validation des données avec Joi
            const { error, value } = createBookSchema.validate(req.body, {
                abortEarly: false,
                stripUnknown: true
            });

            // Gérer les erreurs de validation
            if (error) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: error.details.map(detail => detail.message)
                });
            }

            // Créer le livre avec les champs de base uniquement
            const newBook = await Book.create({
                title: value.title,
                summary: value.summary || null,
                date_parution: value.date_parution || null,
                image_url: value.image_url || null
            });

            // Ajouter l'association avec l'auteur si fourni
            if (value.authorId) {
                const author = await Author.findByPk(value.authorId);
                if (!author) {
                    return res.status(StatusCodes.NOT_FOUND).json({
                        error: `L'auteur avec l'ID ${value.authorId} n'existe pas.`
                    });
                }
                await newBook.addAuthor(author);
            }

            // Ajouter l'association avec la catégorie si fournie
            if (value.categoryId) {
                const category = await Category.findByPk(value.categoryId);
                if (!category) {
                    return res.status(StatusCodes.NOT_FOUND).json({
                        error: `La catégorie avec l'ID ${value.categoryId} n'existe pas.`
                    });
                }
                await newBook.addCategory(category);
            }

            // Recharger le livre avec ses associations pour le retourner
            const bookWithAssociations = await Book.findByPk(newBook.id, {
                include: [
                    { model: Author, through: { attributes: [] } },
                    { model: Category, through: { attributes: [] } }
                ]
            });

            res.status(StatusCodes.CREATED).json(bookWithAssociations);

        } catch (error) {
            console.error("Erreur lors de la création du livre :", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Erreur serveur",
            });
        }
    },
};

export default adminController;