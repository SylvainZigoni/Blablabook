import {StatusCodes} from 'http-status-codes';
import { sequelize } from '../models/sequelize.client.js';
import { Author } from '../models/index.js';

const adminController = {

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