import express from "express";
import "dotenv/config";
import bookRouter from "./routes/book.route.js";
import authRouter from "./routes/auth.route.js";
import cors from "cors";
import { xss } from "express-xss-sanitizer";

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.use(cors({
	origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
	credentials: true
}));


app.use(xss()); // Middleware de sanitization XSS

app.get("/", (req, res) => {
	res.send("Ca marche encore et toujours ! Incroyable");
});

app.use("/books", bookRouter);
app.use("/auth", authRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Lancé sur l'adresse http://localhost:${port}`);
});
