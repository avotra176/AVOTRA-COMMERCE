import { useCallback, useEffect, useState } from 'react';
import { getVentes, createVente, updateVente, deleteVente } from '../services/vente.service';
import { Vente, CreateVente } from '../types/vente.types';

export const useVentes = () => {
    const [ventes, setVentes] = useState<Vente[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchVentes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getVentes();
            setVentes(data);
        } catch (err: any) {
            console.log("Erreur chargement ventes :", err?.response?.data || err);
            setError(err?.response?.data?.message || "Impossible de charger les ventes.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVentes();
    }, [fetchVentes]);

    const addVente = async (data: CreateVente) => {
        try {
            setError(null);
            const nouvelleVente = await createVente(data);
            setVentes((prev) => [nouvelleVente, ...prev]);
            return nouvelleVente;
        } catch (err: any) {
            console.log("Erreur ajout vente :", err?.response?.data || err);
            setError(err?.response?.data?.message || "Impossible d'ajouter la vente.");
            throw err;
        }
    };

    const editVente = async (id: number, data: CreateVente) => {
        try {
            setError(null);
            const venteModifiee = await updateVente(id, data);
            setVentes((prev) =>
                prev.map((vente) => (vente.id === id ? venteModifiee : vente))
            );
            return venteModifiee;
        } catch (err: any) {
            console.log("Erreur modification vente :", err?.response?.data || err);
            throw err;
        }
    };

    const removeVente = async (id: number) => {
        try {
            setError(null);
            await deleteVente(id);
            setVentes((prev) => prev.filter((vente) => vente.id !== id));
        } catch (err: any) {
            console.log("Erreur suppression vente :", err?.response?.data || err);
            setError(err?.response?.data?.message || "Impossible de supprimer la vente.");
            throw err;
        }
    };

    return {
        ventes,
        loading,
        error,
        fetchVentes,
        addVente,
        editVente,
        removeVente,
    };
}