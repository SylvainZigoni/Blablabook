import jwt from "jsonwebtoken";
import { StatusCodes } from 'http-status-codes';

export function isAuthed(req, res, next) {
 
  const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Vous devez être connecté pour accéder à cette ressource' });
    }  // version okanban

    // if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    // return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Vous devez être connecté pour accéder à cette ressource' });
    // }   ==> Version suggérée par l'ia qui verifie que le header commence bien par "header"

    const accessToken = authorizationHeader.substring("Bearer ".length);
    if (!accessToken) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Vous devez être connecté pour accéder à cette ressource' });
    }

//   const secret = process.env.JWT_SECRET;
//   if (!secret) {
//     console.error('JWT secret not set');
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Configuration serveur incorrecte' });
//   }  // Optionnel: gestion du cas où process.env.JWT_SECRET est absent

    try {
      const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
      
      req.userId = decodedToken.userId; // Très pratique ! 
      req.userRole = decodedToken.role; // Pratique pour le middleware `isAdmin` qui vient juste après

      next();

    } catch (error) {
      console.error(`JWT verification error: ${error.message}`);
      return  res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Vous devez être connecté pour accéder à cette ressource' });
   }
}
