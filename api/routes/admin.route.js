import { Router } from "express";
import adminController from "../controllers/admin.controller.js";
import { isAuthed } from "../middlewares/is-authed.middleware.js";
import { isAdmin } from "../middlewares/is-admin.middleware.js";

const adminRouter = Router();

adminRouter.get('/categories', isAuthed, isAdmin, adminController.getAllCategories);
adminRouter.post('/categories', isAuthed, isAdmin, adminController.createCategory);
adminRouter.delete('/categories', isAuthed, isAdmin, adminController.deleteCategory);
adminRouter.patch('/categories', isAuthed, isAdmin, adminController.updateCategory);


export default adminRouter;