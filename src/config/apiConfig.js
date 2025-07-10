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
        inactive: `${URL}/gastos/desativar-lote`,
        delete: `${URL}/gastos`,
    },
    categories: {
        getAll: `${URL}/categorias/usuario`,
        create: `${URL}/categorias`,
        delete: (id) => `${URL}/categorias/${id}`,
    },
}