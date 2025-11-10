import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import api from "../api/api";
import { userService } from "../service/userServices";
import { IUser } from "../types/User";

interface AuthContextType {
  user: IUser | null;
  login: (email: string, senha: string) => Promise<void>;
  register: (email: string, senha: string, nome?: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário salvo e validar token
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("@floodzone:token");

        if (storedToken) {
          api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;

          try {
            const userData = await userService.getUser();
            setUser(userData); 
          } catch (err: any) {
            console.warn("Token inválido ou expirado:", err?.response?.status);
            await AsyncStorage.removeItem("@floodzone:token");
            await AsyncStorage.removeItem("@floodzone:user");
            delete api.defaults.headers.common["Authorization"];
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Erro ao carregar autenticação:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login
  const login = async (email: string, senha: string) => {
    try {
      const { token, user } = await userService.login({ email, senha });
      setUser(user);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await AsyncStorage.setItem("@floodzone:user", JSON.stringify(user));
      await AsyncStorage.setItem("@floodzone:token", token);
    } catch (err) {
      console.error("Erro no login:", err);
      throw err;
    }
  };

  // Registro
  const register = async (email: string, senha: string, nome?: string) => {
    try {
      const newUser = await userService.register({ email, senha, nome });
      setUser(newUser);
      await AsyncStorage.setItem("@floodzone:user", JSON.stringify(newUser));
    } catch (err) {
      console.error("Erro no registro:", err);
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await userService.logout();
    } catch {
    } finally {
      await AsyncStorage.removeItem("@floodzone:user");
      await AsyncStorage.removeItem("@floodzone:token");
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
      router.replace("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
