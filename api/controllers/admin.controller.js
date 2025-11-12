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
    }
};


export default adminController;