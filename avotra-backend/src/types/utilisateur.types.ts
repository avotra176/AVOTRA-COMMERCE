export interface CreateUtilisateur {
    nom: string;
    prenom: string;
    email: string;
    mot_de_passe: string;
    telephone: string;
    role: string;
}

export interface Utilisateur extends CreateUtilisateur{
    id: number;
    actif: boolean;
    created_at: Date;
}