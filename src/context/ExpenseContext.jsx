import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from './AuthContext';
import { 
    createCategoria as apiCreateCategoria, 
    createGasto as apiCreateGasto, 
    fetchCategorias as apiFetchCategorias, 
    fetchGastos as apiFetchGastos,
    fetchGastosInativos as apiFetchGastosInativos,
    fetchValores as apiFetchValores,
    inactiveGastos as apiInactiveGastos,
    inactiveGasto as apiInactiveGasto,
    activeGasto as apiActiveGasto,
    deleteGastos as apiDeleteGastos,
    deleteCategoria as apiDeleteCategoria,
    editarGasto as apiEditarGasto,
    gerarRelatorioPdf as apiGerarRelatorioPdf,
} from '../services/expenseService';
import { converterStringParaNumero } from "../utils/converterStringNumero";

export const ExpenseContext = createContext(null);

export const ExpenseProvider = ({ children }) => {
    const { isLoggedIn, tokenAuth } = useAuth(); 

    const [loading, setLoading] = useState(false);
    const [loadingValores, setLoadingValores] = useState(true);
    const [loadingGasto, setLoadingGasto] = useState(true);
    const [loadingInativo, setLoadingInativo] = useState(true);
    const [gastos, setGastos] = useState([]);
    const [gastosInativos, setGastosInativos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [valorAtual, setValorAtual] = useState(0);
    const [valoresFuturos, setValoresFuturos] = useState([]);
    const [valores, setValores] = useState([]);
    const [initialDataLoaded, setInitialDataLoaded] = useState(false);

    const transformarDadosDeValores = (dadosDaApi) => {
        const nomesDosMeses = { '01': 'Janeiro', '02': 'Fevereiro', '03': 'Março', '04': 'Abril', '05': 'Maio', '06': 'Junho', '07': 'Julho', '08': 'Agosto', '09': 'Setembro', '10': 'Outubro', '11': 'Novembro', '12': 'Dezembro' };
        return Object.entries(dadosDaApi).map(([chave, valor]) => {
            const [ano, numeroMes] = chave.split('-');
            const nomeDoMes = nomesDosMeses[numeroMes] || 'Mês Inválido';
            return { mes: `${nomeDoMes} - ${ano}`, valor: valor };
        })
    }

    const fetchGastos = async () => {
        setLoading(true);
        try {
            const response = await apiFetchGastos(tokenAuth);
            setGastos(response);
        } catch (error) {
            console.error("Erro ao buscar gastos:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const fetchGastosInativos = async () => {
        setLoading(true);
        try {
            const response = await apiFetchGastosInativos(tokenAuth);
            setGastosInativos(response);
        } catch (error) {
            console.error("Erro ao buscar gastos:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const fetchCategorias = async () => {
        try {
            const response = await apiFetchCategorias(tokenAuth);
            setCategorias(response);
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
            throw error;
        }
    };

    const fetchValores = async () => {
        setLoadingValores(true);
        try {
            const response = await apiFetchValores(tokenAuth);
            const valoresFormatados = transformarDadosDeValores(response);

            if (valoresFormatados.length === 0) {
                setValores([]);
                setValorAtual(null);
                setValoresFuturos([]);
                return;
            }

            const valorAtual = valoresFormatados[0];
            const valoresFuturos = valoresFormatados.slice(1);
            setValores(valoresFormatados);
            setValorAtual(valorAtual?.valor)
            setValoresFuturos(valoresFuturos);
        } catch (error) {
            console.error("Erro ao buscar valores:", error);
            throw error;
        } finally {
            setLoadingValores(false);
        }
    };

    const createGasto = async (data) => {
        try {
            const valorNumerico = converterStringParaNumero(data.valor)
            const payloadParaAPI = {
                descricao: data.nome,
                valorTotal: valorNumerico, 
                categoriaId: data.categoriaId, 
                parcelado: true,
                fonte: data.fonte,
                numeroParcelas: data.parcelas,
                data: new Date().toISOString()
            };

            const novoGasto = await apiCreateGasto(payloadParaAPI, tokenAuth);
            setGastos(prevGastos => [...prevGastos, novoGasto]);
            fetchValores()
        } catch (error) {
            console.error("Erro ao criar gasto:", error);
            throw error;
        }
    };

    const editarGasto = async (id, data) => {
    try {
        console.log(tokenAuth)
        const gastoAtualizado = await apiEditarGasto(id, data, tokenAuth);
        
        setGastos(prevGastos => 
            prevGastos.map(gasto => gasto.id === id ? gastoAtualizado : gasto
            )
        );
        await fetchValores();
    } catch (error) {
        console.error("Erro ao atualizar gasto:", error);
        throw error;
    }
};

    const inactiveGastos = async (data) => {
        try {
            await apiInactiveGastos(data, tokenAuth);
            fetchGastos()
            fetchValores()
            fetchGastosInativos()
        } catch (error) {
            console.error("Erro ao apagar lista de gastos:", error);
            throw error;
        }
    };

    const inactiveGasto = async (data) => {
        try {
            await apiInactiveGasto(data, tokenAuth);
            fetchGastos()
            fetchValores()
            fetchGastosInativos()
        } catch (error) {
            console.error("Erro ao remover o gasto:", error);
            throw error;
        }
    };

    const activeGasto = async (data) => {
        try {
            await apiActiveGasto(data, tokenAuth);
            fetchGastosInativos();
            fetchGastos()
            fetchValores()
        } catch (error) {
            console.error("Erro ao ativar o gastos:", error);
            throw error;
        }
    };

    const deleteGastos = async (data) => {
        try {
            await apiDeleteGastos(data, tokenAuth);
            fetchGastosInativos()
        } catch (error) {
            console.error("Erro ao apagar lista de gastos:", error);
            throw error;
        }
    };
    

    const createCategoria = async (data) => {
        try {
            const novaCategoria = await apiCreateCategoria(data, tokenAuth);
            setCategorias(prevCategorias => [...prevCategorias, novaCategoria]);
        } catch (error) {
            console.error("Erro ao criar categoria:", error);
            throw error;
        }
    };

    const deleteCategoria = async (data) => {
        try {
            await apiDeleteCategoria(data, tokenAuth);
            fetchCategorias()
        } catch (error) {
            console.error("Erro ao apagar lista de Categoria:", error);
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
        const loadInitialData = async () => {
            if (isLoggedIn) {
                if (initialDataLoaded) {
                    console.log("Dados iniciais já carregados. Pulando fetch.");
                    return;
                }
                try {
                    const [gastosData, categoriasData, gastosInativosData, valoresData] = await Promise.all([
                        apiFetchGastos(tokenAuth),
                        apiFetchCategorias(tokenAuth),
                        apiFetchGastosInativos(tokenAuth),
                        apiFetchValores(tokenAuth)
                    ]);

                    setGastos(gastosData);
                    setCategorias(categoriasData);
                    setGastosInativos(gastosInativosData);

                    const valoresFormatados = transformarDadosDeValores(valoresData);
                    if (valoresFormatados.length === 0) {
                        setValores([]);
                        setValorAtual(null);
                        setValoresFuturos([]);
                    } else {
                        const valorAtual = valoresFormatados[0];
                        const valoresFuturos = valoresFormatados.slice(1);
                        setValores(valoresFormatados);
                        setValorAtual(valorAtual?.valor);
                        setValoresFuturos(valoresFuturos);
                    }

                    setInitialDataLoaded(true);
                } catch (error) {
                    console.error("Erro ao buscar dados iniciais:", error);
                } finally {
                    setLoading(false);
                    setLoadingValores(false);
                    setLoadingGasto(false);
                    setLoadingInativo(false)
                }
            } else {
                setGastos([]);
                setCategorias([]);
                setValores([])
                setValorAtual(0)
                setValoresFuturos([])
                setGastosInativos([])
            }
        }

        loadInitialData();
    }, [isLoggedIn]);

    const value = { loading, loadingValores, loadingGasto, loadingInativo, gastos, categorias, valorAtual, valoresFuturos, createGasto, createCategoria, fetchGastos, fetchCategorias, fetchValores, fetchGastosInativos, gastosInativos, valores, deleteGastos, deleteCategoria, inactiveGastos, inactiveGasto, activeGasto, editarGasto, gerarRelatorioPdf};

    return (
        <ExpenseContext.Provider value={value}>
            {children}
        </ExpenseContext.Provider>
    );
};

export const useExpenses = () => {
    const context = useContext(ExpenseContext);
    if (!context) {
        throw new Error('useExpenses deve ser usado dentro de um ExpenseProvider');
    }
    return context;
};