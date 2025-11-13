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
    }
}

export default adminController;