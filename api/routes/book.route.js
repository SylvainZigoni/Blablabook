import { Router } from "express";
import bookController from "../controllers/book.controller.js";
import { isAuthed } from "../middlewares/is-authed.middleware.js";

const bookRouter = Router();

bookRouter.get("/random", bookController.getRandomBooks);
bookRouter.get("/title/:titleSearched",isAuthed, bookController.getBooksByTitle);
bookRouter.get("/author/:authorSearched",isAuthed, bookController.getBookByAuthor);
bookRouter.delete("/:userId/:bookId",isAuthed, bookController.deleteUserBook);
bookRouter.post("/:userId/:bookId",isAuthed, bookController.addUserBook);
bookRouter.get("/:userId",isAuthed, bookController.getAllUserBooks);


export default bookRouter;
