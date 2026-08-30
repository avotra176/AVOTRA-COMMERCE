export interface CreateDepense {
    libelle: string;
    montant: number;
    description: string;
}

export interface Depense extends CreateDepense{
    id: number;
    date_depenses: Date;
}