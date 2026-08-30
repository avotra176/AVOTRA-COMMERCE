import { Request , Response} from 'express';
import { DepenseServise } from '../services/depense.services';

// Creation de fournissaur controllers 
export const createDepense = async (req: Request, res: Response)=>{
    try{
        const fournisseur = await DepenseServise.createDepense(req.body);
        res.status(201).json({
            success: true,
            message: "Fournisseurs ajoutee avec succes.",
            data: fournisseur,
        });
    }
    catch (error: any){
        return res.status(400).json({
            success: false,
            message: error.message,
        })
    }
};

// Affichage toutes les fournisseurs controllers
export const getDepense = async (res: Response)=>{
    try{
        const fournisseur = await DepenseServise.getALL();
        res.status(200).json({
            success: true,
            data: fournisseur,
        })
    }
    catch (error: any){
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


// Affichage fournisseur par id 
export const getDepenseById = async (req: Request, res: Response)=>{
    try{
        const fournisseur = await DepenseServise.getById(Number(req.params.id));
        if (!fournisseur){
            return res.status(404).json({
                success: false,
                message: "Fournisseur introuvable.",
            });

        }
        res.status(200).json({
            success: true,
            data: fournisseur,
        })
    }
    catch (error: any){
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Mise a jour de fournisseur id 
export const updateDepense = async (req:Request, res:Response)=>{
    try{
        const fournisseur = await DepenseServise.updateDepenseService(Number(req.params.id), req.body);
        res.status(200).json({
            success: true,
            message: "Fournisseur modifie avec succes.",
            data: fournisseur,
        })
    }
    catch (error: any){
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


// Suppression de fournisseurs 
export const deleteDepense = async (req:Request, res:Response)=>{
    try{
        await DepenseServise.deleteDepense(Number(req.params.id));
        res.status(200).json({
            success: true,
            message: "Fournisseur supprimer avec succes",
        });
    }
    catch (error: any){
        return res.status(500).json({
            seuccess: false,
            message: error.message,
        });
    }
};