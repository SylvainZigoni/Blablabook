import Joi from "joi";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/index.js";

const authController = {
	// - AJOUT D'UN UTILISATEUR
	async registerUser(req, res) {
		// Mise en place du schéma de données JOI attendu
		const registerUserSchema = Joi.object({
			username: Joi.string().min(2).required().messages({
				"string.min":
					"Le nom d'utilisateur doit contenir au moins 2 caractères",
			}),
			password: Joi.string()
				.min(8)
				.regex(/[0-9]/)
				.regex(/[a-z]/)
				.regex(/[A-Z]/)
				.required()
				.messages({
					"string.min":
						"Le mot de passe doit contenir au moins 8 caractères",
					"string.pattern.base":
						"Le mot de passe doit contenir au moins 1 chiffre, 1 majuscule et 1 minuscule",
				}),
			email: Joi.string().email().required(),
		});

		// On confronte les données au schéma et on regarde si ca fonctionne
		try {
			const { username, password, email } = Joi.attempt(
				req.body,
				registerUserSchema
			);

			const alreadyExistingUser = await User.findOne({
				where: { username },
			});
			if (alreadyExistingUser) {
				return res
					.status(StatusCodes.CONFLICT)
					.json({ message: "Ce pseudo est déjà utilisé" });
			}

			const alreadyExistingEmail = await User.findOne({
				where: { email },
			});
			if (alreadyExistingEmail) {
				return res
					.status(StatusCodes.CONFLICT)
					.json({ message: "Cet email est déjà utilisé" });
			}

			// On hash le password recu par l'utilisateur pour le stocker en BBD afin qu'il soit protegé si la BDD leak
			const hashedPassword = await argon2.hash(password);

			// On créé un nouvel utilisateur via la class User que l'on définie dans le model de données
			const newUser = await User.create({
				username,
				email,
				password: hashedPassword,
			});

			res.status(StatusCodes.CREATED).json({
				id: newUser.id,
				username: newUser.username,
				email: newUser.email,
				created_at: newUser.created_at,
				updated_at: newUser.updated_at,
			});
		} catch (error) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: error.message });
		}
	},

	// - LOGIN D'UN UTILISATEUR
	async loginUser(req, res) {
		// On récupère du body du POST front les infos utilisateur
		try {
			const { username, password } = req.body;

			// Vérification que l'utilisateur est dans la base
			const user = await User.findOne({ where: { username } });
			if (!user) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json("Le pseudo et le mot de passe ne correspondent pas");
			}

			// Vérification du mot de passe de l'utilisateur
			const isMatching = await argon2.verify(user.password, password);
			if (!isMatching) {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json("Le pseudo et le mot de passe ne correspondent pas");
			}

			// Création du token JWT grace à la method sign de jwt.
			// On ne passe pas les données sensibles dans le token car tous le monde est en capacité de le décoder et donc récupérer les éléments du payload
			const token = jwt.sign(
				{
					userId: user.id,
					username: user.username,
					isAdmin: user.is_admin,
				}, // Payload = charge utile
				process.env.JWT_SECRET, // Signature
				{ expiresIn: "1h" }
			);

			// Objet renvoyé dans à la fin si succes
			return res.status(StatusCodes.OK).json({
				token,
				user: {
					id: user.id,
					username: user.username,
					is_admin: user.is_admin,
				},
			});

			// Objet renvoyé si non succès
		} catch (error) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: error.message });
		}
	},
};

export default authController;
