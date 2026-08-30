export interface CreateAchat {
    utilisateur_id: number;
    fournisseur_id: number;
    produit_id: number;
    quantite: number;
    prix_unitaire: number;
}

export interface Achat extends CreateAchat {
    id: number;
    montant_total: number;
    date_achat: Date;
}