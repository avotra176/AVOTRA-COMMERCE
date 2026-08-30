import { fournisseurModel } from '../models/fournisseur.models';
import { Fournisseur, CreateFournisseur } from '../types/fournisseur.types';


export const fournisseurService = {
    // Creation de fournisseurs
    async createfournisseur(data: Fournisseur){
        if (!data.nom || data.nom.trim() === ""){
            throw new Error("Le nom de la fournisseur est obligatoire");
        }
        return await fournisseurModel.create(data);
    },

    // Affichage toutes la fournisseurs 
    async getAll(){
        return await fournisseurModel.findAll();
    },

    // Affichage avec filtre par id de fournisseur 
     async getById(id: number){
        const fournisseur = await fournisseurModel.findById(id);
        if (!fournisseur){
            throw new Error("fournisseur introuvable");
        }
        return fournisseur;
     },

     // Mise a jour de fournisseur service 
     async updatefournisseur(
        id: number,
        data: CreateFournisseur
     ){
        const fournisseur = await fournisseurModel.findById(id);
        if (!fournisseur){
            throw new Error("fournisseur introuvable");
        }
        return await fournisseurModel.update(id, data);
     },

     // Effacer fournisseur 
     async deletefournisseur(id: number){
        const fournisseur = await fournisseurModel.findById(id);

        if (!fournisseur){
            throw new Error("fournisseur introuvable")
        }
        return await fournisseurModel.delete(id);
     }
}
