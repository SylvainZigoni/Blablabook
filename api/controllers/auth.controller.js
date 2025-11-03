import Joi from "joi";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { StatusCodes } from 'http-status-codes';
import { User } from "../models/index.js";


const authController = {
  async registerUser(req, res) {
    // Définir un schéma de validation (que l'on peut extraire dans le dossier `api/schemas`)

    const registerUserSchema = Joi.object({
      username: Joi.string().min(2).required(), // - username est une string d'au moins 2 caractères, obligatoire
      password: Joi.string().min(8).regex(/[0-9]/).regex(/[a-z]/).regex(/[A-Z]/).required(), // - password : au moins 8 caractères, 1 chiffre, 1 majuscule, 1 minuscule
      confirm: Joi.string().min(8).regex(/[0-9]/).regex(/[a-z]/).regex(/[A-Z]/).required(),
      email: Joi.string().email().required() // - email : doit être une adresse email valide
    });

    // Valider le body
    const { username, password, confirm, email } = Joi.attempt(req.body, registerUserSchema, 'Données de création utilisateur invalides');

    // Vérifier que le MDP + CONFIRM correspondent, sinon 400 (Bad Request)
    if (password !== confirm) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Le mot de passe et la confirmation doivent correspondre.' });
    }

    // Vérifier si le username n'est pas déjà pris, sinon 409 (Conflict)
    const alreadyExistingUser = await User.findOne({ where: { username } }); 
    if (alreadyExistingUser) {
      return res.status(StatusCodes.CONFLICT).json({ message: "Ce pseudo est déjà utilisé" });
    }
    // Vérfifier si l'email n'est pas déjà pris, sinon 409 (Conflict)
    const alreadyExistingEmail = await User.findOne({ where: { email } }); 
    if (alreadyExistingEmail) {
      return res.status(StatusCodes.CONFLICT).json({ message: "Cet email est déjà utilisé" });
    }

    //  Hacher le mot de passe à l'aide de argon2
    const hashedPassword = await argon2.hash(password);

    // Enregistre l'utilisateur en BDD via le modèle User
    const newUser = await User.create({ username, email, password: hashedPassword }); 

    // Le renvoyer au client (note : si possible sans renvoyer le mot de passe haché par sécurité)

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