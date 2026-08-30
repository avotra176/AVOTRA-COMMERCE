import { Router } from "express";

import authMiddleware from "../middlewares/auth.middleware";

import {
    createCategorie,
    getCategorie,
    getCategorieById,
    updateCategorie,
    deleteCategorie
} from "../controllers/categorie.controllers";

const router = Router();

// =====================================================
// CATEGORIES
// =====================================================

// POST /categories
router.post(
    "/",
    authMiddleware,
    createCategorie
);

// GET /categories
router.get(
    "/",
    authMiddleware,
    getCategorie
);

// GET /categories/:id
router.get(
    "/:id",
    authMiddleware,
    getCategorieById
);

// PUT /categories/:id
router.put(
    "/:id",
    authMiddleware,
    updateCategorie
);

// DELETE /categories/:id
router.delete(
    "/:id",
    authMiddleware,
    deleteCategorie
);

export default router;