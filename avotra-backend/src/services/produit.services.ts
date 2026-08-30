import { PoolClient } from "pg";
import { pool } from "../config/database";
import { ProduitModel } from "../models/produit.models";
import { CreateProduit } from "../types/produit.types";

export const ProduitService = {

    // =========================================================
    // VALIDATION DES DONNÉES DU PRODUIT
    // =========================================================

    validateData(data: CreateProduit): void {

        if (!data) {
            throw new Error(
                "Les données du produit sont obligatoires."
            );
        }

        // -----------------------------------------------------
        // CATÉGORIE
        // -----------------------------------------------------

        if (
            !Number.isInteger(Number(data.categories_id)) ||
            Number(data.categories_id) <= 0
        ) {
            throw new Error(
                "ID de catégorie invalide."
            );
        }

        // -----------------------------------------------------
        // NOM
        // -----------------------------------------------------

        if (
            typeof data.nom !== "string" ||
            data.nom.trim() === ""
        ) {
            throw new Error(
                "Le nom du produit est obligatoire."
            );
        }

        if (data.nom.trim().length > 150) {
            throw new Error(
                "Le nom du produit est trop long."
            );
        }

        // -----------------------------------------------------
        // DESCRIPTION
        // -----------------------------------------------------

        if (
            data.description !== undefined &&
            data.description !== null &&
            typeof data.description !== "string"
        ) {
            throw new Error(
                "La description du produit est invalide."
            );
        }

        // -----------------------------------------------------
        // PRIX D'ACHAT
        // -----------------------------------------------------

        if (
            !Number.isFinite(Number(data.prix_achat)) ||
            Number(data.prix_achat) < 0
        ) {
            throw new Error(
                "Le prix d'achat doit être un nombre positif ou nul."
            );
        }

        // -----------------------------------------------------
        // PRIX DE VENTE
        // -----------------------------------------------------

        if (
            !Number.isFinite(Number(data.prix_vente)) ||
            Number(data.prix_vente) < 0
        ) {
            throw new Error(
                "Le prix de vente doit être un nombre positif ou nul."
            );
        }

        // -----------------------------------------------------
        // UNITÉ
        // -----------------------------------------------------

        if (
            typeof data.unite !== "string" ||
            data.unite.trim() === ""
        ) {
            throw new Error(
                "L'unité du produit est obligatoire."
            );
        }

        if (data.unite.trim().length > 50) {
            throw new Error(
                "L'unité du produit est trop longue."
            );
        }
    },


    // =========================================================
    // VÉRIFIER QUE LA CATÉGORIE EXISTE
    // =========================================================

    async verifyCategorie(
        categoriesId: number,
        client: PoolClient
    ): Promise<void> {

        const result = await client.query(
            `
            SELECT id
            FROM categories
            WHERE id = $1;
            `,
            [categoriesId]
        );

        if (Number(result.rowCount ?? 0) === 0) {
            throw new Error(
                "Catégorie introuvable."
            );
        }
    },


    // =========================================================
    // CRÉER UN PRODUIT
    // =========================================================

    async createProduit(
        data: CreateProduit
    ) {

        // Vérification des données
        this.validateData(data);

        // Connexion PostgreSQL
        const client: PoolClient =
            await pool.connect();

        try {

            // Début de transaction
            await client.query("BEGIN");

            // Vérifier la catégorie
            await this.verifyCategorie(
                Number(data.categories_id),
                client
            );

            // Créer le produit
            const produit =
                await ProduitModel.createProduit(
                    {
                        categories_id:
                            Number(data.categories_id),

                        nom:
                            data.nom.trim(),

                        description:
                            data.description?.trim() ||
                            undefined,

                        prix_achat:
                            Number(data.prix_achat),

                        prix_vente:
                            Number(data.prix_vente),

                        unite:
                            data.unite.trim()
                    },
                    client
                );

            // Valider la transaction
            await client.query("COMMIT");

            return produit;

        } catch (error) {

            // Annuler en cas d'erreur
            await client.query("ROLLBACK");

            throw error;

        } finally {

            // Libérer la connexion
            client.release();
        }
    },


    // =========================================================
    // AFFICHER TOUS LES PRODUITS
    // =========================================================

    async getAll() {

        return await ProduitModel.getAllProduit();
    },


    // =========================================================
    // AFFICHER UN PRODUIT PAR ID
    // =========================================================

    async getById(
        id: number
    ) {

        // Vérification ID
        if (
            !Number.isInteger(id) ||
            id <= 0
        ) {
            throw new Error(
                "ID de produit invalide."
            );
        }

        // Recherche
        const produit =
            await ProduitModel.getByIdProduit(id);

        // Produit inexistant
        if (!produit) {
            throw new Error(
                "Produit introuvable."
            );
        }

        return produit;
    },


    // =========================================================
    // RECHERCHER DES PRODUITS
    // =========================================================

    async searchProduit(
        search: string
    ) {

        const value =
            String(search ?? "").trim();

        // Si aucune recherche :
        // afficher tous les produits
        if (!value) {
            return await ProduitModel.getAllProduit();
        }
        return await ProduitModel.searchProduit(
            value
        );
    },

    // MODIFIER UN PRODUIT

    async updateProduit(id: number, data: CreateProduit) {

        // Vérifier l'ID

        if (!Number.isInteger(id) || id <= 0) {
            throw new Error(
                "ID de produit invalide."
            );
        }

        // Vérifier les données

        this.validateData(data);
        // Connexion PostgreSQL

        const client: PoolClient = await pool.connect();
        try {

            // Début transaction
            await client.query("BEGIN");

            // Récupérer le produit et le verrouiller

            const produit = await ProduitModel.getByIdForUpdate(id, client);

            if (!produit) {
                throw new Error(
                    "Produit introuvable."
                );
            }

            // Vérifier la catégorie

            await this.verifyCategorie(Number(data.categories_id), client);

            // Modifier le produit

            const produitModifie =
                await ProduitModel.updateProduit(
                    id,
                    {
                        categories_id: Number(data.categories_id),
                        nom: data.nom.trim(),
                        description: data.description?.trim() || undefined,
                        prix_achat: Number(data.prix_achat),
                        prix_vente: Number(data.prix_vente),
                        unite: data.unite.trim()
                    },
                    client
                );

            if (!produitModifie) {
                throw new Error(
                    "Impossible de modifier le produit."
                );
            }

            // Valider
            await client.query("COMMIT");

            return produitModifie;

        } catch (error) {

            // Annuler
            await client.query("ROLLBACK");

            throw error;

        } finally {

            // Libérer connexion
            client.release();
        }
    },


    // SUPPRIMER UN PRODUIT

    async deleteProduit(id: number): Promise<void> {

        // -----------------------------------------------------
        // Vérifier ID
        // -----------------------------------------------------

        if (
            !Number.isInteger(id) ||
            id <= 0
        ) {
            throw new Error(
                "ID de produit invalide."
            );
        }

        // -----------------------------------------------------
        // Connexion PostgreSQL
        // -----------------------------------------------------

        const client: PoolClient =
            await pool.connect();

        try {

            // Début transaction
            await client.query("BEGIN");

            // Récupérer le produit avec verrou

            const produit =
                await ProduitModel.getByIdForUpdate(
                    id,
                    client
                );

            if (!produit) {
                throw new Error(
                    "Produit introuvable."
                );
            }

            // Vérifier le stock

            if (Number(produit.stock) > 0) {
                throw new Error(
                    "Impossible de supprimer un produit dont le stock est supérieur à 0."
                );
            }

            // -------------------------------------------------
            // Vérifier les achats
            // -------------------------------------------------

            const achats =
                await client.query(
                    `
                    SELECT id
                    FROM achats
                    WHERE produit_id = $1
                    LIMIT 1;
                    `,
                    [id]
                );

            if (
                Number(achats.rowCount ?? 0) > 0
            ) {
                throw new Error(
                    "Impossible de supprimer ce produit car il possède un historique d'achats."
                );
            }

            // Vérifier les mouvements de stock

            const mouvements =
                await client.query(
                    `
                    SELECT id
                    FROM mouvements_stock
                    WHERE produit_id = $1
                    LIMIT 1;
                    `,
                    [id]
                );

            if (
                Number(mouvements.rowCount ?? 0) > 0
            ) {
                throw new Error(
                    "Impossible de supprimer ce produit car il possède un historique de mouvements de stock."
                );
            }

            // -------------------------------------------------
            // Supprimer le produit
            // -------------------------------------------------

            await ProduitModel.deleteProduit(
                id,
                client
            );

            // -------------------------------------------------
            // Valider transaction
            // -------------------------------------------------

            await client.query("COMMIT");

        } catch (error) {

            // Annuler transaction
            await client.query("ROLLBACK");

            throw error;

        } finally {

            // Libérer connexion
            client.release();
        }
    }
};