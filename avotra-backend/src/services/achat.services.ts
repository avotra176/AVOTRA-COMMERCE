import { AchatModel } from "../models/achat.models";
import { CreateAchat } from "../types/achat.types";
import { ProduitModel } from "../models/produit.models";
import { Mouvement_stockModel } from "../models/mouvement_stock.models";

export const AchatService = {
    // AJOUTER UN ACHAT
    async createAchat(data: CreateAchat) {
        if (!data.produit_id) {
            throw new Error("Le produit est obligatoire");
        }

        if (!data.utilisateur_id) {
            throw new Error("L'utilisateur est obligatoire");
        }

        if (!data.fournisseur_id) {
            throw new Error("Le fournisseur est obligatoire");
        }

        if (data.quantite <= 0) {
            throw new Error(
                "La quantité doit être supérieure à 0"
            );
        }

        if (data.prix_unitaire <= 0) {
            throw new Error(
                "Le prix unitaire doit être supérieur à 0"
            );
        }

        const produit =
            await ProduitModel.getByIdProduit(
                data.produit_id
            );

        if (!produit) {
            throw new Error("Produit introuvable");
        }

        const montant_total =
            data.quantite * data.prix_unitaire;

        const achat = await AchatModel.createAchat(
            data,
            montant_total
        );

        // Augmenter le stock
        const nouveauStock =
            Number(produit.stock) + Number(data.quantite);

        await ProduitModel.updateStock(
            data.produit_id,
            nouveauStock
        );

        // Mouvement de stock
        await Mouvement_stockModel.createMouvement_stock({
            produit_id: data.produit_id,
            type_mouvement: "ENTRE",
            quantite: data.quantite,
            observation: "Achat de produit",
        });

        return achat;
    },

    // AFFICHER TOUS LES ACHATS
    async getAchat() {
        return await AchatModel.getAllAchat();
    },

    // AFFICHER UN ACHAT
    async getAchatById(id: number) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error("ID d'achat invalide");
        }

        const achat =
            await AchatModel.getByIdAchat(id);

        if (!achat) {
            throw new Error("Achat introuvable");
        }

        return achat;
    },

    // RECHERCHER
    async searchAchat(recherche: string) {
        const value = recherche.trim();

        if (!value) {
            return await AchatModel.getAllAchat();
        }

        return await AchatModel.searchAchat(value);
    },

    // MODIFIER UN ACHAT
    async updateAchat(
        id: number,
        data: CreateAchat
    ) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error("ID d'achat invalide");
        }

        if (!data.produit_id) {
            throw new Error("Le produit est obligatoire");
        }

        if (!data.fournisseur_id) {
            throw new Error("Le fournisseur est obligatoire");
        }

        if (data.quantite <= 0) {
            throw new Error(
                "La quantité doit être supérieure à 0"
            );
        }

        if (data.prix_unitaire <= 0) {
            throw new Error(
                "Le prix unitaire doit être supérieur à 0"
            );
        }

        const ancienAchat =
            await AchatModel.getByIdAchat(id);

        if (!ancienAchat) {
            throw new Error("Achat introuvable");
        }

        const ancienProduit =
            await ProduitModel.getByIdProduit(
                ancienAchat.produit_id
            );

        if (!ancienProduit) {
            throw new Error(
                "Ancien produit introuvable"
            );
        }

        const nouveauProduit =
            await ProduitModel.getByIdProduit(
                data.produit_id
            );

        if (!nouveauProduit) {
            throw new Error("Produit introuvable");
        }

        const montant_total =
            data.quantite * data.prix_unitaire;

        // CAS 1 : même produit
        if (
            ancienAchat.produit_id === data.produit_id
        ) {
            const difference =
                Number(data.quantite) -
                Number(ancienAchat.quantite);

            const nouveauStock =
                Number(ancienProduit.stock) + difference;

            if (nouveauStock < 0) {
                throw new Error(
                    "Stock insuffisant pour cette modification"
                );
            }

            await ProduitModel.updateStock(
                data.produit_id,
                nouveauStock
            );

            if (difference > 0) {
                await Mouvement_stockModel.createMouvement_stock({
                    produit_id: data.produit_id,
                    type_mouvement: "ENTRE",
                    quantite: difference,
                    observation:
                        "Augmentation d'un achat",
                });
            }

            if (difference < 0) {
                await Mouvement_stockModel.createMouvement_stock({
                    produit_id: data.produit_id,
                    type_mouvement: "SORTIE",
                    quantite: Math.abs(difference),
                    observation:
                        "Diminution d'un achat",
                });
            }
        }

        // CAS 2 : produit changé
        else {
            // Retirer l'ancien achat de l'ancien produit
            const ancienStock =
                Number(ancienProduit.stock) -
                Number(ancienAchat.quantite);

            if (ancienStock < 0) {
                throw new Error(
                    "Impossible de modifier : stock ancien insuffisant"
                );
            }

            await ProduitModel.updateStock(
                ancienAchat.produit_id,
                ancienStock
            );

            await Mouvement_stockModel.createMouvement_stock({
                produit_id: ancienAchat.produit_id,
                type_mouvement: "SORTIE",
                quantite: ancienAchat.quantite,
                observation:
                    "Annulation de l'ancien achat",
            });

            // Ajouter le nouvel achat au nouveau produit
            const nouveauStock =
                Number(nouveauProduit.stock) +
                Number(data.quantite);

            await ProduitModel.updateStock(
                data.produit_id,
                nouveauStock
            );

            await Mouvement_stockModel.createMouvement_stock({
                produit_id: data.produit_id,
                type_mouvement: "ENTRE",
                quantite: data.quantite,
                observation:
                    "Nouveau produit lors de modification d'achat",
            });
        }

        return await AchatModel.updateAchat(
            id,
            data,
            montant_total
        );
    },

    // SUPPRIMER UN ACHAT
    async deleteAchat(id: number) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error("ID d'achat invalide");
        }

        const achat =
            await AchatModel.getByIdAchat(id);

        if (!achat) {
            throw new Error("Achat introuvable");
        }

        const produit =
            await ProduitModel.getByIdProduit(
                achat.produit_id
            );

        if (!produit) {
            throw new Error("Produit introuvable");
        }

        const nouveauStock =
            Number(produit.stock) -
            Number(achat.quantite);

        if (nouveauStock < 0) {
            throw new Error(
                "Impossible de supprimer cet achat : stock insuffisant"
            );
        }

        // Retirer la quantité du stock
        await ProduitModel.updateStock(
            achat.produit_id,
            nouveauStock
        );

        // Mouvement de stock
        await Mouvement_stockModel.createMouvement_stock({
            produit_id: achat.produit_id,
            type_mouvement: "SORTIE",
            quantite: achat.quantite,
            observation:
                "Suppression d'un achat",
        });

        // Supprimer l'achat
        await AchatModel.deleteAchat(id);
    },
};