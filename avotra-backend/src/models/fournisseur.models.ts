import { pool } from '../config/database';
import { Fournisseur, CreateFournisseur } from '../types/fournisseur.types';

export const fournisseurModel = {
    // Ajout fournisseur Model 
    async create(fournisseur: Fournisseur) {
        const result = await pool.query(`
            INSERT INTO fournisseurs (nom, adresse, contact, email, telephone, created_at)
            VALUES ($1, $2, ,$3, $4, $5, NOW()) RETURNING *
        `, [
            fournisseur.nom,
            fournisseur.adresse,
            fournisseur.contact,
            fournisseur.email,
            fournisseur.telephone,
            fournisseur.created_at,
        ]);
        return result.rows[0];
    },

    // Affichage touts le fournisseur de produit
    async findAll(){
        const  result = await 
        pool.query("SELECT * FROM fournisseurs ORDER BY id DESC");
        return result.rows;
    },

    //Affichage avec filtre par id fournisseurs 
    async findById(id: number) {
        const result = await pool.query("SELECT * FROM fournisseurs WHERE id = $1", [id]);
        return result.rows[0];
    },

    // Mise a jour de fournisseurs de produit
    async update(id: number, fournisseur: CreateFournisseur){
        const result = await pool.query(
            `
            UPDATE fournisseurs SET nom=$1, adresse=$2, contact=$3, email=$4, telephone=&5
            WHERE id=$6 RETURNING *
            `, [
                fournisseur.nom,
                fournisseur.adresse,
                fournisseur.contact,
                fournisseur.email,
                fournisseur.telephone,
                id,
            ]
        );
        return result.rows[0];
    },

    // Pour supprimer un fournisseurs 
    async delete(id:number){
        const result = await pool.query(
           "DELETE FROM fournisseurs WHERE id=$1 RETURNING *",[id]
        );
        return result.rows[0];
    }
}