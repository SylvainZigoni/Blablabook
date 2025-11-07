import { Book, Author, Category, User, Status } from "../models/index.js";
import { StatusCodes } from 'http-status-codes';
import { sequelize } from "../models/sequelize.client.js";
import { Op } from "sequelize";


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
                            attributes: ['status'],
                            as: 'Status'
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
    },

    async deleteUserBook (req, res) {
        try {
            const { userId, bookId } = req.params;

            await Status.destroy({
                where: {
                    user_id: userId,
                    book_id: bookId
                }
            });

            res.status(StatusCodes.OK).json({ message: "Livre supprimé de la bibliothèque de l'utilisateur." });
        }
        catch (error) {
            console.error("Impossible de supprimer le livre de l'utilisateur :", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erreur interne du serveur" });
        }

    },

    async addUserBook (req, res) {
        try {
            const { userId, bookId } = req.params;
            
            await Status.create({
                user_id: userId,
                book_id: bookId,
                status: 'à lire' // Statut par défaut
            });

            res.status(StatusCodes.CREATED).json({ message: "Livre ajouté à la bibliothèque de l'utilisateur." });
        }
        catch (error) {
            console.error("Impossible d'ajouter le livre à la bibliothèque de l'utilisateur :", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erreur interne du serveur" });
        }
    },

    async getBooksByTitle(req, res) {
        try {
            const { titleSearched } = req.params;
            const userId = req.userId; // Récupéré depuis le middleware d'authentification
            
            // Rechercher les livres avec associations
            const books = await Book.findAll({
                where: {
                    title: {
                        [Op.iLike]: `%${titleSearched}%` // Recherche partielle
                    }
                },
                include: [
                    // Ce que ça fait : Récupère les auteurs de chaque livre via la table de liaison (many-to-many). 
                    // Le through: { attributes: [] } signifie "ne ramène pas les colonnes de la table intermédiaire".
                    {
                        model: Author,
                        attributes: ['name', 'forname'],    
                        through: { attributes: [] } // Ne pas inclure la table de liaison
                    },
                    {
                        model: Category,
                        attributes: ['name'],
                        through: { attributes: [] }
                    },
                    {
                        model: User,
                        through: { 
                            attributes: ['status']
                        },
                        where: { id: userId },
                        required: false // LEFT JOIN pour avoir tous les livres même sans statut
                        // Vérifie si l'utilisateur connecté (userId) possède ce livre dans sa bibliothèque
                        // Si oui, ramène le statut (lu, à lire, en cours...)
                        // required: false = même si l'utilisateur ne possède PAS le livre, 
                        // on ramène quand même le livre (avec users vide)
                    }
                ]
            });

            // Formatter la réponse
            const formattedBooks = books.map(book => {
                const bookData = book.toJSON();
                
                // Extraire le statut de l'utilisateur
                let userStatus = 'absent';  // Par défaut = l'utilisateur ne possède pas le livre
                if (bookData.Users && bookData.Users.length > 0) {
                    // Si Users n'est pas vide = l'utilisateur possède le livre
                    const userBookRelation = bookData.Users[0].book_user;
                    if (userBookRelation && userBookRelation.status) {
                        userStatus = userBookRelation.status; // ou le nom du statut si vous le joignez
                    }
                }
                
                // Restructurer l'objet
                return {
                    id: bookData.id,
                    title: bookData.title,
                    isbn: bookData.isbn,
                    summary: bookData.summary,
                    image: bookData.image,
                    authors: bookData.Authors,    
                    categories: bookData.Categories, 
                    userStatus: userStatus  // ← Le statut simplifié !
                    // On ne retourne PAS users
                };
            });

            // Envoyer la réponse
            res.status(StatusCodes.OK).json(formattedBooks);

        } catch (error) {
            console.error("Erreur lors de la recherche de livres :", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erreur interne du serveur" });
        }
    },

    async getBooksByAuthor (req, res) {
        try {
            const { authorSearched } = req.params;
            const userId = req.userId;
            
            const books = await Book.findAll({
                include: [
                    {
                        model: Author,
                        where: {
                            [Op.or]: [
                                { name: { [Op.ilike]: `%${authorSearched}%` } },
                                { forname: { [Op.ilike]: `%${authorSearched}%` } }
                            ]
                        },
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
                        through: { 
                            attributes: ['status']
                        },
                        where: { id: userId },
                        required: false
                    }
                ]
            });

            const formattedBooks = books.map(book => {
                // 1. Convertir le livre Sequelize en objet JavaScript simple
                const bookData = book.toJSON();
                
                // 2. Déterminer le statut de l'utilisateur pour ce livre
                let userStatus = 'absent'; // Par défaut, l'utilisateur ne possède pas le livre
                
                // Vérifier si l'utilisateur possède ce livre
                if (bookData.Users && bookData.Users.length > 0) {
                    // L'utilisateur possède le livre, récupérer son statut
                    const userBookRelation = bookData.Users[0].book_user;
                    if (userBookRelation && userBookRelation.status) {
                        userStatus = userBookRelation.status;
                    }
                }
                
                // 3. Construire l'objet de réponse simplifié
                return {
                    id: bookData.id,
                    title: bookData.title,
                    isbn: bookData.isbn,
                    summary: bookData.summary,
                    image: bookData.image,
                    authors: bookData.Authors,    
                    categories: bookData.Categories, 
                    userStatus: userStatus  // Le statut simplifié (absent, 1, 2, 3...)
                };
            });

            res.status(StatusCodes.OK).json(formattedBooks);

        } catch (error) {
            console.error("Erreur lors de la recherche de livres par auteur :", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
                error: "Erreur interne du serveur" 
            });
        }
    },

};

export default bookController;