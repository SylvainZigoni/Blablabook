import { Book, Author, Category, User } from "../models/index.js";
import { StatusCodes } from 'http-status-codes';
import { sequelize } from "../models/sequelize.client.js";


const bookController = {


     async getRandomBooks(req, res) {
        try {
            const books = await Book.findAll({
                order: sequelize.random(),
                limit: 3, 
                include : [
                    {
                        model: Author,
                        attributes: ['name', 'forname'],
                        through: { attributes: [] }
                    },
                    {
                        model: Category,
                        attributes: ['name'],
                        through: { attributes: [] }
                    }

                ]
            });
            res.status(StatusCodes.OK).json(books);
        }
        catch (error) {
            console.error("Impossible de récupérer les livres aléatoires :", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erreur interne du serveur" });
        }
    },

    async getAllUserBooks(req,res) {
        try {

            const userId = req.params.userId;
            // récupérer tous les livres de l'utilisateurs qui a un id qui correspond à userId
            // inclure les auteurs, catégories et le statut de chaque livre( via book_user)
            const userBooks = await Book.findAll({
                include: [
                    {
                        model: Author,
                        attributes: ['name', 'forname'],
                        through: { attributes: [] }
                    },
                    {
                        model: Category,
                        attributes: ['name'],
                        through: { attributes: [] }
                    },
                    {
                        model: User,
                        where: { id: userId },
                        attributes: ['id', 'username'],
                        through: {
                            attributes: ['status']
                        }
                    }
                ]
            });
            res.status(StatusCodes.OK).json(userBooks); 
        }
        catch (error) {
            console.error("Impossible de récupérer les livres de l'utilisateur :", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erreur interne du serveur" });
        }
    }
};

export default bookController;