import User from "../models/user.model.js";
import { StatusCodes } from 'http-status-codes';

export async function isAdmin(req, res, next) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Authentification requise" });
    }

    // Récupération du rôle de l'utilisateur depuis la base de données
    const user = await User.findByPk(userId, {
      attributes: ["is_admin"]
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Utilisateur non trouvé" });
    }

    if (user.is_admin === true) {
      next();
    } else {
      res.status(StatusCodes.FORBIDDEN).json({ message: "Accès refusé" });
    }
  } catch (error) {
    console.error("Erreur administrateur:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Erreur serveur" });
  }
}
