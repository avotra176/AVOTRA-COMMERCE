import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';

interface RegisterPayload {
    nom: string;
    prenom: string;
    email: string;
    mot_de_passe: string;
    telephone: string;
    role: string;
}

const getHeaders = async () => {
    const token = await AsyncStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
};

export const changePassword = async (ancien_mot_de_passe: string, nouveau_mot_de_passe: string) => {
    const headers = await getHeaders();
    const response = await api.put(
        '/auth/change-password',
        { ancien_mot_de_passe, nouveau_mot_de_passe },
        { headers }
    );
    return response.data;
};

export const registerUser = async (data: RegisterPayload) => {
    const headers = await getHeaders();
    const response = await api.post('/auth/register', data, { headers });
    return response.data;
};