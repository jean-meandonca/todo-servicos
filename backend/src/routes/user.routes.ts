import {Router} from "express";
import { createUserController, getMeController, updateMeController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", createUserController);
router.get("/me", authMiddleware, getMeController);
router.patch("/me", authMiddleware, updateMeController);

export default router;