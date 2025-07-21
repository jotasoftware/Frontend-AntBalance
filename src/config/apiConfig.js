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
        getAllMonths: `${URL}/gastos/total-por-mes-agrupado`,
        getAllInactives: `${URL}/gastos/inativos`,
        create: `${URL}/gastos`,
        getValores: `${URL}/gastos/total-por-mes`,
        inactiveAll: `${URL}/gastos/desativar-lote`,
        active: (id) => `${URL}/gastos/${id}/ativar`,
        inactive: (id) => `${URL}/gastos/${id}/desativar`,
        delete: `${URL}/gastos`,
        edit: (id) => `${URL}/gastos/${id}`,
    },
    employees: {
        getAll: `${URL}/funcionarios/ativos`,
        getAllInactives: `${URL}/funcionarios/inativos`,
        create: `${URL}/funcionarios`,
        getValores: `${URL}/funcionarios/total-salarios-por-setor`,
        inactiveAll: `${URL}/funcionarios/desativar-lote`,
        active: (id) => `${URL}/funcionarios/${id}/ativar`,
        inactive: (id) => `${URL}/funcionarios/${id}/desativar`,
        delete: `${URL}/funcionarios`,
        edit: (id) => `${URL}/funcionarios/${id}`,
    },
    relatorios: {
        gerarPdf: `${URL}/relatorios/gastos/pdf`,
        gerarPdfFuncionarios: `${URL}/relatorios/funcionarios/pdf`,
    },
    categories: {
        getAll: `${URL}/categorias/usuario`,
        create: `${URL}/categorias`,
        delete: (id) => `${URL}/categorias/${id}`,
        edit: (id) => `${URL}/categorias/${id}`,
    },
    sectors: {
        getAll: `${URL}/setores/usuario`,
        create: `${URL}/setores`,
        delete: (id) => `${URL}/setores/${id}`,
        edit: (id) => `${URL}/setores/${id}`,
    },
    split: {
        getAll: `${URL}/divisao`,
        create: `${URL}/divisao`,
        accept: `${URL}/divisao/aceitar`,
        refuse: `${URL}/divisao/negar`,
    },
}