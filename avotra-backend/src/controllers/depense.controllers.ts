import { Request, Response } from "express";
import { DepenseService } from "../services/depense.services";

export const createDepense = async (req: Request, res: Response) => {
    try {
        const depense = await DepenseService.createDepense(req.body);
        res.status(201).json({
            success: true,
            message: "Dépense enregistrée avec succès.",
            data: depense,
        });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getDepenses = async (req: Request, res: Response) => {
    try {
        const utilisateur_id = req.query.utilisateur_id
            ? Number(req.query.utilisateur_id)
            : undefined;

        const depenses = await DepenseService.getDepenses(utilisateur_id);
        res.status(200).json({ success: true, data: depenses });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateDepense = async (req: Request, res: Response) => {
    try {
        const { utilisateur_id, ...data } = req.body;
        const depense = await DepenseService.updateDepense(
            Number(req.params.id),
            utilisateur_id,
            data
        );
        res.status(200).json({
            success: true,
            message: "Dépense modifiée avec succès.",
            data: depense,
        });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteDepense = async (req: Request, res: Response) => {
    try {
        const utilisateur_id = Number(req.query.utilisateur_id);
        await DepenseService.deleteDepense(Number(req.params.id), utilisateur_id);
        res.status(200).json({ success: true, message: "Dépense supprimée avec succès." });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};