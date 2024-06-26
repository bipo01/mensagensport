import express from "express";
import ejs from "ejs";
import pg from "pg";
import env from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

env.config();

const app = express();
const port = 3000;

const db = new pg.Client({
    connectionString: process.env.PG_URL,
});
db.connect();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/novamensagem", cors(), (req, res) => {
    db.query(
        "INSERT INTO mensagens(nome, email, assunto, mensagem) VALUES($1, $2, $3, $4)",
        [req.query.nome, req.query.email, req.query.assunto, req.query.mensagem]
    );

    res.json("Mensagem enviada");
});

app.get("/1215110103", async (req, res) => {
    const result = await db.query("SELECT * FROM mensagens");
    const data = result.rows;
    console.log(data);
    res.render("index.ejs", { data: data });
});

app.post("/apagar", (req, res) => {
    db.query("DELETE FROM mensagens WHERE id = $1", [req.body.idApagada]);

    res.redirect("/1215110103");
});

app.listen(port, () => {
    console.log(`Server on port ${port}`);
});
