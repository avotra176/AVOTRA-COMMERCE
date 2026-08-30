export interface CreateVente {
    produit_id: number;
    utilisateur_id: number;
    quantite: number;
    prix_unitaire: number;
    montant_total: number;
}
 
export interface Vente extends CreateVente{
    id: number;
    date_vente: Date;
}