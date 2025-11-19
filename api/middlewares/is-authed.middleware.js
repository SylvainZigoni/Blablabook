import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

export function isAuthed(req, res, next) {
	const authorizationHeader = req.headers.authorization;

	if (!authorizationHeader) {
		return res
			.status(StatusCodes.UNAUTHORIZED)
			.json({
				message:
					"Vous devez être connecté pour accéder à cette ressource",
			});
	}

	// Compte le nombre de caractères dans "Bearer " et le retire au début du token
	const accessToken = authorizationHeader.substring("Bearer ".length);
	if (!accessToken) {
		return res
			.status(StatusCodes.UNAUTHORIZED)
			.json({
				message:
					"Vous devez être connecté pour accéder à cette ressource",
			});
	}

	try {
		const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);

		req.userId = decodedToken.userId; // Permet d'ajouter a req l'Id utilisateur qui pourra ensuite etre repris dans le middleware d'admin et dans les requetes getByAuthor et getByTitle
		req.userRole = decodedToken.isAdmin ? "admin" : "user"; //necessaire pour isAdmin middleware

		next();
	} catch (error) {
		console.error(`JWT verification error: ${error.message}`);
		return res
			.status(StatusCodes.UNAUTHORIZED)
			.json({
				message:
					"Vous devez être connecté pour accéder à cette ressource",
			});
	}
}
