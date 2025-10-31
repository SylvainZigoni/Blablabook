import express from "express";
import "dotenv/config";

const app = express();

app.use(express.json());
app.use(express.static("./public"));

app.get("/", (req, res) => {
	res.send("Ca marche encore et toujours ! Incroyable");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Lancé sur l'adresse http://localhost:${port}`);
});
