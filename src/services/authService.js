import { API_CONFIG } from '../config/apiConfig';
import axios from 'axios';

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
      const response = await axios.post(API_CONFIG.auth.recover, email);
      return response.data;
  }catch(error){
      console.error("Erro no serviço de registro:", error.response?.data || error.message);
      throw error;
  }
};