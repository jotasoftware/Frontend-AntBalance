import { API_CONFIG } from '../config/apiConfig';
import axios from 'axios';

const getAuthConfig = (token) => {
  return { headers: { Authorization: `Bearer ${token}` } };
}

export const createSplit = async (credentials, token) => {
  try{
    const config = getAuthConfig(token);
    const response = await axios.post(API_CONFIG.split.create, credentials, config);
    return response.data;
  }catch(error){
    console.error("Erro no serviço de criar divisão: ", error.response?.data || error.message);
    throw error;
  }
}

export const fetchSplitGastos = async (token) => {
  try {
    const config = getAuthConfig(token);
    const response = await axios.get(API_CONFIG.split.getAll, config);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar gastos divididos:", error.response?.data || error.message);
    throw error;
  }
};

export const acceptSplit = async (credentials, token) => {
  try {
    const config = getAuthConfig(token);
    const response = await axios.post(API_CONFIG.split.accept, credentials, config);
    return response.data;
  } catch (error) {
    console.error("Erro ao aceitar gasto dividido:", error.response?.data || error.message);
    throw error;
  }
};

export const refuseSplit = async (credentials, token) => {
  try {
    const config = {
      ...getAuthConfig(token),
      data: credentials,
    };
    const response = await axios.delete(API_CONFIG.split.refuse, config);
    return response.data;
  } catch (error) {
    console.error("Erro ao recusar gasto dividido:", error.response?.data || error.message);
    throw error;
  }
};