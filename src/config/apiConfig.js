const URL = 'http://localhost:8080';

export const API_CONFIG = {
    auth: {
        login: `${URL}/auth/login`,
        register: `${URL}/auth/register`,
        edit: `${URL}/user`,
        recover: `${URL}/password-recovery/request`,
        editPassword: `${URL}/password-recovery/confirm`,
    },
    expenses: {
        getAll: `${URL}/gastos/ativos`,
        getAllInactives: `${URL}/gastos/inativos`,
        create: `${URL}/gastos`,
        getValores: `${URL}/gastos/total-por-mes`,
        inactiveAll: `${URL}/gastos/desativar-lote`,
        active: (id) => `${URL}/gastos/${id}/ativar`,
        inactive: (id) => `${URL}/gastos/${id}/desativar`,
        delete: `${URL}/gastos`,
        edit: (id) => `${URL}/gastos/${id}`,
    },
    relatorios: {
        gerarPdf: `${URL}/relatorios/gastos/pdf`,
    },
    categories: {
        getAll: `${URL}/categorias/usuario`,
        create: `${URL}/categorias`,
        delete: (id) => `${URL}/categorias/${id}`,
    },
    split: {
        getAll: `${URL}/divisao`,
        create: `${URL}/divisao`,
        accept: `${URL}/divisao/aceitar`,
        refuse: `${URL}/divisao/negar`,
    },
}