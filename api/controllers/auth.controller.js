import Joi from "joi";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { StatusCodes } from 'http-status-codes';
import { User } from "../models/index.js";


const authController = {
  async registerUser(req, res) {
    
    const registerUserSchema = Joi.object({
      username: Joi.string().min(2).required(), 
      password: Joi.string().min(8).regex(/[0-9]/).regex(/[a-z]/).regex(/[A-Z]/).required(), // - password : au moins 8 caractères, 1 chiffre, 1 majuscule, 1 minuscule
      confirm: Joi.string().min(8).regex(/[0-9]/).regex(/[a-z]/).regex(/[A-Z]/).required(),
      email: Joi.string().email().required() 
    });

    const { username, password, confirm, email } = Joi.attempt(req.body, registerUserSchema, 'Données de création utilisateur invalides');

    if (password !== confirm) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Le mot de passe et la confirmation doivent correspondre.' });
    }

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
  }
};

export default authController;