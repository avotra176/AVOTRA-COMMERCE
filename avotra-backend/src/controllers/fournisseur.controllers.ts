import { Request, Response } from 'express';
import { fournisseurService } from '../services/fournisseur.service';

// Creation de fournissaur controllers 
export const createfournisseur = async (req: Request, res: Response) => {
    try {
        const fournisseur = await fournisseurService.createfournisseur(req.body);
        res.status(201).json({
            success: true,
            message: "Fournisseurs ajoutee avec succes.",
            data: fournisseur,
        });
    }
    catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message,
        })
    }
};

// Affichage toutes les fournisseurs controllers
export const getfournisseur = async (req: Request, res: Response) => {
    try {
        const fournisseur = await fournisseurService.getAll();
        res.status(200).json({
            success: true,
            data: fournisseur,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// Affichage fournisseur par id 
export const getfournisseurById = async (req: Request, res: Response) => {
    try {
        const fournisseur = await fournisseurService.getById(Number(req.params.id));
        if (!fournisseur) {
            return res.status(404).json({
                success: false,
                message: "Fournisseur introuvable.",
            });

        }
        res.status(200).json({
            success: true,
            data: fournisseur,
        })
    }
    catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Mise a jour de fournisseur id 
export const updatefournisseur = async (req: Request, res: Response) => {
    try {
        const fournisseur = await fournisseurService.updatefournisseur(Number(req.params.id), req.body);
        res.status(200).json({
            success: true,
            message: "Fournisseur modifie avec succes.",
            data: fournisseur,
        })
    }
    catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


// Suppression de fournisseurs 
export const deletefournisseur = async (req: Request, res: Response) => {
    try {
        await fournisseurService.deletefournisseur(Number(req.params.id));
        res.status(200).json({
            success: true,
            message: "Fournisseur supprimer avec succes",
        });
    }
    catch (error: any) {
        return res.status(500).json({
            seuccess: false,
            message: error.message,
        });
    }
};