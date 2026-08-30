import { CategorieModel } from "../models/categorie.models";
import {
    CreateCategorie,
    UpdateCategorie
} from "../types/categorie.types";

export const CategorieService = {

    // =====================================================
    // CREATE
    // =====================================================
    async createCategorie(data: CreateCategorie) {

        if (!data) {
            throw new Error("Les données de la catégorie sont obligatoires");
        }

        if (
            !data.nom ||
            typeof data.nom !== "string" ||
            data.nom.trim() === ""
        ) {
            throw new Error("Le nom de la catégorie est obligatoire");
        }

        const nom = data.nom.trim();

        if (nom.length > 100) {
            throw new Error(
                "Le nom de la catégorie ne doit pas dépasser 100 caractères"
            );
        }

        return await CategorieModel.create({
            nom,
            description:
                data.description !== undefined
                    ? data.description
                    : null
        });
    },

    // =====================================================
    // GET ALL
    // =====================================================
    async getAll() {

        return await CategorieModel.findAll();
    },

    // =====================================================
    // GET BY ID
    // =====================================================
    async getById(id: number) {

        if (!Number.isInteger(id) || id <= 0) {
            throw new Error("ID de catégorie invalide");
        }

        const categorie = await CategorieModel.findById(id);

        if (!categorie) {
            throw new Error("Catégorie introuvable");
        }

        return categorie;
    },

    // =====================================================
    // UPDATE
    // =====================================================
    async updateCategorie(
        id: number,
        data: UpdateCategorie
    ) {

        if (!Number.isInteger(id) || id <= 0) {
            throw new Error("ID de catégorie invalide");
        }

        if (!data) {
            throw new Error("Les données de modification sont obligatoires");
        }

        if (
            !data.nom ||
            typeof data.nom !== "string" ||
            data.nom.trim() === ""
        ) {
            throw new Error("Le nom de la catégorie est obligatoire");
        }

        const categorie = await CategorieModel.findById(id);

        if (!categorie) {
            throw new Error("Catégorie introuvable");
        }

        return await CategorieModel.update(id, {
            nom: data.nom.trim(),
            description:
                data.description !== undefined
                    ? data.description
                    : null
        });
    },

    // =====================================================
    // DELETE
    // =====================================================
    async deleteCategorie(id: number) {

        if (!Number.isInteger(id) || id <= 0) {
            throw new Error("ID de catégorie invalide");
        }

        const categorie = await CategorieModel.findById(id);

        if (!categorie) {
            throw new Error("Catégorie introuvable");
        }

        return await CategorieModel.delete(id);
    }
};