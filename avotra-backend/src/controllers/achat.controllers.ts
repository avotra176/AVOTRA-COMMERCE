import { Request, Response } from "express";
import { AchatService } from "../services/achat.services";

// =====================================================
// AJOUTER
// =====================================================
export const createAchat = async (
  req: Request,
  res: Response
) => {
  try {
    const achat =
      await AchatService.createAchat(req.body);

    res.status(201).json({
      success: true,
      message: "Achat enregistré avec succès.",
      data: achat,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Erreur lors de l'enregistrement de l'achat.";

    res.status(400).json({
      success: false,
      message,
    });
  }
};

// =====================================================
// AFFICHER TOUS
// =====================================================
export const getAchat = async (
  req: Request,
  res: Response
) => {
  try {
    const achats =
      await AchatService.getAchat();

    res.status(200).json({
      success: true,
      data: achats,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Erreur lors de la récupération des achats.";

    res.status(500).json({
      success: false,
      message,
    });
  }
};

// =====================================================
// RECHERCHER
// =====================================================
export const searchAchat = async (
  req: Request,
  res: Response
) => {
  try {
    const search =
      typeof req.query.search === "string"
        ? req.query.search
        : "";

    const achats =
      await AchatService.searchAchat(search);

    res.status(200).json({
      success: true,
      data: achats,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Erreur lors de la recherche.";

    res.status(500).json({
      success: false,
      message,
    });
  }
};

// =====================================================
// AFFICHER PAR ID
// =====================================================
export const getAchatById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const achat =
      await AchatService.getAchatById(id);

    res.status(200).json({
      success: true,
      data: achat,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Achat introuvable.";

    res.status(404).json({
      success: false,
      message,
    });
  }
};

// MODIFIER
export const updateAchat = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const achat =
      await AchatService.updateAchat(
        id,
        req.body
      );

    res.status(200).json({
      success: true,
      message: "Achat modifié avec succès.",
      data: achat,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Erreur lors de la modification.";

    res.status(400).json({
      success: false,
      message,
    });
  }
};

// SUPPRIMER
export const deleteAchat = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    await AchatService.deleteAchat(id);

    res.status(200).json({
      success: true,
      message: "Achat supprimé avec succès.",
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Erreur lors de la suppression.";

    res.status(400).json({
      success: false,
      message,
    });
  }
};