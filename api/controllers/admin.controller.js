import { Book, Author, Category, User, Status } from "../models/index.js";
import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";

const adminController = {

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
        const { name } = req.body;

        if (!name || name.trim() === "") {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Le nom de la catégorie est requis." });
        }

        try {
            const category = await Category.findOne({ where: { name: { [Op.iLike]: name.trim() } } });
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
        const { oldName, newName } = req.body;

        if (!oldName || oldName.trim() === "" || !newName || newName.trim() === "") {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Les noms de catégorie sont requis." });
        }

        try {
            const category = await Category.findOne({ where: { name: { [Op.iLike]: oldName.trim() } } });
            if (!category) {
                return res.status(StatusCodes.NOT_FOUND).json({ message: "Catégorie non trouvée." });
            }

            const existingCategory = await Category.findOne({ where: { name: { [Op.iLike]: newName.trim() } } });
            if (existingCategory) {
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

    async getAllAuthors(req, res) {
        try {
            const authors = await Author.findAll(
                { attributes: ['name', 'forname'] }
            );
            res.status(StatusCodes.OK).json(authors);
        } catch (error) {
            console.error("Error fetching authors:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: "Internal server error",
            });
        }
    },

    async addAuthor(req, res) {
        try {
            const { name, forname } = req.body;
            if (!name || typeof name !== 'string' || name.trim() === '') {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Le champ "name" est requis.' });
        }

            const newAuthor = await Author.create({
                name: name.trim(),
                forname: forname ? forname.trim() : null            
            });

            res.status(StatusCodes.CREATED).json(newAuthor);

        } catch (error) {
            console.error("Error adding author:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: "Internal server error",
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
                return res.status(StatusCodes.NOT_FOUND).json({ error: 'Author not found.' });
            }

            res.status(StatusCodes.NO_CONTENT).send();

        } catch (error) {
            console.error("Error deleting author:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: "Internal server error",
            });
        }
    },

    async updateAuthor(req, res) {
        try {
            const authorId = req.params.id;
            const { name, forname } = req.body;

            const author = await Author.findByPk(authorId);
            if (!author) {
                return res.status(StatusCodes.NOT_FOUND).json({ error: 'Author not found.' });
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
            console.error("Error updating author:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: "Internal server error",
            });
        }
    }
}

export default adminController;