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
  } catch (error) {
    console.error("Erro ao buscar os valores:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteGastos = async (ids, token) => {
  try {
    const config = {
      ...getAuthConfig(token),
      data: ids
    };

    const response = await axios.delete(API_CONFIG.gastos.deleteBatch, config);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar gastos:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteCategoria = async (id, token) => {
  try {
    const config = getAuthConfig(token);

    const response = await axios.delete(API_CONFIG.categories.delete(id), config);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar categoria:", error.response?.data || error.message);
    throw error;
  }
};