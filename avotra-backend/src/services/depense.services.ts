import { DepenseModel } from '../models/depenses.models';
import { Depense, CreateDepense } from '../types/depenses.types';

export const DepenseServise = {
    // Creation de depenses service 
    async createDepense(data: Depense){
        if(!data.libelle|| data.libelle.trim()===""){
            throw new Error("La libelle de depenese est obligatoire");
        }
        return await DepenseModel.create(data);
    },

    // Affichage toutes les depense services
    async getALL(){
        return await DepenseModel.findAll();
    },

    // Affichage avec filtre par Id de depenses 
    async getById(id: number){
        const depense = await DepenseModel.findById(id);
        if (!depense){
            throw new Error("Depenses introuvable");
        }
        return depense;
    },

    // Mise a jours de depenses deja enregistrer evec un petite erreur 
    async updateDepenseService(id:number, data:Depense){
        const depense = await DepenseModel.findById(id);
        if (!depense){
            throw new Error("Depenses introuvable");
        }
        return await DepenseModel.update(id, data);
    },

    // Effacer depenses 
    async deleteDepense(id: number){
        const depense = await DepenseModel.findById(id);
        if(!depense){
            throw new Error("Depenses introuvable");
        }
        return DepenseModel.delete(id);
    }
}