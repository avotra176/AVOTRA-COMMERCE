// src/services/vente.service.ts
import { VenteModel } from "../models/vente.models";
import { CreateVente } from "../types/vente.types";

export const VenteService = {
  // Creation de vente 
  async createVentes(data: CreateVente) {
    // calcule montant total de vente 
    const venteData: CreateVente = {
      ...data,
      montant_total: data.quantite * data.prix_unitaire,
    };

    // verification des stock
    const produit = await VenteModel.checkStock(data.produit_id);
    if (!produit || produit.stock < data.quantite) {
      throw new Error("Stock insuffisant");
    }

    const vente = await VenteModel.create(venteData);
    await VenteModel.decrementStock(data.produit_id, data.quantite);
    await VenteModel.createMouvement(data.produit_id, "SORTIE", data.quantite);

    return vente;
  },

  // Affichage toutes les ventes
  async getAll() {
    return await VenteModel.findAll();
  },

  // Affichage vente par Id
  async getById(id: number) {
    return await VenteModel.findById(id);
  },

  // Mettre a jour vente 
  async updateVentes(id: number, data: CreateVente) {
    const venteExistant = await VenteModel.findById(id);
    if (!venteExistant) {
      throw new Error("Vente introuvable");
    }

    const quantiteDiff = data.quantite - venteExistant.quantite;
    if (quantiteDiff > 0) {
      const produit = await VenteModel.checkStock(data.produit_id);
      if (!produit || produit.stock < quantiteDiff) {
        throw new Error("Stock insuffisant pour la mise à jour");
      }
      await VenteModel.decrementStock(data.produit_id, quantiteDiff);
      await VenteModel.createMouvement(data.produit_id, "SORTIE", quantiteDiff);
    } else if (quantiteDiff < 0) {
      await VenteModel.incrementStock(data.produit_id, Math.abs(quantiteDiff));
      await VenteModel.createMouvement(data.produit_id, "ENTREE", Math.abs(quantiteDiff));
    }

    const venteData: CreateVente = {
      ...data,
      montant_total: data.quantite * data.prix_unitaire,
    };

    return await VenteModel.update(id, venteData);
  },

  // Suppression vente 
  async deleteVentes(id: number) {
    const venteExistant = await VenteModel.findById(id);
    if (!venteExistant) {
      throw new Error("Vente introuvable");
    }

    await VenteModel.incrementStock(venteExistant.produit_id, venteExistant.quantite);
    await VenteModel.createMouvement(venteExistant.produit_id, "ENTREE", venteExistant.quantite);

    return await VenteModel.delete(id);
  },
};
