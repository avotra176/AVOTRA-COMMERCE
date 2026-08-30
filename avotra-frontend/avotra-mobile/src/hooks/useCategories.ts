import { useCallback, useEffect, useState } from "react";
import { Categorie, CreateCategorie, UpdateCategorie, } from "../types/categorie.types";
import { CategorieService } from "../services/categorie.services";

export const useCategories = () => {

    const [categories, setCategories] = useState<Categorie[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // GET ALL
    const fetchCategories = useCallback(
        async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await CategorieService.getAll();
                setCategories(data);

            } catch (error: any) {

                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Impossible de récupérer les catégories";

                setError(message);

            } finally {
                setLoading(false);
            }
        },
        []
    );

    // GET BY ID
    const getCategorieById = useCallback(
        async (
            id: number
        ): Promise<Categorie | null> => {

            try {
                setError(null);
                return await CategorieService.getById(id);

            } catch (error: any) {
                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Catégorie introuvable";

                setError(message);

                return null;
            }
        },
        []
    );

    // CREATE
    const createCategorie = useCallback(
        async (
            data: CreateCategorie
        ): Promise<Categorie | null> => {

            try {

                setLoading(true);
                setError(null);
                const newCategorie = await CategorieService.create(data);
                setCategories(
                    previous => [
                        newCategorie,
                        ...previous,
                    ]
                );

                return newCategorie;
            } catch (error: any) {

                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Impossible de créer la catégorie";

                setError(message);

                return null;

            } finally {
                setLoading(false);
            }
        },
        []
    );

    // UPDATE
    const updateCategorie = useCallback(
        async (
            id: number,
            data: UpdateCategorie
        ): Promise<Categorie | null> => {

            try {

                setLoading(true);
                setError(null);

                const updatedCategorie =
                    await CategorieService.update(
                        id,
                        data
                    );

                setCategories(
                    previous =>
                        previous.map(category =>
                            category.id === id
                                ? updatedCategorie
                                : category
                        )
                );

                return updatedCategorie;

            } catch (error: any) {

                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Impossible de modifier la catégorie";

                setError(message);

                return null;

            } finally {
                setLoading(false);
            }
        },
        []
    );

    // DELETE
    const deleteCategorie = useCallback(
        async (
            id: number
        ): Promise<boolean> => {

            try {
                setLoading(true);
                setError(null);
                await CategorieService.delete(id);

                setCategories(previous => previous.filter(category => category.id !== id));

                return true;

            } catch (error: any) {
                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Impossible de supprimer la catégorie";
                setError(message);
                return false;

            } finally {
                setLoading(false);
            }
        },
        []
    );

    // CHARGEMENT INITIAL
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // RETURN
    return {
        categories,
        loading,
        error,
        fetchCategories,
        getCategorieById,
        createCategorie,
        updateCategorie,
        deleteCategorie,
    };
};