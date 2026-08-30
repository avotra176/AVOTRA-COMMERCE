import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';
import { CreateProduit, Produit } from '../types/produit.types';

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

// produit services
export const ProduitService = {

    // afficher tous les produits
    async getAll(): Promise<Produit[]> {
        const headers = await getHeaders();
        const response = await axios.get(`${API_URL}/produits`, { headers });
        console.log("Réponse API produits:", response.data);

        if (Array.isArray(response.data)) {
            return response.data;
        }
        return response.data.data ?? [];
    },

    // Afficher un produit par ID
    async getById(id: number): Promise<Produit> {
        const headers = await getHeaders();
        const response = await axios.get(`${API_URL}/produits/${id}`, { headers });

        return response.data.data;
    },

    // Rechercher un produit par nom
    async search(value: string): Promise<Produit[]> {
        const search = value.trim();
        if (!search) { return this.getAll(); }
        const headers = await getHeaders();
        const response = await axios.get(`${API_URL}/produits/recherche`, { headers, params: { search } });

        if (Array.isArray(response.data)) {
            return response.data;
        }
        return response.data.data ?? [];
    },

    // Creer un produit
    async create(data: CreateProduit): Promise<Produit> {
        const headers = await getHeaders();
        const response = await axios.post(`${API_URL}/produits`, data, { headers });
        return response.data.data;
    },

    // Modifier un produit
    async update(id: number, data: CreateProduit): Promise<Produit> {
        const headers = await getHeaders();
        const response = await axios.put(`${API_URL}/produits/${id}`, data, { headers });
        return response.data.data;
    },

    // Supprimer un produit
    async delete(id: number): Promise<void> {
        const headers = await getHeaders();
        await axios.delete(`${API_URL}/produits/${id}`, { headers });
    }
}



