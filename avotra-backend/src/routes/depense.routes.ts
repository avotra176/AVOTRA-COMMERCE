import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { createDepense, getDepenses, updateDepense, deleteDepense } from "../controllers/depense.controllers";

const router = Router();

router.post("/", authMiddleware, createDepense);
router.get("/", authMiddleware, getDepenses);
router.put("/:id", authMiddleware, updateDepense);
router.delete("/:id", authMiddleware, deleteDepense);

export default router;