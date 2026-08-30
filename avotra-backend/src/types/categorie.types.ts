export interface Categorie {
    id: number;
    nom: string;
    description: string | null;
    created_at: string;
}


export interface CreateCategorie {
    nom: string;
    description?: string | null;
}

export interface UpdateCategorie {
    nom: string;
    description?: string | null;
}