import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config/api";

interface User {
  id: number;
  nom?: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, mot_de_passe: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Charger la session sauvegardée
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("token");
        const savedUser = await AsyncStorage.getItem("user");

        if (savedToken) {
          setToken(savedToken);
        }

        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error: unknown) {
        console.log("Erreur chargement auth :", error);
      } finally {
        setLoading(false);
      }
    };

    loadAuth();
  }, []);

  // Connexion
  const login = async (email: string, mot_de_passe: string) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        {
          email,
          mot_de_passe,
        }
      );

      const receivedToken = response.data.token;
      const receivedUser = response.data.user;

      if (!receivedToken) {
        throw new Error("Token non reçu par le serveur");
      }

      await AsyncStorage.setItem("token", receivedToken);

      if (receivedUser) {
        await AsyncStorage.setItem(
          "user",
          JSON.stringify(receivedUser)
        );
      }

      setToken(receivedToken);
      setUser(receivedUser ?? null);

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const apiMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Erreur inconnue";

        console.log("Erreur login :", apiMessage);
        throw new Error(apiMessage);
      }

      const fallbackMessage =
        error instanceof Error ? error.message : "Erreur de connexion";

      console.log("Erreur login :", fallbackMessage);
      throw new Error(fallbackMessage);
    }
  };

  // Déconnexion
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      `useAuth doit être utilisé à l'intérieur de AuthProvider`
    );
  }

  return context;
};