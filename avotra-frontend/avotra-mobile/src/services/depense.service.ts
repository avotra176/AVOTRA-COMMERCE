import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';
import { DepensePersonnelle, CreateDepensePersonnelle, UpdateDepensePersonnelle } from "../types/depense.types";

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

export const getDepenses = async (utilisateur_id: number): Promise<DepensePersonnelle[]> => {
    const headers = await getHeaders();
    const response = await api.get<ApiResponse<DepensePersonnelle[]>>(
        `/depenses-perso?utilisateur_id=${utilisateur_id}`,
        { headers }
    );
    return response.data.data;
}

export const createDepense = async (data: CreateDepensePersonnelle): Promise<DepensePersonnelle> => {
    const headers = await getHeaders();
    const response = await api.post<ApiResponse<DepensePersonnelle>>(`/depenses-perso`, data, { headers });
    return response.data.data;
}

export const updateDepense = async (
    id: number,
    utilisateur_id: number,
    data: UpdateDepensePersonnelle
): Promise<DepensePersonnelle> => {
    const headers = await getHeaders();
    const response = await api.put<ApiResponse<DepensePersonnelle>>(
        `/depenses-perso/${id}`,
        { ...data, utilisateur_id },
        { headers }
    );
    return response.data.data;
}

export const deleteDepense = async (id: number, utilisateur_id: number): Promise<void> => {
    const headers = await getHeaders();
    await api.delete(`/depenses-perso/${id}?utilisateur_id=${utilisateur_id}`, { headers });
}