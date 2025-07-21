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
    fetchValoresSetor as apiFetchValoresSetor,
    gerarRelatorioPdf as apiGerarRelatorioPdf
} from '../services/employeeService';
import { converterStringParaNumero } from "@/utils/converterStringNumero";

export const EmployeeContext = createContext(null);

export const EmployeeProvider = ({ children }) => {
    const { isLoggedIn, tokenAuth } = useAuth();

    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingFuncionario, setLoadingFuncionario] = useState(true);
    const [loadingValoresSetor, setLoadingValoresSetor] = useState(true);
    const [loadingInativo, setLoadingInativo] = useState(false);
    const [loadingEdit, setLoadingEdit] = useState(false);
    const [funcionarios, setFuncionarios] = useState([]);
    const [valoresSetor, setValoresSetor] = useState([]);
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

    const fetchValoresSetor = async () => {
        setLoadingValoresSetor(true)
        try {
            const response = await apiFetchValoresSetor();
            setValoresSetor(response);
        } catch (error) {
            console.error("Erro ao buscar funcionarios:", error);
            throw error;
        }finally{
            setLoadingValoresSetor(false)
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
            fetchValoresSetor()
        } catch (error) {
            console.error("Erro ao criar funcionario:", error);
            throw error;
        }
    };

    const editarFuncionario = async (id, data) => {
        try {
            setLoadingEdit(true)
            const funcionarioAtualizado = await apiEditarFuncionario(id, data);

            setFuncionarios(prevFuncionarios =>
                prevFuncionarios.map(funcionario => funcionario.id === id ? funcionarioAtualizado : funcionario
                )
            );
            fetchValoresSetor()
        } catch (error) {
            console.error("Erro ao atualizar funcionario:", error);
            throw error;
        }finally{
            setLoadingEdit(false)
        }
    };

    const inactiveFuncionarios = async (data) => {
        setLoadingDelete(true)
        try {
            await apiInactiveFuncionarios(data);
            fetchFuncionarios()
            fetchFuncionariosInativos()
            fetchValoresSetor()
        } catch (error) {
            console.error("Erro ao apagar lista de funcionarios:", error);
            throw error;
        }finally{
            setLoadingDelete(false)
        }
    };

    const inactiveFuncionario = async (data) => {
        setLoadingDelete(true)
        try {
            console.log(data)
            await apiInactiveFuncionario(data);
            fetchFuncionarios()
            fetchFuncionariosInativos()
            fetchValoresSetor()
        } catch (error) {
            console.error("Erro ao apagar lista de funcionarios:", error);
            throw error;
        }finally{
            setLoadingDelete(false)
        }
    };
    const activeFuncionario = async (data) => {
        try {
            await apiActiveFuncionario(data);
            fetchFuncionariosInativos();
            fetchFuncionarios()
            fetchValoresSetor()
        } catch (error) {
            console.error("Erro ao ativar o funcionario:", error);
            throw error;
        }
    };

    const deleteFuncionarios = async (data) => {
        setLoadingDelete(true)
        try {
            await apiDeleteFuncionarios(data);
            fetchFuncionariosInativos()
            fetchValoresSetor()
        } catch (error) {
            console.error("Erro ao apagar lista de funcionarios:", error);
            throw error;
        }finally{
            setLoadingDelete(false)
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

    const gerarRelatorioPdf = async (data) => {
        try {
            const pdfBlob = await apiGerarRelatorioPdf(data, tokenAuth);
            return pdfBlob;
        } catch (error) {
            console.error("Erro ao gerar relatório PDF:", error);
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
                    setLoadingValoresSetor(true)
                    const [funcionariosData, setoresData, valoresSetorData] = await Promise.all([
                        apiFetchFuncionarios(),
                        apiFetchSetores(),
                        apiFetchValoresSetor()
                    ]);
                    setFuncionarios(funcionariosData);
                    setSetores(setoresData);
                    setValoresSetor(valoresSetorData);
                    setInitialDataLoaded(true);
                } catch (error) {
                    console.error("Erro ao buscar funcionários e setores:", error);
                }finally{
                    setLoadingFuncionario(false)
                    setLoadingValoresSetor(false)
                }
            } else {
                setFuncionarios([]);
                setSetores([]);
                setValoresSetor([])
            }
        };
        loadFuncionarioAndSetores();
    }, [isLoggedIn]);
    

    const value = { createFuncionario, createSetor, setores, funcionarios, fetchSetores, fetchFuncionarios, inactiveFuncionario, editarFuncionario, inactiveFuncionarios, deleteSetor, activeFuncionario, deleteFuncionarios, funcionariosInativos, fetchFuncionariosInativos, loadingFuncionario, loadingInativo, fetchValoresSetor, valoresSetor, loadingValoresSetor, loadingDelete, gerarRelatorioPdf, loadingEdit };

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