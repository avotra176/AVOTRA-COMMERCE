import { DepenseModel } from "../models/depenses.models";
import { CreateDepensePersonnelle, UpdateDepensePersonnelle } from "../types/depenses.types";

export const DepenseService = {
    async createDepense(data: CreateDepensePersonnelle) {
        if (!data.utilisateur_id) {
            throw new Error("L'utilisateur est obligatoire");
        }
        if (!data.titre || data.titre.trim() === "") {
            throw new Error("Le titre est obligatoire");
        }
        if (!data.montant || data.montant <= 0) {
            throw new Error("Le montant doit être supérieur à 0");
        }

        return await DepenseModel.create(data);
    },

    async getDepenses(utilisateur_id?: number) {
        return await DepenseModel.findAll(utilisateur_id);
    },

    async getDepenseById(id: number) {
        const depense = await DepenseModel.findById(id);
        if (!depense) {
            throw new Error("Dépense introuvable");
        }
        return depense;
    },

    async updateDepense(id: number, utilisateur_id: number, data: UpdateDepensePersonnelle) {
        if (!data.titre || data.titre.trim() === "") {
            throw new Error("Le titre est obligatoire");
        }
        if (!data.montant || data.montant <= 0) {
            throw new Error("Le montant doit être supérieur à 0");
        }

        const existante = await DepenseModel.findById(id);
        if (!existante) {
            throw new Error("Dépense introuvable");
        }
        if (existante.utilisateur_id !== utilisateur_id) {
            throw new Error("Vous ne pouvez pas modifier cette dépense");
        }

        return await DepenseModel.update(id, data);
    },

    async deleteDepense(id: number, utilisateur_id: number) {
        const existante = await DepenseModel.findById(id);
        if (!existante) {
            throw new Error("Dépense introuvable");
        }
        if (existante.utilisateur_id !== utilisateur_id) {
            throw new Error("Vous ne pouvez pas supprimer cette dépense");
        }

        await DepenseModel.delete(id);
    },
};