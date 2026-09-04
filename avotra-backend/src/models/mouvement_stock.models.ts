import { PoolClient } from "pg";
import { pool } from '../config/database';
import { Mouvement_stock, CreateMouvementStock } from '../types/mouvement_stock.types';

export const Mouvement_stockModel = {
    async createMouvement_stock(
        data: CreateMouvementStock,
        client?: PoolClient
    ): Promise<Mouvement_stock> {
        const query = `
        INSERT INTO mouvements_stock (
            produit_id,
            type_mouvement,
            quantite,
            date_mouvement,
            observation
        )
        VALUES ($1, $2, $3, NOW(), $4) RETURNING *
        `;

        const values = [
            data.produit_id,
            data.type_mouvement,
            data.quantite,
            data.observation,
        ];

        const executor = client ?? pool;
        const result = await executor.query(query, values);
        return result.rows[0];
    },

    async getAllMouvementStock(): Promise<Mouvement_stock[]> {
        const result = await pool.query("SELECT * FROM mouvements_stock ORDER BY id DESC");
        return result.rows;
    },

    async getByIdMouvementStock(id: number): Promise<Mouvement_stock | null> {
        const result = await pool.query("SELECT * FROM mouvements_stock WHERE id=$1", [id]);
        return result.rows[0] ?? null;
    }
}