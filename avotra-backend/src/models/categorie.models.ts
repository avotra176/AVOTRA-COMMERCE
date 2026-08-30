import { pool } from "../config/database";
import { Categorie, CreateCategorie, UpdateCategorie } from "../types/categorie.types";

export const CategorieModel = {

    // =====================================================
    // CREATE
    // =====================================================
    async create(data: CreateCategorie): Promise<Categorie> {

        const result = await pool.query<Categorie>(
            `
            INSERT INTO categories (
                nom,
                description,
                created_at
            )
            VALUES ($1, $2, NOW())
            RETURNING *
            `,
            [
                data.nom.trim(),
                data.description ?? null
            ]
        );

        const createdCategorie = result.rows[0];

        if (!createdCategorie) {
            throw new Error("Failed to create categorie");
        }

        return createdCategorie;
    },

    // =====================================================
    // GET ALL
    // =====================================================
    async findAll(): Promise<Categorie[]> {

        const result = await pool.query<Categorie>(
            `
            SELECT *
            FROM categories
            ORDER BY id DESC
            `
        );

        return result.rows;
    },

    // =====================================================
    // GET BY ID
    // =====================================================
    async findById(id: number): Promise<Categorie | null> {

        const result = await pool.query<Categorie>(
            `
            SELECT *
            FROM categories
            WHERE id = $1
            `,
            [id]
        );

        return result.rows[0] ?? null;
    },

    // =====================================================
    // UPDATE
    // =====================================================
    async update(
        id: number,
        data: UpdateCategorie
    ): Promise<Categorie | null> {

        const result = await pool.query<Categorie>(
            `
            UPDATE categories
            SET
                nom = $1,
                description = $2
            WHERE id = $3
            RETURNING *
            `,
            [
                data.nom.trim(),
                data.description ?? null,
                id
            ]
        );

        return result.rows[0] ?? null;
    },

    // =====================================================
    // DELETE
    // =====================================================
    async delete(id: number): Promise<Categorie | null> {

        const result = await pool.query<Categorie>(
            `
            DELETE FROM categories
            WHERE id = $1
            RETURNING *
            `,
            [id]
        );

        return result.rows[0] ?? null;
    }
};