import { Request, Response } from "express";
import { CategorieService } from "../services/categorie.services";

// =====================================================
// CREATE CATEGORIE
// =====================================================
export const createCategorie = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const categorie =
            await CategorieService.createCategorie(req.body);

        res.status(201).json({
            success: true,
            message: "Catégorie créée avec succès",
            data: categorie
        });

    } catch (error: any) {

        console.error(
            "Erreur createCategorie:",
            error
        );

        res.status(400).json({
            success: false,
            message:
                error?.message ||
                "Erreur lors de la création de la catégorie"
        });
    }
};


// =====================================================
// GET ALL CATEGORIES
// =====================================================
export const getCategorie = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const categories =
            await CategorieService.getAll();

        res.status(200).json({
            success: true,
            data: categories
        });

    } catch (error: any) {

        console.error(
            "Erreur getCategorie:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Erreur serveur"
        });
    }
};


// =====================================================
// GET CATEGORIE BY ID
// =====================================================
export const getCategorieById = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {

            res.status(400).json({
                success: false,
                message: "ID de catégorie invalide"
            });

            return;
        }

        const categorie =
            await CategorieService.getById(id);

        res.status(200).json({
            success: true,
            data: categorie
        });

    } catch (error: any) {

        console.error(
            "Erreur getCategorieById:",
            error
        );

        if (error.message === "Catégorie introuvable") {

            res.status(404).json({
                success: false,
                message: error.message
            });

            return;
        }

        res.status(500).json({
            success: false,
            message: "Erreur serveur"
        });
    }
};


// =====================================================
// UPDATE CATEGORIE
// =====================================================
export const updateCategorie = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {

            res.status(400).json({
                success: false,
                message: "ID de catégorie invalide"
            });

            return;
        }

        const categorie =
            await CategorieService.updateCategorie(
                id,
                req.body
            );

        res.status(200).json({
            success: true,
            message: "Catégorie modifiée avec succès",
            data: categorie
        });

    } catch (error: any) {

        console.error(
            "Erreur updateCategorie:",
            error
        );

        if (error.message === "Catégorie introuvable") {

            res.status(404).json({
                success: false,
                message: error.message
            });

            return;
        }

        res.status(400).json({
            success: false,
            message:
                error?.message ||
                "Erreur lors de la modification"
        });
    }
};


// =====================================================
// DELETE CATEGORIE
// =====================================================
export const deleteCategorie = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {

            res.status(400).json({
                success: false,
                message: "ID de catégorie invalide"
            });

            return;
        }

        await CategorieService.deleteCategorie(id);

        res.status(200).json({
            success: true,
            message: "Catégorie supprimée avec succès"
        });

    } catch (error: any) {

        console.error(
            "Erreur deleteCategorie:",
            error
        );

        if (error.message === "Catégorie introuvable") {

            res.status(404).json({
                success: false,
                message: error.message
            });

            return;
        }

        res.status(400).json({
            success: false,
            message:
                error?.message ||
                "Erreur lors de la suppression"
        });
    }
};