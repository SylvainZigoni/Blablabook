import { Router } from "express";
import bookController from "../controllers/book.controller.js";
import { isAuthed } from "../middlewares/is-authed.middleware.js";

const bookRouter = Router();

bookRouter.get("/random", bookController.getRandomBooks);
bookRouter.get("/:userId", isAuthed, bookController.getAllUserBooks);
bookRouter.get("/title/:titleSearched", isAuthed, bookController.getBooksByTitle);
bookRouter.get("/author/:authorSearched", isAuthed, bookController.getBookByAuthor);

export default bookRouter;
