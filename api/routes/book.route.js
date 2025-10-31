import { Router } from "express";
import bookController from "../controllers/book.controller.js";

const bookRouter = Router();

bookRouter.get("/random", bookController.getLatestBooks);

export { bookRouter };
