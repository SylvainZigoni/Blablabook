import { Router } from "express";
import adminController from "../controllers/admin.controller.js";
import { isAuthed } from "../middlewares/is-authed.middleware.js";
import { isAdmin } from "../middlewares/is-admin.middleware.js";

const adminRouter = Router();

adminRouter.get('/categories', isAuthed, isAdmin, adminController.getAllCategories);
adminRouter.post('/categories', isAuthed, isAdmin, adminController.createCategory);
adminRouter.delete('/categories/:id', isAuthed, isAdmin, adminController.deleteCategory);
adminRouter.patch('/categories/:id', isAuthed, isAdmin, adminController.updateCategory);

adminRouter.get("/authors", isAuthed, isAdmin, adminController.getAllAuthors);
adminRouter.post("/authors", isAuthed, isAdmin, adminController.addAuthor);
adminRouter.delete("/authors/:id", isAuthed, isAdmin, adminController.deleteAuthor);
adminRouter.patch("/authors/:id", isAuthed, isAdmin, adminController.updateAuthor);

adminRouter.get("/users", isAuthed, isAdmin, adminController.getAllUsers);
adminRouter.get("/users/:id", isAuthed, isAdmin, adminController.getUserById);
adminRouter.patch("/users/:id", isAuthed, isAdmin, adminController.updateUser);
adminRouter.delete("/users/:id", isAuthed, isAdmin, adminController.deleteUser);

adminRouter.get('/books', isAuthed, isAdmin, adminController.getAllBooks);
adminRouter.post('/books', isAuthed, isAdmin, adminController.addBook);
adminRouter.delete('/books/:id', isAuthed, isAdmin, adminController.deleteBook);
adminRouter.patch('/books/:id', isAuthed, isAdmin, adminController.updateBook); 

export default adminRouter;