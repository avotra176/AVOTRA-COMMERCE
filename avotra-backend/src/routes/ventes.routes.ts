// src/routes/vente.routes.ts
import { Router } from "express";
import { createVente, getVentes, getVenteById, updateVente, deleteVente } from "../controllers/vente.controllers";
import  authMiddleware  from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createVente);
router.get("/", authMiddleware, getVentes);
router.get("/:id", authMiddleware, getVenteById);
router.put("/:id", authMiddleware, updateVente);
router.delete("/:id", authMiddleware, deleteVente);

export default router;
