import express from "express";
import ejs from "ejs";
import pg from "pg";
import env from "dotenv";
import cors from "cors";

env.config();

const app = express();
const port = 3000;

const db = new pg.Client({
    connectionString: process.env.PG_URL,
});
db.connect();

app.use(express.static("public"));

app.get("/novamensagem", cors(), (req, res) => {
    db.query(
        "INSERT INTO mensagens(nome, email, assunto, mensagem) VALUES($1, $2, $3, $4)",
        [req.query.nome, req.query.email, req.query.assunto, req.query.mensagem]
    );

    res.json("Mensagem enviada");
});

app.get("/", async (req, res) => {
    const result = await db.query("SELECT * FROM mensagens");
    const data = result.rows;
    console.log(data);
    res.render("index.ejs", { data: data });
});

app.listen(port, () => {
    console.log(`Server on port ${port}`);
});
