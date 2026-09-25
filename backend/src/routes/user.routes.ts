import {Router} from "express";
import { createUserController, getMeController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", createUserController);
router.get("/me", authMiddleware, getMeController);

export default router;