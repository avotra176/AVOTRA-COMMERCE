import { Router } from "express";
import { login, register, getProfile, changePassword } from "../controllers/auth.controllers";
import authMiddleware from "../middlewares/auth.middleware";
import adminOnly from "../middlewares/adminOnly.middleware";

const router = Router();

router.post("/register", authMiddleware, adminOnly, register);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.put("/change-password", authMiddleware, changePassword);

export default router;