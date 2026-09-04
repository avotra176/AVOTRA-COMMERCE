import { pool } from "../config/database";
import { DepensePersonnelle, CreateDepensePersonnelle, UpdateDepensePersonnelle } from "../types/depenses.types";

export const DepenseModel = {
    async create(data: CreateDepensePersonnelle): Promise<DepensePersonnelle> {
        const query = `
            INSERT INTO depenses_personnelles (utilisateur_id, titre, montant, categorie, observation)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [
            data.utilisateur_id,
            data.titre,
            data.montant,
            data.categorie ?? null,
            data.observation ?? null,
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Si utilisateur_id est fourni, ne renvoie que les dépenses de cet utilisateur
    async findAll(utilisateur_id?: number): Promise<DepensePersonnelle[]> {
        if (utilisateur_id) {
            const result = await pool.query(
                "SELECT * FROM depenses_personnelles WHERE utilisateur_id = $1 ORDER BY date_depense DESC, id DESC",
                [utilisateur_id]
            );
            return result.rows;
        }

        const result = await pool.query(
            "SELECT * FROM depenses_personnelles ORDER BY date_depense DESC, id DESC"
        );
        return result.rows;
    },

    async findById(id: number): Promise<DepensePersonnelle | null> {
        const result = await pool.query(
            "SELECT * FROM depenses_personnelles WHERE id = $1",
            [id]
        );
        return result.rows[0] ?? null;
    },

    async update(id: number, data: UpdateDepensePersonnelle): Promise<DepensePersonnelle | null> {
        const query = `
            UPDATE depenses_personnelles
            SET titre = $1, montant = $2, categorie = $3, observation = $4
            WHERE id = $5
            RETURNING *;
        `;
        const values = [
            data.titre,
            data.montant,
            data.categorie ?? null,
            data.observation ?? null,
            id,
        ];
        const result = await pool.query(query, values);
        return result.rows[0] ?? null;
    },

    async delete(id: number): Promise<void> {
        await pool.query("DELETE FROM depenses_personnelles WHERE id = $1", [id]);
    },
};