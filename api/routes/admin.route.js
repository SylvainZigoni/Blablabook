import {Router} from "express";
import { isAuthed } from "../middlewares/is-authed.middleware.js";
import { isAdmin } from "../middlewares/is-admin.middleware.js";
import adminController from "../controllers/admin.controller.js"; 

const adminRouter = Router();

adminRouter.post("/authors", isAuthed, isAdmin, adminController.addAuthor);
adminRouter.get("/authors", isAuthed, isAdmin, adminController.getAllAuthors);
adminRouter.delete("/authors/:id", isAuthed, isAdmin, adminController.deleteAuthor);
adminRouter.patch("/authors/:id", isAuthed, isAdmin, adminController.updateAuthor);

export default adminRouter;