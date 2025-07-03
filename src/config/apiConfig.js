const MS_AUTH_URL = 'http://localhost:8080';
const MS_EXPENSES_URL = 'http://localhost:8082';

export const API_CONFIG = {
    auth: {
        login: `${MS_AUTH_URL}/auth/login`,
        register: `${MS_AUTH_URL}/auth/register`,
    },
    expenses: {
        getAll: `${MS_EXPENSES_URL}/api/expenses`,
        create: `${MS_EXPENSES_URL}/api/expenses`,
        delete: (id) => `${MS_EXPENSES_URL}/api/expenses/${id}`,
        update: (id) => `${MS_EXPENSES_URL}/api/expenses/${id}`,
    },
}