import { useCallback, useEffect, useState } from 'react';
import { getDepenses, createDepense, updateDepense, deleteDepense } from '../services/depense.service';
import { DepensePersonnelle, CreateDepensePersonnelle, UpdateDepensePersonnelle } from '../types/depense.types';

export const useDepenses = (utilisateur_id: number | undefined) => {
    const [depenses, setDepenses] = useState<DepensePersonnelle[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDepenses = useCallback(async () => {
        if (!utilisateur_id) return;
        try {
            setLoading(true);
            setError(null);
            const data = await getDepenses(utilisateur_id);
            setDepenses(data);
        } catch (err: any) {
            console.log("Erreur chargement dépenses :", err?.response?.data || err);
            setError(err?.response?.data?.message || "Impossible de charger les dépenses.");
        } finally {
            setLoading(false);
        }
    }, [utilisateur_id]);

    useEffect(() => {
        fetchDepenses();
    }, [fetchDepenses]);

    const addDepense = async (data: CreateDepensePersonnelle) => {
        try {
            setError(null);
            const nouvelle = await createDepense(data);
            setDepenses((prev) => [nouvelle, ...prev]);
            return nouvelle;
        } catch (err: any) {
            console.log("Erreur ajout dépense :", err?.response?.data || err);
            setError(err?.response?.data?.message || "Impossible d'ajouter la dépense.");
            throw err;
        }
    };

    const editDepense = async (id: number, data: UpdateDepensePersonnelle) => {
        if (!utilisateur_id) throw new Error("Utilisateur non connecté");
        try {
            setError(null);
            const modifiee = await updateDepense(id, utilisateur_id, data);
            setDepenses((prev) => prev.map((d) => (d.id === id ? modifiee : d)));
            return modifiee;
        } catch (err: any) {
            console.log("Erreur modification dépense :", err?.response?.data || err);
            throw err;
        }
    };

    const removeDepense = async (id: number) => {
        if (!utilisateur_id) throw new Error("Utilisateur non connecté");
        try {
            setError(null);
            await deleteDepense(id, utilisateur_id);
            setDepenses((prev) => prev.filter((d) => d.id !== id));
        } catch (err: any) {
            console.log("Erreur suppression dépense :", err?.response?.data || err);
            setError(err?.response?.data?.message || "Impossible de supprimer la dépense.");
            throw err;
        }
    };

    return {
        depenses,
        loading,
        error,
        fetchDepenses,
        addDepense,
        editDepense,
        removeDepense,
    };
}