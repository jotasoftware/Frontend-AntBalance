import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from './AuthContext';
import { 
    fetchSplitGastos as apiFetchSplitGastos,
    createSplit as apiCreateSplit
} from '../services/splitExpanseService';

export const SplitExpanseContext = createContext(null);

export const SplitExpenseProvider = ({ children }) => {
    const { isLoggedIn } = useAuth(); 

    const [loadingSplit, setLoadingSplit] = useState(false);
    const [splitGastos, setSplitGastos] = useState([]);


    const fetchSplitGastos = async () => {
        try {
            setLoadingSplit(true);
            const token = localStorage.getItem('token');
            const response = await apiFetchSplitGastos(token);
            setSplitGastos(response);
        } catch (error) {
            console.error('Erro ao buscar gastos para aceitar:', error);
        } finally {
            setLoadingSplit(false);
        }
    }

    const createSplit = async (id, email, valor) => {
        try {
            const payloadParaAPI = {
                idGasto: id,
                usuarioDoisId: email, 
                valorDividido: valor, 
            };
            const tokenLocal = localStorage.getItem('token');
            await apiCreateSplit(payloadParaAPI, tokenLocal);
        } catch (error) {
            console.error("Erro ao criar gasto:", error);
            throw error;
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            if (isLoggedIn) {
                setLoading(true);
                const tokenLocal = localStorage.getItem('token');
                try {
                    const [gastosDividido] = await Promise.all([
                        apiFetchSplitGastos(tokenLocal),
                    ])

                    setSplitGastos(gastosDividido);
                } catch (error) {
                    console.error("Erro ao buscar dados iniciais:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setSplitGastos([]);
            }
        }
        loadInitialData();
    }, [isLoggedIn]);

    const value = { loadingSplit, splitGastos, createSplit, fetchSplitGastos };

    return (
        <SplitExpanseContext.Provider value={value}>
            {children}
        </SplitExpanseContext.Provider>
    );
};

export const useSplit = () => {
    const context = useContext(SplitExpanseContext);
    if (!context) {
        throw new Error('useSplit deve ser usado dentro de um SplitExpenseProvider');
    }
    return context;
};