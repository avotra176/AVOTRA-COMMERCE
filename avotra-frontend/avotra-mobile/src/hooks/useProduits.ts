import { useCallback, useEffect, useState } from "react";
import { Produit, CreateProduit, UpdateProduit } from "../types/produit.types";
import { ProduitService } from "../services/produit.services";

export const useProduits = () => {
    const [produits, setProduits] = useState<Produit[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");

    // charger les produits depuis le service
    const loadProduits = useCallback(async () => {
        try {
            setLoading(true); // ✅ avant de charger
            const data = await ProduitService.getAll();
            setProduits(data);
            setError(null);
        } catch (err: any) {
            setError(err.message ?? "Erreur lors du chargement");
        } finally {
            setLoading(false); // ✅ après avoir fini
        }
    }, []);

    // chargement initial des produits
    useEffect(() => {
        loadProduits();
    }, [loadProduits]);

    // actualiser les produits
    const refresh = async () => {
        setRefreshing(true);
        try {
            loadProduits();
        } finally {
            setRefreshing(false);
        }
    };

    // Rechrecher les produits par nom
    const searchProduits = async (value: string) => {
        setSearch(value);
        const data = await ProduitService.search(value);
        setProduits(data);
    };

    // creer un produit
    const createProduit = async (data: CreateProduit) => {
        const produit = await ProduitService.create(data);
        setProduits(previous => [produit, ...previous]);
        return produit;
    };

    // Modification d'un produit
    const updateProduit = async (id: number, data: UpdateProduit) => {
        const produit = await ProduitService.update(id, data);
        setProduits(previous => previous.map(item => item.id === id ? produit : item));
        return produit;
    };

    // Supprimer un produit
    const deleteProduit = async (id: number) => {
        await ProduitService.delete(id);
        setProduits(previous => previous.filter(item => item.id !== id));
    };

    return {
        produits,
        loading,
        refreshing,
        error,
        search,
        refresh,
        searchProduits,
        createProduit,
        updateProduit,
        deleteProduit
    };
};

