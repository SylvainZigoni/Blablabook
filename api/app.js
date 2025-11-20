import express from "express";
import "dotenv/config";
import apiRouter from "./routes/index.route.js";
import cors from "cors";
import { xss } from "express-xss-sanitizer";

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.use(
	cors({
		origin: [
			"http://localhost:5173",
			"http://127.0.0.1:5173",
			"http://api:3000",
			"https://blablabook-cli.onrender.com",
		],
		credentials: true,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

app.use(xss()); // Middleware de sanitization XSS, placé ici pour protéger tous les endpoints.

app.get("/", (req, res) => {
	res.send("Ca marche encore et toujours ! Incroyable");
});

app.use(apiRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Lancé sur l'adresse http://localhost:${port}`);
});
