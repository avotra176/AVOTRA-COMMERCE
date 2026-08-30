import { Request, Response } from "express";
import { ProduitService } from "../services/produit.services";
import { CreateProduit } from "../types/produit.types";

// CRÉER UN PRODUIT

export const createProduit = async (
    req: Request,
    res: Response
) => {

    try {

        const produit = await ProduitService.createProduit(req.body);

        res.status(201).json({
            success: true,
            message:
                "Produit enregistré avec succès.",
            data: produit
        });

    } catch (error: any) {

        console.error(
            "Erreur createProduit :",
            error
        );


        res.status(400).json({
            success: false,
            message:
                error?.message ??
                "Erreur lors de la création du produit."
        });
    }
};

// AFFICHER TOUS LES PRODUITS
export const getProduit = async (req: Request, res: Response) => {
    try {
        const produits = await ProduitService.getAll();
        res.status(200).json({ success: true, data: produits });
    } catch (error: any) {
        console.error("Erreur getProduit :", error);

        res.status(500).json({
            success: false,
            message:
                error?.message ??
                "Erreur lors de la récupération des produits."
        });
    }
};

// RECHERCHER UN PRODUIT
export const searchProduit = async (req: Request, res: Response) => {
    try {
        const search = String(req.query.search ?? "");
        const produits = await ProduitService.searchProduit(search);
        res.status(200).json({
            success: true,
            data: produits
        });
    } catch (error: any) {

        console.error(
            "Erreur searchProduit :",
            error
        );
        res.status(500).json({
            success: false,
            message:
                error?.message ??
                "Erreur lors de la recherche."
        });
    }
};

// AFFICHER UN PRODUIT PAR ID

export const getProduitById = async (
    req: Request,
    res: Response
) => {

    try {

        const id =
            Number(req.params.id);


        const produit =
            await ProduitService.getById(id);


        res.status(200).json({
            success: true,
            data: produit
        });

    } catch (error: any) {

        console.error(
            "Erreur getProduitById :",
            error
        );


        res.status(404).json({
            success: false,
            message:
                error?.message ??
                "Produit introuvable."
        });
    }
};


// =========================================================
// MODIFIER UN PRODUIT
// =========================================================

export const updateProduit = async (req: Request, res: Response) => {

    try {

        const id = Number(req.params.id);
        const data: CreateProduit = req.body;
        const produit = await ProduitService.updateProduit(id, data);

        res.status(200).json({
            success: true,
            message:
                "Produit modifié avec succès.",
            data: produit
        });

    } catch (error: any) {

        console.error(
            "Erreur updateProduit :",
            error
        );


        res.status(400).json({
            success: false,
            message:
                error?.message ??
                "Erreur lors de la modification du produit."
        });
    }
};


// =========================================================
// SUPPRIMER UN PRODUIT
// =========================================================

export const deleteProduit = async (
    req: Request,
    res: Response
) => {

    try {

        const id =
            Number(req.params.id);


        await ProduitService.deleteProduit(
            id
        );


        res.status(200).json({
            success: true,
            message:
                "Produit supprimé avec succès."
        });

    } catch (error: any) {

        console.error(
            "Erreur deleteProduit :",
            error
        );


        res.status(400).json({
            success: false,
            message:
                error?.message ??
                "Erreur lors de la suppression du produit."
        });
    }
};