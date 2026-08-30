export interface Categorie {
    id: number;
    nom: string;
    description: string | null;
    created_at: string;
}

export interface CreateCategorie {
    nom: string;
    description: string | null;
}

export interface UpdateCategorie {
    nom: string;
    description: string | null;
}

export interface CategorieFormData {
    nom: string;
    description: string | null;
}

export interface CategorieResponse {
    success: boolean;
    data: Categorie;
    message?: string;
}
export interface CategoriesResponse {
    success: boolean;
    data: Categorie[];
    message?: string;
}
export interface DeleteCategorieResponse {
    success: boolean;
    message: string;
}