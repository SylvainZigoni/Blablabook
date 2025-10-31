import { Router } from "express";
import bookController from "../controllers/book.controller.js";

const bookRouter = Router();

bookRouter.get("/random", bookController.getRandomBooks);
bookRouter.get("/latest", bookController.getLatestBooks);

export default bookRouter;
