import express from "express";

const app = express()

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "API da plataforma Todo Serviço está funcionando!"
    })
});

export default app;