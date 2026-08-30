export interface CreateFournisseur {
    nom: string;
    contact: string;
    telephone: string;
    email: string;
    adresse: string;
}

export interface Fournisseur extends CreateFournisseur{
    id: number;
    created_at: Date;
}