import { PoolClient } from "pg";
import { pool } from "../config/database";
import { Produit, CreateProduit } from "../types/produit.types";

export const ProduitModel = {

    // CRÉER UN PRODUIT

    async createProduit(
        data: CreateProduit,
        client?: PoolClient
    ): Promise<Produit> {

        const query = `
            INSERT INTO produits (
                categories_id,
                nom,
                description,
                prix_achat,
                prix_vente,
                unite
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;

        const values = [
            data.categories_id,
            data.nom,
            data.description ?? null,
            data.prix_achat,
            data.prix_vente,
            data.unite
        ];

        const executor = client ?? pool;

        const result = await executor.query(
            query,
            values
        );

        return result.rows[0];
    },

    // AFFICHER TOUS LES PRODUITS

    async getAllProduit(): Promise<Produit[]> {

        const query = `
            SELECT *
            FROM produits
            ORDER BY id DESC;
        `;

        const result = await pool.query(query);

        return result.rows;
    },

    // AFFICHER UN PRODUIT PAR ID

    async getByIdProduit(
        id: number
    ): Promise<Produit | null> {

        const query = `
            SELECT *
            FROM produits
            WHERE id = $1;
        `;

        const result = await pool.query(
            query,
            [id]
        );

        return result.rows[0] ?? null;
    },

    // RECHERCHER UN PRODUIT

    async searchProduit(
        search: string
    ): Promise<Produit[]> {

        const query = `
            SELECT *
            FROM produits
            WHERE
                CAST(id AS TEXT) ILIKE $1
                OR nom ILIKE $1
                OR COALESCE(description, '') ILIKE $1
                OR unite ILIKE $1
                OR CAST(categories_id AS TEXT) ILIKE $1
            ORDER BY id DESC;
        `;

        const values = [
            `%${search}%`
        ];

        const result = await pool.query(
            query,
            values
        );
        return result.rows;
    },

    // MODIFIER UN PRODUIT

    async updateProduit(
        id: number,
        data: CreateProduit,
        client?: PoolClient
    ): Promise<Produit | null> {
        const query = `
            UPDATE produits
            SET
                categories_id = $1,
                nom = $2,
                description = $3,
                prix_achat = $4,
                prix_vente = $5,
                unite = $6
            WHERE id = $7
            RETURNING *;
        `;

        const values = [
            data.categories_id,
            data.nom,
            data.description ?? null,
            data.prix_achat,
            data.prix_vente,
            data.unite,
            id
        ];

        const executor = client ?? pool;

        const result = await executor.query(query, values);

        return result.rows[0] ?? null;
    },


    // SUPPRIMER UN PRODUIT

    async deleteProduit(
        id: number,
        client?: PoolClient
    ): Promise<void> {

        const query = `
            DELETE FROM produits
            WHERE id = $1;
        `;

        const executor = client ?? pool;

        await executor.query(
            query,
            [id]
        );
    },

    // METTRE À JOUR LE STOCK

    async updateStock(
        id: number,
        stock: number,
        client?: PoolClient
    ): Promise<Produit> {

        if (stock < 0) {
            throw new Error(
                "Le stock ne peut pas être négatif."
            );
        }

        const query = `
            UPDATE produits
            SET stock = $1
            WHERE id = $2
            RETURNING *;
        `;

        const values = [
            stock,
            id
        ];

        const executor = client ?? pool;

        const result = await executor.query(
            query,
            values
        );

        if (result.rowCount === 0) {
            throw new Error(
                "Produit introuvable lors de la mise à jour du stock."
            );
        }

        return result.rows[0];
    },

    // RÉCUPÉRER UN PRODUIT AVEC VERROU

    async getByIdForUpdate(
        id: number,
        client: PoolClient
    ): Promise<Produit | null> {

        const query = `
            SELECT *
            FROM produits
            WHERE id = $1
            FOR UPDATE;
        `;

        const result = await client.query(
            query,
            [id]
        );

        return result.rows[0] ?? null;
    }
};