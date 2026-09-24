import express from "express";
import userRoutes from "./routes/user.routes.js"
import authRoutes from "./routes/auth.routes.js"

const app = express()

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "API da plataforma Todo Serviço está funcionando!"
    })
});

app.use("/users", userRoutes);
app.use("/auth", authRoutes);

export default app;