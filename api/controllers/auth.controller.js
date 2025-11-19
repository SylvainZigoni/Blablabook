import Joi from "joi";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/index.js";

const authController = {

  async registerUser(req, res) {

    const registerUserSchema = Joi.object({
      username: Joi.string().min(2).required()
        .messages({
          'string.min': 'Le nom d\'utilisateur doit contenir au moins 2 caractères',
        }),
      password: Joi.string().min(8).regex(/[0-9]/).regex(/[a-z]/).regex(/[A-Z]/).required()
        .messages({
          'string.min': 'Le mot de passe doit contenir au moins 8 caractères',
          'string.pattern.base': 'Le mot de passe doit contenir au moins 1 chiffre, 1 majuscule et 1 minuscule',
        }),
      email: Joi.string().email().required()
    });

    try {
      const { username, password, email } = Joi.attempt(req.body, registerUserSchema);

      const alreadyExistingUser = await User.findOne({ where: { username } });
      if (alreadyExistingUser) {
        return res.status(StatusCodes.CONFLICT).json({ message: "Ce pseudo est déjà utilisé" });
      }

      const alreadyExistingEmail = await User.findOne({ where: { email } });
      if (alreadyExistingEmail) {
        return res.status(StatusCodes.CONFLICT).json({ message: "Cet email est déjà utilisé" });
      }

      const hashedPassword = await argon2.hash(password);

      const newUser = await User.create({ username, email, password: hashedPassword });

      res.status(StatusCodes.CREATED).json({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at
      });

    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  },

  async loginUser(req,res) {

    try {
      
      const { username, password } = req.body;

      const user = await User.findOne({ where: { username }}); 
      
      if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json("Le pseudo et le mot de passe ne correspondent pas");
      }

      const isMatching = await argon2.verify(user.password, password);
      if (! isMatching) {
        return res.status(StatusCodes.UNAUTHORIZED).json("Le pseudo et le mot de passe ne correspondent pas");
      }

      const token = jwt.sign(
        { userId: user.id, username: user.username, isAdmin: user.is_admin }, // Payload = charge utile
        process.env.JWT_SECRET, // Signature
        { expiresIn: "1h" }
      );

      return res.status(StatusCodes.OK).json({
        token,
        user: {
          id: user.id,
          username: user.username,
          is_admin: user.is_admin
        }
      });

    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }
};

export default authController;
