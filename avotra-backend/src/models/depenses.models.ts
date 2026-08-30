import { pool } from '../config/database';
import { Depense } from '../types/depenses.types';

export const DepenseModel = {

    // ajout depenses Model
    async create(depense: Depense){
        const result = await pool.query(
            `INSERT INTO depense (libelle, montant, description, date_depenses)
            VALUES ($1,$2,$3, NOW()) RETURNING *
            `, [
                depense.libelle,
                depense.montant,
                depense.description,
                depense.date_depenses,
            ]
        );
        return result.rows[0];
    },

    // Affichage toutes les depenses des utilisateurs
    async findAll(){
        const result = await pool.query(
            `
            SELECT * FROM depenses OREDER BY id DESC
            `
        );
        return result.rows;
    },

    // Affichage avec filtre des depenses 
    async findById(id: number){
        const result = await pool.query("SELECT * FROM depenses WHERE id=$1", [id]);
        return result.rows[0];
    },

    // Mise a jour des depenses 
    async update(id: number, depense: Depense){
        const result = await pool.query(`
            UPDATE depense SET libelle=$1, description=$2, montant=$3
            WHERE id=$4 RETURNING *
        `,[
            depense.libelle,
            depense.montant,
            depense.description,
            id
        ]);

        return result.rows[0];
    },

    // Suppression depenses 
    async delete(id:number){
        const result = await pool.query(`
            DELETE depense WHERE id=$1
        `, [id]);

        return result.rows[0];
    }
}