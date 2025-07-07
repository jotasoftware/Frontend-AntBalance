const URL = 'http://localhost:8080';

export const API_CONFIG = {
    auth: {
        login: `${URL}/auth/login`,
        register: `${URL}/auth/register`,
        recover: `${URL}/password-recovery/request`,
    },
    expenses: {
        getAll: `${URL}/gastos`,
        create: `${URL}/gastos`,
        getValores: `${URL}/gastos/total-por-mes`,
        delete: (id) => `${MS_EXPENSES_URL}/api/expenses/${id}`,
        update: (id) => `${MS_EXPENSES_URL}/api/expenses/${id}`,
    },
    categories: {
        getAll: `${URL}/categorias/usuario`,
        create: `${URL}/categorias`,
        delete: (id) => `${MS_EXPENSES_URL}/api/expenses/${id}`,
        update: (id) => `${MS_EXPENSES_URL}/api/expenses/${id}`,
    },
}