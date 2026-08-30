import { Request, Response } from "express";
import { VenteService } from "../services/vente.services";

export const createVente = async (req: Request, res: Response) => {
  try {
    const vente = await VenteService.createVentes(req.body);

    res.status(201).json({
      success: true,
      message: "Vente enregistrée avec succès.",
      data: vente,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getVentes = async (req: Request, res: Response) => {
  try {
    const ventes = await VenteService.getAll();

    res.status(200).json({
      success: true,
      data: ventes,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getVenteById = async (req: Request, res: Response) => {
  try {
    const vente = await VenteService.getById(Number(req.params.id));

    if (!vente) {
      return res.status(404).json({
        success: false,
        message: "Vente introuvable.",
      });
    }

    res.status(200).json({
      success: true,
      data: vente,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateVente = async (req: Request, res: Response) => {
  try {
    const vente = await VenteService.updateVentes(
      Number(req.params.id),
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Vente modifiée avec succès.",
      data: vente,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteVente = async (req: Request, res: Response) => {
  try {
    await VenteService.deleteVentes(Number(req.params.id));

    res.status(200).json({
      success: true,
      message: "Vente supprimée avec succès.",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};