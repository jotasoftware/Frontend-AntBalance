import { API_CONFIG } from '../config/apiConfig';
import axios from 'axios';

const getAuthConfig = (token) => {
  return { headers: { Authorization: `Bearer ${token}` } };
}

export const createGasto = async (credentials, token) => {
    try{
      const config = getAuthConfig(token);
      const response = await axios.post(API_CONFIG.expenses.create, credentials, config);
      return response.data;
    }catch(error){
      console.error("Erro no serviço de criar gasto: ", error.response?.data || error.message);
      throw error;
    }
}

export const createCategoria = async (credentials, token) => {
  try{
    console.log(credentials)
    const config = getAuthConfig(token);
    const response = await axios.post(API_CONFIG.categories.create, credentials, config);
    return response.data;
  }catch(error){
    console.error("Erro no serviço de criar categoria: ", error.response?.data || error.message);
    throw error;
  }
}

export const fetchGastos = async (token) => {
  try {
    const config = getAuthConfig(token);
    const response = await axios.get(API_CONFIG.expenses.getAll, config);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar gastos:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchGastosInativos = async (token) => {
  try {
    const config = getAuthConfig(token);
    const response = await axios.get(API_CONFIG.expenses.getAll, config);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar gastos:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchCategorias = async (token) => {
  try {
    const config = getAuthConfig(token);
    const response = await axios.get(API_CONFIG.categories.getAll, config);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar categorias:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchValores = async (token) => {
  try {
    const config = getAuthConfig(token);
    const response = await axios.get(API_CONFIG.expenses.getValores, config);
    return response.data;
    // return {
    //     "2025-07": 1741.68,
    //     "2025-08": 1741.68,
    //     "2025-09": 1741.68,
    //     "2025-10": 791.67,
    //     "2025-11": 791.67,
    //     "2025-12": 791.67,
    //     "2026-01": 791.67,
    //     "2026-02": 791.67,
    //     "2026-03": 791.67,
    //     "2026-04": 791.67,
    //     "2026-05": 791.67,
    //     "2026-06": 791.67
    // }
  } catch (error) {
    console.error("Erro ao buscar os valores:", error.response?.data || error.message);
    throw error;
  }
};