import { Router } from "express";
import { isAuthed } from "../middlewares/is-authed.middleware.js";  
import authController from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post('/add', authController.registerUser);
authRouter.post('/login', authController.loginUser);
//authRouter.get('/profile', isAuthed, authController.getProfile); //   exemple

export default authRouter;