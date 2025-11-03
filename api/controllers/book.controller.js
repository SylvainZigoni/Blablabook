import { Book, Author, Category } from "../models/index.js";
import { StatusCodes } from 'http-status-codes';
import { sequelize } from "../models/sequelize.client.js";


const bookController = {

     async getRandomBooks(req, res) {
        try {
            const books = await Book.findAll({
                order: sequelize.random(),
                limit: 3, 
                include: [
                    { 
                        model: Author, 
                        attributes: ['name', 'forname']
                    },
                    {
                        model: Category,
                        attributes: ['name']
                        
                    }
                ]

            });
            res.status(StatusCodes.OK).json(books);
        }
        catch (error) {
            console.error("Impossible de récupérer les livres aléatoires :", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erreur interne du serveur" });
        }
    }
};

export default bookController;