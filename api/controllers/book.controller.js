import { Book } from "../models/index.js";

 
const bookController = {

    async getLatestBooks(req,res) {

       try {
        const books = await Book.findAll({
            order: [['id', 'DESC']],
            limit: 3  
        });
            res.json(books)
       }
       catch (error) {
           console.error("Impossible de récupéré les derniers livres :", error)
           res.status(500).json({ error: "Erreur interne du serveur" })
       }
    }

};


export default bookController;