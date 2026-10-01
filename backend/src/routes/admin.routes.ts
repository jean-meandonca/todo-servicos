import { Router } from "express";
import { blockUserController } from "../controllers/admin.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

const router = Router();

router.patch(
    "/users/:id/block",
    authMiddleware,
    adminMiddleware,
    blockUserController
);

export default router;