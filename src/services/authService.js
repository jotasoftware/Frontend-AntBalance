import { API_CONFIG } from '../config/apiConfig';
import axios from 'axios';

const getAuthConfig = (token) => {
  return { headers: { Authorization: `Bearer ${token}` } };
}

export const login = async (credentials) => {
    try{
      const response = await axios.post(API_CONFIG.auth.login, credentials);
      return response.data;
    }catch(error){
      console.error("Erro no serviço de login:", error.response?.data || error.message);
      throw error;
    }
}
  

export const register = async (userData) => {
    try{
        const response = await axios.post(API_CONFIG.auth.register, userData);
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
      const response = await axios.post(API_CONFIG.auth.recover, payloadParaAPI);
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
      const response = await axios.patch(API_CONFIG.auth.edit, payloadParaAPI, config);
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
      const response = await axios.post(API_CONFIG.auth.editPassword, payloadParaAPI);
      return response.data;
  }catch(error){
      console.error("Erro no serviço de registro:", error.response?.data || error.message);
      throw error;
  }
};