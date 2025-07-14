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

export const editarGasto = async (id, data, token) => {
  try {
    const config = getAuthConfig(token);
    const payload = {
      descricao: data.descricao,
      valorTotal: data.valorTotal,
      categoriaId: data.categoriaId,
      parcelado: data.parcelado,
      fonte: data.fonte,
      numeroParcelas: data.numeroParcelas,
      data: data.data
    };

    const response = await axios.update(`${API_CONFIG.expenses.base}/${id}`, payload, config);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar gasto:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteGastos = async (ids, token) => {
  try {
    const config = {
      ...getAuthConfig(token),
      data: ids
    };
    console.log(config)

    const response = await axios.delete(API_CONFIG.expenses.delete, config);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar gastos:", error.response?.data || error.message);
    throw error;
  }
};

export const inactiveGastos = async (ids, token) => {
  try {
    const config = getAuthConfig(token);
    const response = await axios.patch(API_CONFIG.expenses.inactiveAll, ids, config);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar gastos:", error.response?.data || error.message);
    throw error;
  }
};

export const inactiveGasto = async (id, token) => {
  try {
    const config = getAuthConfig(token);
    const response = await axios.patch(API_CONFIG.expenses.inactive(id), null, config);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar gasto:", error.response?.data || error.message);
    throw error;
  }
};

export const activeGasto = async (id, token) => {
  try {
    const config = getAuthConfig(token);
    const response = await axios.patch(API_CONFIG.expenses.active(id), null, config);
    return response.data;
  } catch (error) {
    console.error("Erro ao ativar gasto:", error.response?.data || error.message);
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

export const gerarRelatorioPdf = async (payload, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        dataInicio: payload.dataInicio,
        dataFim: payload.dataFim,
        tipoRelatorio: payload.tipoRelatorio
      },
      responseType: 'blob'
    };
    
    const response = await axios.get(API_CONFIG.relatorios.gerarPdf, config);
    return response.data;
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    alert('Erro ao gerar relatório PDF');
  } 
};