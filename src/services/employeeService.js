import { API_CONFIG } from '../config/apiConfig';
import api from '@/config/apiClient';

export const createFuncionario = async (credentials) => {
    try{
      const response = await api.post(API_CONFIG.employees.create, credentials);
      return response.data;
    }catch(error){
      console.error("Erro no serviço de criar funcionario: ", error.response?.data || error.message);
      throw error;
    }
}

export const createSetor = async (credentials) => {
  try{
    const response = await api.post(API_CONFIG.sectors.create, credentials);
    return response.data;
  }catch(error){
    console.error("Erro no serviço de criar setor: ", error.response?.data || error.message);
    throw error;
  }
}

export const fetchFuncionarios = async () => {
  try {
    const response = await api.get(API_CONFIG.employees.getAll);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar funcionarios:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchFuncionariosInativos = async () => {
  try {
    const response = await api.get(API_CONFIG.employees.getAllInactives);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar funcionarios inativos:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchSetores = async () => {
  try {
    const response = await api.get(API_CONFIG.sectors.getAll);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar setors:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchValores = async () => {
  try {
    const response = await api.get(API_CONFIG.employees.getValores);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar os valores:", error.response?.data || error.message);
    throw error;
  }
};

export const editarFuncionario = async (id, data) => {
  try {
    console.log(id, data)
    const response = await api.patch(API_CONFIG.employees.edit(id), data);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar funcionario:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteFuncionarios = async (ids) => {
  try {
    const config = {
      data: ids
    };

    const response = await api.delete(API_CONFIG.employees.delete, config);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar funcionarios:", error.response?.data || error.message);
    throw error;
  }
};

export const inactiveFuncionarios = async (ids) => {
  try {
    const response = await api.patch(API_CONFIG.employees.inactiveAll, ids);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar funcionarios:", error.response?.data || error.message);
    throw error;
  }
};

export const inactiveFuncionario = async (id) => {
  try {
    const response = await api.patch(API_CONFIG.employees.inactive(id), null);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar funcionario:", error.response?.data || error.message);
    throw error;
  }
};

export const activeFuncionario = async (id) => {
  try {
    const response = await api.patch(API_CONFIG.employees.active(id), null);
    return response.data;
  } catch (error) {
    console.error("Erro ao ativar funcionario:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteSetor = async (id) => {
  try {
    const response = await api.delete(API_CONFIG.sectors.delete(id));
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar setor:", error.response?.data || error.message);
    throw error;
  }
};

export const editarSetor = async (id, data) => {
  try {
    
    console.log(data)
    const response = await api.put(API_CONFIG.sectors.edit(id), data);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar funcionario:", error.response?.data || error.message);
    throw error;
  }
};

// export const gerarRelatorioPdf = async (ids, token) => {
//   try {
//     const config = {
//       headers: { 
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//       responseType: 'blob' 
//     };
    
//     console.log(ids)
  
//     const response = await api.post(API_CONFIG.relatorios.gerarPdf, { funcionarioIds: ids });
//     return response.data;
//   } catch (error) {
//     console.error('Erro ao gerar relatório:', error);
//     alert('Erro ao gerar relatório PDF');
//   } 
// };