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
    deleteGastos as apiDeleteGastos,
    deleteCategoria as apiDeleteCategoria
} from '../services/expenseService';

export const ExpenseContext = createContext(null);

export const ExpenseProvider = ({ children }) => {
    const { isLoggedIn } = useAuth(); 

    const [loading, setLoading] = useState(false);
    const [gastos, setGastos] = useState([]);
    const [gastosInativos, setGastosInativos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [valorAtual, setValorAtual] = useState(0);
    const [valoresFuturos, setValoresFuturos] = useState([]);
    const [valores, setValores] = useState([]);

    function converterStringParaNumero(valorString) {
        if(typeof valorString !== 'string' || !valorString) {
            return 0;
        }
        const stringSemPontos = valorString.replaceAll('.', '');
        const stringFormatoNumerico = stringSemPontos.replace(',', '.');
        const numero = parseFloat(stringFormatoNumerico);
        return isNaN(numero) ? 0 : numero;
    }

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
            const tokenLocal = localStorage.getItem('token');
            const response = await apiFetchGastos(tokenLocal);
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
            const tokenLocal = localStorage.getItem('token');
            const response = await apiFetchGastosInativos(tokenLocal);
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
            const tokenLocal = localStorage.getItem('token');
            const response = await apiFetchCategorias(tokenLocal);
            setCategorias(response);
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
            throw error;
        }
    };

    const fetchValores = async () => {
        setLoading(true);
        try {
            const tokenLocal = localStorage.getItem('token');
            const response = await apiFetchValores(tokenLocal);

            const valoresFormatados = transformarDadosDeValores(response);
            const valorAtual = valoresFormatados[0];
            const valoresFuturos = valoresFormatados.slice(1);
            setValores(response);
            setValorAtual(valorAtual.valor)
            setValoresFuturos(valoresFuturos);
        } catch (error) {
            console.error("Erro ao buscar valores:", error);
            throw error;
        } finally {
            setLoading(false);
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
            const tokenLocal = localStorage.getItem('token');
            const novoGasto = await apiCreateGasto(payloadParaAPI, tokenLocal);
            setGastos(prevGastos => [...prevGastos, novoGasto]);
            fetchValores()
        } catch (error) {
            console.error("Erro ao criar gasto:", error);
            throw error;
        }
    };

    const inactiveGastos = async (data) => {
        try {
            const tokenLocal = localStorage.getItem('token');
            await apiInactiveGastos(data, tokenLocal);
            fetchGastos()
        } catch (error) {
            console.error("Erro ao apagar lista de gastos:", error);
            throw error;
        }
    };

    const deleteGastos = async (data) => {
        try {
            const tokenLocal = localStorage.getItem('token');
            await apiDeleteGastos(data, tokenLocal);
            fetchGastosInativos()
        } catch (error) {
            console.error("Erro ao apagar lista de gastos:", error);
            throw error;
        }
    };
    

    const createCategoria = async (data) => {
        try {
            const tokenLocal = localStorage.getItem('token');
            const novaCategoria = await apiCreateCategoria(data, tokenLocal);
            setCategorias(prevCategorias => [...prevCategorias, novaCategoria]);
        } catch (error) {
            console.error("Erro ao criar categoria:", error);
            throw error;
        }
    };

    const deleteCategoria = async (data) => {
        try {
            const tokenLocal = localStorage.getItem('token');
            await apiDeleteCategoria(data, tokenLocal);
            fetchCategorias()
        } catch (error) {
            console.error("Erro ao apagar lista de Categoria:", error);
            throw error;
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            if (isLoggedIn) {
                setLoading(true);
                const tokenLocal = localStorage.getItem('token');
                try {
                    const [gastosData, categoriasData, valoresData, gastosInativosData] = await Promise.all([
                        apiFetchGastos(tokenLocal),
                        apiFetchCategorias(tokenLocal),
                        apiFetchValores(tokenLocal),
                        apiFetchGastosInativos(tokenLocal)
                    ])

                    const valoresFormatados = transformarDadosDeValores(valoresData);
                    const valorAtual = valoresFormatados[0];
                    const valoresFuturos = valoresFormatados.slice(1);

                    setGastos(gastosData);
                    setCategorias(categoriasData);
                    setValores(valoresFormatados)
                    setValorAtual(valorAtual?.valor)
                    setValoresFuturos(valoresFuturos);
                    setGastosInativos(gastosInativosData);
                } catch (error) {
                    console.error("Erro ao buscar dados iniciais:", error);
                } finally {
                    setLoading(false);
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

    const value = { loading, gastos, categorias, valorAtual, valoresFuturos, createGasto, createCategoria, fetchGastos, fetchCategorias, fetchValores, fetchGastosInativos, gastosInativos, valores, deleteGastos, deleteCategoria, inactiveGastos };

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