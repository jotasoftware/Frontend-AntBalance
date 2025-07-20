import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from './AuthContext';
import { 
    createSetor as apiCreateSetor, 
    createFuncionario as apiCreateFuncionario, 
    fetchSetores as apiFetchSetores, 
    fetchFuncionarios as apiFetchFuncionarios,
    fetchFuncionariosInativos as apiFetchFuncionariosInativos,
    inactiveFuncionarios as apiInactiveFuncionarios,
    inactiveFuncionario as apiInactiveFuncionario,
    activeFuncionario as apiActiveFuncionario,
    deleteFuncionarios as apiDeleteFuncionarios,
    deleteSetor as apiDeleteSetor,
    editarFuncionario as apiEditarFuncionario,
    editarSetor as apiEditarSetor,
} from '../services/employeeService';
import { converterStringParaNumero } from "@/utils/converterStringNumero";

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
            const response = await apiFetchSetores();
            setSetores(response);
        } catch (error) {
            console.error("Erro ao buscar setores:", error);
            throw error;
        }
    };

    const fetchFuncionarios = async () => {
        setLoadingFuncionario(true)
        try {
            const response = await apiFetchFuncionarios();
            setFuncionarios(response);
        } catch (error) {
            console.error("Erro ao buscar funcionarios:", error);
            throw error;
        }finally{
            setLoadingFuncionario(false)
        }
    };

    const fetchFuncionariosInativos = async () => {
        setLoadingInativo(true)
        try {
            const response = await apiFetchFuncionariosInativos();
            console.log(response)
            setFuncionariosInativos(response);
        } catch (error) {
            console.error("Erro ao buscar funcionarios inativos:", error);
            throw error;
        }finally{
            setLoadingInativo(false)
        }
    };

    const createFuncionario = async (data) => {
        try {
            const valorNumerico = converterStringParaNumero(data.salario);
            const payloadParaAPI = {
                nome: data.nome,
                salario: valorNumerico,
                cargo: data.cargo,
                telefone: data.telefone,
                setorId: data.setorId,
                dataCadastro: new Date().toISOString(),
            };
            const novoFuncionario = await apiCreateFuncionario(payloadParaAPI);
            setFuncionarios(prevFuncionarios => [...prevFuncionarios, novoFuncionario]);
        } catch (error) {
            console.error("Erro ao criar funcionario:", error);
            throw error;
        }
    };

    const editarFuncionario = async (id, data) => {
        try {
            const funcionarioAtualizado = await apiEditarFuncionario(id, data);

            setFuncionarios(prevFuncionarios =>
                prevFuncionarios.map(funcionario => funcionario.id === id ? funcionarioAtualizado : funcionario
                )
            );
        } catch (error) {
            console.error("Erro ao atualizar funcionario:", error);
            throw error;
        }
    };

    const inactiveFuncionarios = async (data) => {
        try {
            await apiInactiveFuncionarios(data);
            fetchFuncionarios()
            fetchFuncionariosInativos()
        } catch (error) {
            console.error("Erro ao apagar lista de funcionarios:", error);
            throw error;
        }
    };

    const inactiveFuncionario = async (data) => {
        try {
            console.log(data)
            await apiInactiveFuncionario(data);
            fetchFuncionarios()
            fetchFuncionariosInativos()
        } catch (error) {
            console.error("Erro ao apagar lista de funcionarios:", error);
            throw error;
        }
    };
    const activeFuncionario = async (data) => {
        try {
            await apiActiveFuncionario(data);
            fetchFuncionariosInativos();
            fetchFuncionarios()
        } catch (error) {
            console.error("Erro ao ativar o funcionario:", error);
            throw error;
        }
    };

    const deleteFuncionarios = async (data) => {
        try {
            await apiDeleteFuncionarios(data);
            fetchFuncionariosInativos()
        } catch (error) {
            console.error("Erro ao apagar lista de funcionarios:", error);
            throw error;
        }
    };

    const createSetor = async (data) => {
        try {
            const novoSetor = await apiCreateSetor(data);
            setSetores(prevSetores => [...prevSetores, novoSetor]);
        } catch (error) {
            console.error("Erro ao criar setor:", error);
            throw error;
        }
    };

    const deleteSetor = async (data) => {
        console.log(data)
        try {
            await apiDeleteSetor(data);
            fetchSetores()
        } catch (error) {
            console.error("Erro ao apagar lista de Setores:", error);
            throw error;
        }
    };

    useEffect(() => {
        const loadFuncionarioAndSetores = async () => {
            if (isLoggedIn) {
                if (initialDataLoaded) {
                    console.log("Funcionários e setores já carregados. Pulando fetch.");
                    return;
                }
                try {
                    setLoadingFuncionario(true)
                    const [funcionariosData, setoresData] = await Promise.all([
                        apiFetchFuncionarios(),
                        apiFetchSetores()
                    ]);
                    console.log(funcionariosData)
                    setFuncionarios(funcionariosData);
                    setSetores(setoresData);
    
                    setInitialDataLoaded(true);
                } catch (error) {
                    console.error("Erro ao buscar funcionários e setores:", error);
                }finally{
                    setLoadingFuncionario(false)
                }
            } else {
                setFuncionarios([]);
                setSetores([]);
            }
        };
        loadFuncionarioAndSetores();
    }, [isLoggedIn]);
    

    const value = { createFuncionario, createSetor, setores, funcionarios, fetchSetores, fetchFuncionarios, inactiveFuncionario, editarFuncionario, inactiveFuncionarios, deleteSetor, activeFuncionario, deleteFuncionarios, funcionariosInativos, fetchFuncionariosInativos, loadingFuncionario, loadingInativo };

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