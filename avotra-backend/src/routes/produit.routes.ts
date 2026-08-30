import { Router } from "express";
import {
    createProduit,
    getProduit,
    getProduitById,
    searchProduit,
    updateProduit,
    deleteProduit
} from "../controllers/produits.controllers";
import authMiddleware from "../middlewares/auth.middleware";


const router = Router();


// RECHERCHE
router.get("/recherche", authMiddleware, searchProduit);


// CRÉER
router.post("/", authMiddleware, createProduit);

// AFFICHER TOUS
router.get("/", authMiddleware, getProduit);

// AFFICHER PAR ID
router.get("/:id", authMiddleware, getProduitById);


// MODIFIER
router.put("/:id", authMiddleware, updateProduit);

// SUPPRIMER
router.delete("/:id", authMiddleware, deleteProduit);


export default router;