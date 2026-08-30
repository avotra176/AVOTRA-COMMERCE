export interface Achat {
    id: number;
    utilisateur_id: number;
    fournisseur_id: number;
    produit_id: number;
    quantite: number;
    prix_unitaire: number;
    montant_total: number;
    date_achat: string;
}

export interface CreateAchat {
    utilisateur_id: number;
    fournisseur_id: number;
    produit_id: number;
    quantite: number;
    prix_unitaire: number;
}

export interface FormState {
    produit_id: number;
    fournisseur_id: number;
    quantite: string;
    prix_unitaire: string;
}

export const initialForm: FormState = {
    produit_id: 0,
    fournisseur_id: 0,
    quantite: "",
    prix_unitaire: "",
};
