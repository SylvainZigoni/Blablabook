import { Router } from "express";
import authRouter from "./auth.route.js";
import bookRouter from "./book.route.js";
import adminRouter from "./admin.route.js";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/books", bookRouter);
apiRouter.use("/admin", adminRouter);

export default apiRouter;
