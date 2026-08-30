import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { createAchat, getAchat, getAchatById, updateAchat, deleteAchat, searchAchat, } from "../controllers/achat.controllers";

const router = Router();

// Ajouter
router.post("/", authMiddleware, createAchat);
// Rechercher
// IMPORTANT : cette route doit être AVANT /:id
router.get("/recherche", authMiddleware, searchAchat);
// Afficher tous
router.get("/", authMiddleware, getAchat);
// Afficher par ID
router.get("/:id", authMiddleware, getAchatById);
// Modifier
router.put("/:id", authMiddleware, updateAchat);
// Supprimer
router.delete("/:id", authMiddleware, deleteAchat);

export default router;