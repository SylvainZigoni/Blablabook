import { Router } from "express";
import authController from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post('/add', authController.registerUser);

export default authRouter;