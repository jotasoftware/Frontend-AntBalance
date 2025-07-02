export const login = async (credentials) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const { email, password } = credentials;

            if (email === "joao@gmail.com" && password === "Bolinha123@") {
                resolve({
                    token: "fake-jwt-token-123456",
                    name: "João Pedro"
                });
            } else {
                reject({ message: "Credenciais inválidas" });
            }
        }, 1000);
    });
};

export const register = async (userData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                token: "fake-jwt-token-registered",
                name: userData.name || "Usuário Novo"
            });
        }, 1000);
    });
};
