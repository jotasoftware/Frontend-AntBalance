import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from './AuthContext';
import { 
    createCategoria as apiCreateCategoria, 
    createGasto as apiCreateGasto, 
    fetchCategorias as apiFetchCategorias, 
    fetchGastos as apiFetchGastos
} from '../services/expenseService';

export const ExpenseContext = createContext(null);

export const ExpenseProvider = ({ children }) => {
    const { isLoggedIn } = useAuth(); 

    const [loading, setLoading] = useState(false);
    const [gastos, setGastos] = useState([]);
    const [categorias, setCategorias] = useState([]);

    function converterStringParaNumero(valorString) {
        if(typeof valorString !== 'string' || !valorString) {
          return 0;
        }
        const stringSemPontos = valorString.replaceAll('.', '');
        const stringFormatoNumerico = stringSemPontos.replace(',', '.');
        const numero = parseFloat(stringFormatoNumerico);
        return isNaN(numero) ? 0 : numero;
      }

    const fetchGastos = async () => {
        setLoading(true);
        try {
            const tokenLocal = localStorage.getItem('token');
            const response = await apiFetchGastos(tokenLocal);
            setGastos(response);
        } catch (error) {
            console.error("Erro ao buscar gastos:", error);
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
            console.log(categorias)
            console.log(gastos)
        } catch (error) {
            console.error("Erro ao criar gasto:", error);
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

    useEffect(() => {
        const loadInitialData = async () => {
            if (isLoggedIn) {
                setLoading(true);
                const tokenLocal = localStorage.getItem('token');
                try {
                    const [gastosData, categoriasData] = await Promise.all([
                        apiFetchGastos(tokenLocal),
                        apiFetchCategorias(tokenLocal)
                    ]);
                    setGastos(gastosData);
                    setCategorias(categoriasData);
                } catch (error) {
                    console.error("Erro ao buscar dados iniciais:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setGastos([]);
                setCategorias([]);
            }
        };

        loadInitialData();
    }, [isLoggedIn]);

    const value = { loading, gastos, categorias, createGasto, fetchGastos, fetchCategorias, createCategoria };

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