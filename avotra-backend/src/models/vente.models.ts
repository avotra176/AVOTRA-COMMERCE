// src/models/VenteModel.ts
import { pool } from "../config/database";
import { Vente, CreateVente } from "../types/vente.types";

export const VenteModel = {
  async create(vente: CreateVente): Promise<Vente> {
    const result = await pool.query(
      `INSERT INTO ventes (produit_id, utilisateur_id, quantite, prix_unitaire, montant_total, date_vente)
       VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
      [
        vente.produit_id,
        vente.utilisateur_id,
        vente.quantite,
        vente.prix_unitaire,
        vente.montant_total,
      ]
    );
    return result.rows[0];
  },

  async findAll() : Promise<Vente[]> {
    const result = await pool.query("SELECT * FROM ventes ORDER BY id DESC");
    return result.rows;
  },

  async findById(id: number) : Promise<Vente | null> {
    const result = await pool.query("SELECT * FROM ventes WHERE id = $1", [id]);
    return result.rows[0] ?? null;
  },

  async update(id: number, vente: CreateVente): Promise<Vente | null> {
    const result = await pool.query(
      `UPDATE ventes SET produit_id=$1, utilisateur_id=$2, quantite=$3, prix_unitaire=$4, montant_total=$5
       WHERE id=$6 RETURNING *`,
      [
        vente.produit_id,
        vente.utilisateur_id,
        vente.quantite,
        vente.prix_unitaire,
        vente.montant_total,
        id,
      ]
    );
    return result.rows[0];
  },

  async delete(id: number): Promise<Vente | null> {
    const result = await pool.query("DELETE FROM ventes WHERE id=$1 RETURNING *", [id]);
    return result.rows[0] ?? null;
  },

  async checkStock(produitId: number) : Promise<{ id: number; stock: number } | null> {
    const result = await pool.query("SELECT id, stock FROM produits WHERE id = $1", [produitId]);
    return result.rows[0] ?? null;
  },

  async decrementStock(produitId: number, quantite: number): Promise<{ id: number; stock: number } | null> {
    const result = await pool.query(
      `UPDATE produits SET stock = stock - $1 WHERE id = $2 RETURNING *`,
      [quantite, produitId]
    );
    return result.rows[0] ?? null;
  },

  async incrementStock(produitId: number, quantite: number): Promise<{ id: number; stock: number } | null> {
    const result = await pool.query(
      `UPDATE produits SET stock = stock + $1 WHERE id = $2 RETURNING *`,
      [quantite, produitId]
    );
    return result.rows[0] ?? null;
  },

  async createMouvement(produitId: number, type: string, quantite: number): Promise<void> {
    await pool.query(
      `INSERT INTO mouvements (produit_id, type_mouvement, quantite, date_mouvement)
       VALUES ($1, $2, $3, NOW())`,
      [produitId, type, quantite]
    );
  },
};
