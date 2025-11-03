import express from "express";
import "dotenv/config";
import bookRouter from "./routes/book.route.js";
import authRouter from "./routes/auth.route.js";

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
	res.send("Ca marche encore et toujours ! Incroyable");
});

app.use("/books", bookRouter);
app.use("/auth", authRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Lancé sur l'adresse http://localhost:${port}`);
});
