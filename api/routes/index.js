import { Router } from "express";
import authRouter from "./auth.route.js";
import bookRouter from "./book.route.js";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/books", bookRouter);

export default apiRouter;
