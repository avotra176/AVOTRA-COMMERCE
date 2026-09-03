import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';
import { CreateAchat, Achat } from '../types/achat.types';


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
};

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
};

// Affichage toutes les achats
export const getAchats = async (): Promise<Achat[]> => {
    const headers = await getHeaders();
    const response = await api.get<ApiResponse<Achat[]>>('/achats', { headers });
    console.log("Réponse API achats:", response.data);
    return response.data.data;
};

// recherche un achat par nom ou par date 
export const searchAchats = async (value: string): Promise<Achat[]> => {
    const headers = await getHeaders();
    const search = value.trim();

    const response = await api.get<ApiResponse<Achat[]>>('/achats/recherche', { headers, params: { search } });
    console.log("Réponse API recherche achats:", response.data);
    return response.data.data;
};

// ajout d'un achat
export const createAchat = async (achat: CreateAchat): Promise<Achat> => {
    const headers = await getHeaders();
    const response = await api.post<ApiResponse<Achat>>('/achats', achat, { headers });
    console.log("Réponse API création achat:", response.data);
    return response.data.data;
};

// modifier un achat
export const updateAchat = async (id: number, data: CreateAchat,): Promise<Achat> => {
    const headers = await getHeaders();
    const response = await api.put<ApiResponse<Achat>>(`/achats/${id}`, data, { headers });
    return response.data.data;
}

// supprimer un achats 
export const deleteAchat = async (id: number): Promise<void> => {
    const headers = await getHeaders();
    await api.delete(`/achats/${id}`, { headers });
};

