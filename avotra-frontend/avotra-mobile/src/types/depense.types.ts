export interface DepensePersonnelle {
    id: number;
    utilisateur_id: number;
    titre: string;
    montant: number;
    categorie: string | null;
    date_depense: string;
    observation: string | null;
    created_at: string;
}

export interface CreateDepensePersonnelle {
    utilisateur_id: number;
    titre: string;
    montant: number;
    categorie?: string;
    observation?: string;
}

export interface UpdateDepensePersonnelle {
    titre: string;
    montant: number;
    categorie?: string;
    observation?: string;
}

export interface DepenseFormState {
    titre: string;
    montant: string;
    categorie: string;
    observation: string;
}

export const initialDepenseForm: DepenseFormState = {
    titre: "",
    montant: "",
    categorie: "",
    observation: "",
};

export const CATEGORIES_DEPENSE = [
    "Nourriture",
    "Transport",
    "Logement",
    "Santé",
    "Loisirs",
    "Autre",
];