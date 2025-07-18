import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from './AuthContext';

export const EmployeeContext = createContext(null);

export const EmployeeProvider = ({ children }) => {
    const { isLoggedIn, tokenAuth } = useAuth();

    const [loading, setLoading] = useState(false);
    const [loadingFuncionario, setLoadingFuncionario] = useState(true);
    const [loadingInativo, setLoadingInativo] = useState(true);
    const [funcionarios, setFuncionarios] = useState([]);
    const [funcionariosInativos, setFuncionariosInativos] = useState([]);
    const [setores, setSetores] = useState([]);
    const [initialDataLoaded, setInitialDataLoaded] = useState(false);


    const fetchSetores = async () => {
        try {
            const response = await apiFetchSetores(tokenAuth);
            setSetores(response);
        } catch (error) {
            console.error("Erro ao buscar setores:", error);
            throw error;
        }
    };



    const createFuncionario = async (data) => {
        try {
            // Passar o objeto funcionario
            const payloadParaAPI = {
                descricao: data.nome,
                salario: data.salario,
                cargo: data.cargo,
                telefone: data.telefone,
                setorId: data.setorId,
            };

            const novoGasto = await apiCreateFuncionario(payloadParaAPI, tokenAuth);
            setFuncionario(prevFuncionarios => [...prevFuncionarios, novoFuncionario]);
            fetchValores()
        } catch (error) {
            console.error("Erro ao criar funcionario:", error);
            throw error;
        }
    };

    const editarFuncionario = async (id, data) => {
        try {
            console.log(tokenAuth)
            const funcionarioAtualizado = await apiEditarFuncionario(id, data, tokenAuth);

            setFuncionarios(prevFuncionarios =>
                prevFuncionarios.map(funcionario => funcionario.id === id ? funcionarioAtualizado : funcionario
                )
            );
        } catch (error) {
            console.error("Erro ao atualizar gasto:", error);
            throw error;
        }
    };

    const inactiveFuncionarios = async (data) => {
        try {
            await apiInactiveFuncionarios(data, tokenAuth);
            fetchFuncionarios()
            fetchSalarios()
            fetchFUncionariosInativos()
        } catch (error) {
            console.error("Erro ao apagar lista de funcionarios:", error);
            throw error;
        }
    };
    const inactiveFuncionario = async (data) => {
        try {
            await apiInactiveFuncionario(data, tokenAuth);
            fetchFuncionarios()
            fetchFUncionariosInativos()
        } catch (error) {
            console.error("Erro ao apagar lista de funcionarios:", error);
            throw error;
        }
    };
    const activeFuncionario = async (data) => {
        try {
            await apiActiveFuncionario(data, tokenAuth);
            fetchFuncionariosInativos();
            fetchFuncionarios()
        } catch (error) {
            console.error("Erro ao ativar o funcionario:", error);
            throw error;
        }
    };

    const deleteFuncionarios = async (data) => {
        try {
            await apiDeleteFuncionarios(data, tokenAuth);
            fetchFuncionariosInativos()
        } catch (error) {
            console.error("Erro ao apagar lista de funcionarios:", error);
            throw error;
        }
    };

    const createSetor = async (data) => {
        try {
            const novoSetor = await apiCreateSetor(data, tokenAuth);
            setSetores(prevSetores => [...prevSetores, novoSetor]);
        } catch (error) {
            console.error("Erro ao criar setor:", error);
            throw error;
        }
    };

    const deleteSetor = async (data) => {
        try {
            await apiDeleteSetor(data, tokenAuth);
            fetchSetores()
        } catch (error) {
            console.error("Erro ao apagar lista de Setores:", error);
            throw error;
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            if (isLoggedIn) {
                if (initialDataLoaded) {
                    console.log("Dados iniciais já carregados. Pulando fetch.");
                    return;
                }
                try {
                    const [funcionariosData, setoresData, funcionariosInativosData] = await Promise.all([
                        apiFetchFuncionarios(tokenAuth),
                        apiFetchSetores(tokenAuth),
                        apiFetchFuncionariosInativos(tokenAuth),
                    ]);

                    setFuncionarios(funcionariosData);
                    setsetores(setoresData);
                    setFuncionariosInativos(funcionariosInativosData);

                    setInitialDataLoaded(true);
                } catch (error) {
                    console.error("Erro ao buscar dados iniciais:", error);
                } finally {
                    setLoading(false);
                    setLoadingFuncionario(false);
                    setLoadingInativo(false)
                }
            } else {
                setFuncionarios([]);
                setSetores([]);
                setFuncionariosInativos([])
            }
        }

        loadInitialData();
    }, [isLoggedIn]);

    const value = { loading, loadingFuncionario, loadingInativo, funcionarios, setores, createFuncionario, createSetor, fetchFuncionarios, fetchSetores, funcionariosInativos, deleteFuncionarios, deleteSetores, inactiveFuncionarios, inactiveFuncionario, activeFuncionario, editarFuncionario };

    return (
        <EmployeeContext.Provider value={value}>
            {children}
        </EmployeeContext.Provider>
    );
}

export const useEmployee = () => {
    const context = useContext(EmployeeContext);
    if (!context) {
        throw new Error('useEmployee deve ser usado dentro de um EmployeeProvider');
    }
    return context;
};