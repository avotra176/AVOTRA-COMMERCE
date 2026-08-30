import { useCallback, useEffect, useState } from 'react';
import { getFournisseur, createFournisseur, updateFournisseur, deleteFournisseur } from '../services/fournisseur.services';
import { Fournisseur, CreateFournisseur, UpdateFournisseur } from '../types/fournisseur.types';

export const useFournisseurs = () => {
    const [fournisseurs, setFournisseur] = useState<Fournisseur[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // charger les fournisseurs 

    const fetchFournisseurs = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getFournisseur();
            setFournisseur(data);
        } catch (err: any) {
            console.log("Erreur chargement fournisseurs :", err?.response?.data || err);
            setError(err?.response?.data?.message || "Impossible de charger les fournisseurs.");

        } finally {
            setLoading(false);
        }
    }, []);

    // chargement automatique
    useEffect(() => {
        fetchFournisseurs();
    }, [fetchFournisseurs]);

    // ajouter 
    const addFournisseur = async (data: CreateFournisseur) => {
        try {
            setError(null);
            const nouveauFournisseur = await createFournisseur(data);

            setFournisseur((prev) => [nouveauFournisseur, ...prev,]);
            return nouveauFournisseur;
        }
        catch (err: any) {
            console.log("Erreur ajout fournisseur :", err?.response?.data || err);
            setError(err?.response?.data || "Impossible d'ajouter le fournisseur.");
            throw err;
        }
    };

    // modifier 
    const editFournisseur = async (id: number, data: UpdateFournisseur) => {
        try {
            setError(null);
            const fournisseurModifie = await updateFournisseur(id, data);
            setFournisseur((prev) => prev.map((fournisseur) => fournisseur.id === id ? fournisseurModifie : fournisseur));
            return fournisseurModifie;
        } catch (err: any) {
            console.log("Erreur modification fournisseur :", err?.response?.data || err);
            throw err;
        }
    };

    //    supprimer
    const removeFournisseur = async (id: number) => {
        try {
            setError(null);
            await deleteFournisseur(id);
            setFournisseur((prev) => prev.filter((fournisseur) => fournisseur.id !== id));
        } catch (err: any) {
            console.log("Erreur lors de suppression fournisseurs :", err?.response?.data || err);
            setError(err?.response?.data?.message || "impossible de supprimer le fournisseur.");
            throw err;
        }

    };

    return {
        fournisseurs,
        loading,
        error,

        fetchFournisseurs,
        addFournisseur,
        editFournisseur,
        removeFournisseur,
    };
}

