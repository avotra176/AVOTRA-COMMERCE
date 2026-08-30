export interface Produit {
    id: number;
    categories_id: number;
    nom: string;
    description: string | undefined;
    prix_achat: number;
    prix_vente: number;
    unite: string;
    stock: number;
    created_at: string;
}

export interface CreateProduit {
    categories_id: number;
    nom: string;
    description: string | undefined;
    prix_achat: number;
    prix_vente: number;
    unite: string;
}

export interface UpdateProduit {
    categories_id: number;
    nom: string;
    description: string | undefined;
    prix_achat: number;
    prix_vente: number;
    unite: string;
}

export interface ProduitFormData {
    categories_id: number;
    nom: string;
    description: string | undefined;
    prix_achat: number;
    prix_vente: number;
    unite: string;
}

export const initialForm: ProduitFormData = {
    categories_id: 0,
    nom: "",
    description: "",
    prix_achat: 0,
    prix_vente: 0,
    unite: ""
};