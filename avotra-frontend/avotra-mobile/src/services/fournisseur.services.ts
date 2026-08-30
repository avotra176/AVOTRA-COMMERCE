import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';
import { Fournisseur, CreateFournisseur, UpdateFournisseur } from "../types/fournisseur.types";

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

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

// affichage toutes les fournisseurs 
export const getFournisseur = async (): Promise<Fournisseur[]> => {
    const headers = await getHeaders();
    const response = await api.get<ApiResponse<Fournisseur[]>>("/fournisseurs", { headers });
    return response.data.data;
}

// affichage un fournisseur par id 
export const getFournisseurById = async (id: number): Promise<Fournisseur> => {
    const headers = await getHeaders();
    const response = await api.get<ApiResponse<Fournisseur>>(`/fournisseurs/${id}`, { headers });

    return response.data.data;
}

// ajout un fournisseur 
export const createFournisseur = async (data: CreateFournisseur): Promise<Fournisseur> => {
    const headers = await getHeaders();
    const response = await api.post<ApiResponse<Fournisseur>>(`/fournisseurs`, data, { headers });

    return response.data.data;
}

// modification de fournisseur
export const updateFournisseur = async (
    id: number,
    data: UpdateFournisseur,
): Promise<Fournisseur> => {
    const headers = await getHeaders();
    const response = await api.put<ApiResponse<Fournisseur>>(`/fournisseurs/${id}`, data, { headers });

    return response.data.data;
}

// supprimer un fournisseur 
export const deleteFournisseur = async (id: number): Promise<void> => {
    const headers = await getHeaders();
    await api.delete(`/fournisseurs/${id}`, { headers });
}
