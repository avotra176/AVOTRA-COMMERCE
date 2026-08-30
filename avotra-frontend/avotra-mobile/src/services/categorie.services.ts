import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';
import {
    Categorie,
    CreateCategorie,
    UpdateCategorie,
    CategorieResponse,
    CategoriesResponse,
    DeleteCategorieResponse,
} from "../types/categorie.types";

// Recuperer le token d'authentification depuis AsyncStorage
const getToken = async (): Promise<string> => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    return token;
}

// Headers d'authentification
const getHeaders = async () => {
    const token = await getToken();
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
}

export const CategorieService = {

    // GET ALL CATEGORIES
    async getAll(): Promise<Categorie[]> {
        const headers = await getHeaders();
        const response = await api.get<CategoriesResponse>("/categories", { headers });

        if (!response.data.success) {
            throw new Error(
                response.data.message ||
                "Impossible de récupérer les catégories"
            );
        }

        return response.data.data;
    },

    // GET CATEGORIE BY ID
    async getById(id: number): Promise<Categorie> {

        if (!id || id <= 0) {
            throw new Error("ID de catégorie invalide");
        }
        const headers = await getHeaders();
        const response = await api.get<CategorieResponse>(`/categories/${id}`, { headers });

        if (!response.data.success) {
            throw new Error(
                response.data.message || "Catégorie introuvable"
            );
        }

        return response.data.data;
    },

    // CREATE CATEGORIE
    async create(
        data: CreateCategorie
    ): Promise<Categorie> {

        if (!data.nom || data.nom.trim() === "") {
            throw new Error(
                "Le nom de la catégorie est obligatoire"
            );
        }

        const headers = await getHeaders();
        const response = await api.post<CategorieResponse>("/categories",
            {
                nom: data.nom.trim(),
                description:
                    data.description?.trim() || null,
            }
        );

        if (!response.data.success) {
            throw new Error(
                response.data.message ||
                "Impossible de créer la catégorie"
            );
        }

        return response.data.data;
    },

    // UPDATE CATEGORIE
    async update(id: number, data: UpdateCategorie): Promise<Categorie> {

        if (!id || id <= 0) {
            throw new Error("ID de catégorie invalide");
        }

        if (!data.nom || data.nom.trim() === "") {
            throw new Error(
                "Le nom de la catégorie est obligatoire"
            );
        }
        const headers = await getHeaders();

        const response = await api.put<CategorieResponse>(
            `/categories/${id}`,
            {
                nom: data.nom.trim(),
                description:
                    data.description?.trim() || null,
            }, { headers }
        );

        if (!response.data.success) {
            throw new Error(
                response.data.message ||
                "Impossible de modifier la catégorie"
            );
        }

        return response.data.data;
    },

    // DELETE CATEGORIE
    async delete(
        id: number
    ): Promise<string> {

        if (!id || id <= 0) {
            throw new Error("ID de catégorie invalide");
        }

        const headers = await getHeaders();
        const response = await api.delete<DeleteCategorieResponse>(`/categories/${id}`, { headers });

        if (!response.data.success) {
            throw new Error(
                response.data.message ||
                "Impossible de supprimer la catégorie"
            );
        }

        return response.data.message;
    },
};