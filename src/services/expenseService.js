import { API_CONFIG } from '../config/apiConfig';
import api from '@/config/apiClient';

export const createGasto = async (credentials) => {
  try{
    const response = await api.post(API_CONFIG.expenses.create, credentials);
    return response.data;
  }catch(error){
    console.error("Erro no serviço de criar gasto: ", error.response?.data || error.message);
    throw error;
  }
}

export const createCategoria = async (credentials) => {
  try{
    const response = await api.post(API_CONFIG.categories.create, credentials);
    return response.data;
  }catch(error){
    console.error("Erro no serviço de criar categoria: ", error.response?.data || error.message);
    throw error;
  }
}

export const fetchGastos = async () => {
  try {
    const response = await api.get(API_CONFIG.expenses.getAll);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar gastos:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchGastosInativos = async () => {
  try {
    const response = await api.get(API_CONFIG.expenses.getAllInactives);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar gastos inativos:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchCategorias = async () => {
  try {
    const response = await api.get(API_CONFIG.categories.getAll);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar categorias:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchValores = async () => {
  try {
    const response = await api.get(API_CONFIG.expenses.getValores);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar os valores:", error.response?.data || error.message);
    throw error;
  }
};

export const editarGasto = async (id, data) => {
  try {
    const response = await api.patch(API_CONFIG.expenses.edit(id), data);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar gasto:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteGastos = async (ids) => {
  try {
    const config = {
      data: ids
    };

    const response = await api.delete(API_CONFIG.expenses.delete, config);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar gastos:", error.response?.data || error.message);
    throw error;
  }
};

export const inactiveGastos = async (ids) => {
  try {
    const response = await api.patch(API_CONFIG.expenses.inactiveAll, ids);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar gastos:", error.response?.data || error.message);
    throw error;
  }
};

export const inactiveGasto = async (id) => {
  try {
    const response = await api.patch(API_CONFIG.expenses.inactive(id), null);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar gasto:", error.response?.data || error.message);
    throw error;
  }
};

export const activeGasto = async (id) => {
  try {
    const response = await api.patch(API_CONFIG.expenses.active(id), null);
    return response.data;
  } catch (error) {
    console.error("Erro ao ativar gasto:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteCategoria = async (id) => {
  try {
    const response = await api.delete(API_CONFIG.categories.delete(id));
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar categoria:", error.response?.data || error.message);
    throw error;
  }
};

export const editarCategoria = async (id, data) => {
  try {
    const response = await api.put(API_CONFIG.categories.edit(id), data);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar gasto:", error.response?.data || error.message);
    throw error;
  }
};

export const gerarRelatorioPdf = async (ids, token) => {
  try {
    const config = {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      responseType: 'blob' 
    };
    
    console.log(ids)
  
    const response = await api.post(API_CONFIG.relatorios.gerarPdf, { gastoIds: ids }, config);
    return response.data;
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    alert('Erro ao gerar relatório PDF');
  } 
};