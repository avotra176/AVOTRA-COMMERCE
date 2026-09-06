import { Request, Response } from "express";
import { AuthService } from '../services/auth.services';

// Inscription 
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await AuthService.register(req.body);
        res.status(201).json({
            success: true,
            message: "Utilisateur cree avec succes.",
            data: user,
        })
    }
    catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
// Login
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("BODY LOGIN", req.body);
        const { email, mot_de_passe } = req.body;
        const login = await AuthService.login(email, mot_de_passe);
        res.status(200).json({
            success: true,
            message: " Connexion succes.",
            token: login.token,
            user: login.user,
        });
    }
    catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// profil de l'utilisateur connecte
export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        res.status(200).json({
            success: true,
            user: req.user,
        })
    }
    catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Changer le mot de passe
export const changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;
        const { ancien_mot_de_passe, nouveau_mot_de_passe } = req.body;

        await AuthService.changePassword(userId, ancien_mot_de_passe, nouveau_mot_de_passe);

        res.status(200).json({
            success: true,
            message: "Mot de passe modifié avec succès.",
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};