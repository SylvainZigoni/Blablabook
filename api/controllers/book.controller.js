import { Book } from "../models/index.js";
import { StatusCodes } from 'http-status-codes';


const bookController = {

    async getLatestBooks(req,res) {

       try {
        const books = await Book.findAll({
            order: [['id', 'ASC']],
            limit: 3  
        });
            res.status(StatusCodes.OK).json(books)
       }
       catch (error) {
           console.error("Impossible de récupéré les derniers livres :", error)
           res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erreur interne du serveur" })
       }
    }

};


export default bookController;