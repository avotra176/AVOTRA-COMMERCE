export interface Vente {
    id: number;
    produit_id: number;
    utilisateur_id: number;
    quantite: number;
    prix_unitaire: number;
    montant_total: number;
    date_vente: string;
}

export interface CreateVente {
    produit_id: number;
    utilisateur_id: number;
    quantite: number;
    prix_unitaire: number;
    montant_total: number;
}

export interface FormState {
    produit_id: number | null;
    quantite: string;
    prix_unitaire: string;
}

export const initialForm: FormState = {
    produit_id: null,
    quantite: "",
    prix_unitaire: "",
};