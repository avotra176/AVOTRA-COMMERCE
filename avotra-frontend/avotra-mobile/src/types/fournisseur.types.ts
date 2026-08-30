export interface Fournisseur {
    id: number;
    nom: string;
    contact: string;
    telephone: string;
    email: string;
    adresse: string;
    created_at: string;
}

export interface CreateFournisseur {
    nom: string;
    contact: string;
    telephone: string;
    email: string;
    adresse: string;
}

export interface UpdateFournisseur {
    nom: string;
    contact: string;
    telephone: string;
    email: string;
    adresse: string
}