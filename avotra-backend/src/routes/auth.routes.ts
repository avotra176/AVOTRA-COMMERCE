import { Router } from "express";
import { login, register} from "../controllers/auth.controllers";

const router = Router();

router.post("/register", register);
router.post("/login", login);
//router.get("/profile", authenticate, authController.getProfile);

export default router;
