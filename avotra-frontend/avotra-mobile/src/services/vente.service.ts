import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';
import { Vente, CreateVente } from "../types/vente.types";

const getToken = async (): Promise<string> => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    return token;
}

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

export const getVentes = async (): Promise<Vente[]> => {
    const headers = await getHeaders();
    const response = await api.get<ApiResponse<Vente[]>>("/ventes", { headers });
    return response.data.data;
}

export const getVenteById = async (id: number): Promise<Vente> => {
    const headers = await getHeaders();
    const response = await api.get<ApiResponse<Vente>>(`/ventes/${id}`, { headers });
    return response.data.data;
}

export const createVente = async (data: CreateVente): Promise<Vente> => {
    const headers = await getHeaders();
    const response = await api.post<ApiResponse<Vente>>(`/ventes`, data, { headers });
    return response.data.data;
}

export const updateVente = async (id: number, data: CreateVente): Promise<Vente> => {
    const headers = await getHeaders();
    const response = await api.put<ApiResponse<Vente>>(`/ventes/${id}`, data, { headers });
    return response.data.data;
}

export const deleteVente = async (id: number): Promise<void> => {
    const headers = await getHeaders();
    await api.delete(`/ventes/${id}`, { headers });
}