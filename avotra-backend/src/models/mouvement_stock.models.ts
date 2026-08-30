import { pool } from '../config/database';
import { Mouvement_stock, CreateMouvementStock } from '../types/mouvement_stock.types';

export const Mouvement_stockModel = {
    async createMouvement_stock(data: CreateMouvementStock): Promise<Mouvement_stock>{
        const query = `
        INSERT INTO mouvement_stock (
            produit_id,
            type_mouvement,
            quantite,
            observation,
        )
        VALUES ($1, $2, $3, $4) RETURNING *
        `;

        const values = [
            data.produit_id,
            data.quantite,
            data.type_mouvement,
            data.observation,
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Affichage toutes le mouvement de stock
    async getAllMouvementStock (): Promise<Mouvement_stock[]>{
        const result = await pool.query("SELECT * FROM mouvement_stock ORDER BY ID DESC");

        return result.rows;
    },

    // Affichage mouvement de stock par id 
    async getByIdMouvementStock(id: number): Promise<Mouvement_stock | null>{
        const result = await pool.query("SELECT * FROM mouvement_stock WHERE id=$1", [id]);
        return result.rows[0] ?? null;
    }
}