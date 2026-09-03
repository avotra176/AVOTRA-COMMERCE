import { pool } from "../config/database";
import { Achat, CreateAchat } from "../types/achat.types";

export const AchatModel = {
    // Ajouter un achat
    async createAchat(data: CreateAchat, montant_total: number): Promise<Achat> {
        const query = `
      INSERT INTO achats (
        produit_id,
        utilisateur_id,
        fournisseur_id,
        quantite,
        prix_unitaire,
        montant_total
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

        const values = [
            data.produit_id,
            data.utilisateur_id,
            data.fournisseur_id,
            data.quantite,
            data.prix_unitaire,
            montant_total,
        ];

        const result = await pool.query<Achat>(query, values);
        const achat = result.rows[0];

        if (!achat) {
            throw new Error("Achat non créé");
        }

        return achat;
    },

    // Afficher tous les achats
    async getAllAchat(): Promise<Achat[]> {
        const query = `
      SELECT *
      FROM achats
      ORDER BY id DESC;
    `;

        const result = await pool.query<Achat>(query);

        return result.rows;
    },

    // Afficher un achat par ID
    async getByIdAchat(id: number): Promise<Achat | null> {
        const query = `
      SELECT *
      FROM achats
      WHERE id = $1;
    `;

        const result = await pool.query<Achat>(query, [id]);

        return result.rows[0] ?? null;
    },

    // Rechercher des achats
    async searchAchat(search: string): Promise<Achat[]> {
        const query = `
      SELECT a.*
      FROM achats a
      LEFT JOIN produits p
        ON p.id = a.produit_id
      WHERE
        CAST(a.id AS TEXT) ILIKE $1
        OR CAST(a.produit_id AS TEXT) ILIKE $1
        OR CAST(a.fournisseur_id AS TEXT) ILIKE $1
        OR p.nom ILIKE $1
      ORDER BY a.id DESC;
    `;

        const values = [`%${search}%`];

        const result = await pool.query<Achat>(query, values);

        return result.rows;
    },

    // Modifier un achat
    async updateAchat(id: number, data: CreateAchat, montant_total: number): Promise<Achat | null> {
        const query = `
      UPDATE achats
      SET
        produit_id = $1,
        fournisseur_id = $2,
        quantite = $3,
        prix_unitaire = $4,
        montant_total = $5
      WHERE id = $6
      RETURNING *;
    `;

        const values = [
            data.produit_id,
            data.fournisseur_id,
            data.quantite,
            data.prix_unitaire,
            montant_total,
            id,
        ];

        const result = await pool.query<Achat>(query, values);

        return result.rows[0] ?? null;
    },

    // Supprimer un achat
    async deleteAchat(id: number): Promise<void> {
        await pool.query("DELETE FROM achats WHERE id = $1 RETURNING *", [id]);
    },


};