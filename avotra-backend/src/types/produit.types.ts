export interface CreateProduit {
    categories_id: number;
    nom: string;
    description: string | undefined;
    prix_achat: number;
    prix_vente: number;
    unite: string;
}

export interface Produit extends CreateProduit {
    id: number;
    stock: number;
    created_at: Date;
}