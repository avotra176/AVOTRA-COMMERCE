export interface CreateMouvementStock {    
    produit_id: number;
    type_mouvement: "ENTRE" | "SORTIE";
    quantite: number;    
    observation?: string;
}

export interface Mouvement_stock extends CreateMouvementStock{
    id?: number;
    date_mouvement: Date;
}