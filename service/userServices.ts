import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUser } from '../types/User';

const DIRECTORY = '/users'

const ENDPOINTS = {
  register: DIRECTORY+'/register', 
  login: DIRECTORY+'/login',       
  users: DIRECTORY,             
};

export const userService = {
  async register(payload: { email: string; senha: string; nome?: string }): Promise<IUser> {
    const res = await api.post(ENDPOINTS.register, payload);
    return res.data;
  },

  async login(payload: { email: string; senha: string }): Promise<{ token: string; user: IUser }> {
    const res = await api.post(ENDPOINTS.login, payload);
    // save token
    const token = res.data.token;
    if (token) await AsyncStorage.setItem('@floodzone:token', token);
    return res.data;
  },

  async logout() {
    await AsyncStorage.removeItem('@floodzone:token');
  },

  async getUser(): Promise<IUser> {
    const res = await api.get(ENDPOINTS.users);
    return res.data;
  },
};
