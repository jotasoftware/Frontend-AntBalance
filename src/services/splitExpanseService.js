import { API_CONFIG } from '../config/apiConfig';
import api from '@/config/apiClient';

export const createSplit = async (credentials) => {
  try{
    const response = await api.post(API_CONFIG.split.create, credentials);
    return response.data;
  }catch(error){
    console.error("Erro no serviço de criar divisão: ", error.response?.data || error.message);
    throw error;
  }
}

export const fetchSplitGastos = async () => {
  try {
    const response = await api.get(API_CONFIG.split.getAll);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar gastos divididos:", error.response?.data || error.message);
    throw error;
  }
};

export const acceptSplit = async (credentials) => {
  try {
    const response = await api.post(API_CONFIG.split.accept, credentials);
    return response.data;
  } catch (error) {
    console.error("Erro ao aceitar gasto dividido:", error.response?.data || error.message);
    throw error;
  }
};

export const refuseSplit = async (credentials) => {
  try {
    const config = {
      data: credentials,
    };
    const response = await api.delete(API_CONFIG.split.refuse);
    return response.data;
  } catch (error) {
    console.error("Erro ao recusar gasto dividido:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchPedidosList = async (id) => {
  try {
    const response = await api.get(API_CONFIG.split.list(id));
    return response.data;
  } catch (error) {
    console.error("Erro ao listar dados divididos:", error.response?.data || error.message);
    throw error;
  }
};