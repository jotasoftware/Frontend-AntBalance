import { API_CONFIG } from '../config/apiConfig';
import api from '@/config/apiClient';
import axios from 'axios';

const getAuthConfig = (token) => {
  return { headers: { Authorization: `Bearer ${token}` } };
}

export const login = async (credentials) => {
  try{
    const response = await api.post(API_CONFIG.auth.login, credentials);
    return response.data;
  }catch(error){
    console.error("Erro no serviço de login:", error.response?.data || error.message);
    throw error;
  }
}
  

export const register = async (credentials) => {
  try{
    const response = await api.post(API_CONFIG.auth.register, credentials);
    return response.data;
  }catch(error){
    console.error("Erro no serviço de registro:", error.response?.data || error.message);
    throw error;
  }
};

export const recover = async (email) => {
  try{
    const payloadParaAPI = {
      email: email.recoverEmail,
    };
    const response = await api.post(API_CONFIG.auth.recover, payloadParaAPI);
    return response.data;
  }catch(error){
    console.error("Erro no serviço de registro:", error.response?.data || error.message);
    throw error;
  }
};

export const edit = async (credentials, token) => {
  try{
    const payloadParaAPI = {
      name: credentials.nome,
      oldPassword: credentials.senhaAtual,
      newPassword: credentials.senhaNova
    };
    const config = getAuthConfig(token);
    const response = await api.patch(API_CONFIG.auth.edit, payloadParaAPI);
    return response.data;
  }catch(error){
    console.error("Erro no serviço de registro:", error.response?.data || error.message);
    throw error;
  }
};

export const editPassword = async (credentials) => {
  try{
    const payloadParaAPI = {
      token: credentials.token,
      newPassword: credentials.senhaNova,
    };
    const response = await api.post(API_CONFIG.auth.editPassword, payloadParaAPI);
    return response.data;
  }catch(error){
    console.error("Erro no serviço de registro:", error.response?.data || error.message);
    throw error;
  }
};