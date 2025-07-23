import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from './AuthContext';
import { 
    fetchSplitGastos as apiFetchSplitGastos,
    createSplit as apiCreateSplit,
    acceptSplit as apiAcceptSplit,
    refuseSplit as apiRefuseSplit,
    fetchPedidosList as apiFetchPedidosList
} from '../services/splitExpanseService';
import { converterStringParaNumero } from "../utils/converterStringNumero";

export const SplitExpanseContext = createContext(null);

export const SplitExpenseProvider = ({ children }) => {
    const { isLoggedIn, tokenAuth } = useAuth(); 

    const [loadingSplit, setLoadingSplit] = useState(false);
    const [splitGastos, setSplitGastos] = useState([]);

    const fetchSplitGastos = async () => {
        setLoadingSplit(true);
        try {
            const response = await apiFetchSplitGastos(tokenAuth);
            setSplitGastos(response);
        } catch (error) {
            console.error('Erro ao buscar gastos para aceitar:', error);
        } finally {
            setLoadingSplit(false);
        }
    }

    const createSplit = async (id, email, valor) => {
        setLoadingSplit(true);
        try {
            const valorNumerico = converterStringParaNumero(valor)
            const payloadParaAPI = {
                idGasto: id,
                usuarioDoisId: email, 
                valorDividido: valorNumerico, 
            };
            await apiCreateSplit(payloadParaAPI, tokenAuth);
        } catch (error) {
            console.error("Erro ao criar gasto:", error);
            throw error;
        } finally {
            setLoadingSplit(false);
        }
    };

    const acceptSplit = async (id) => {
        setLoadingSplit(true);
        try {
            const payloadParaAPI = {
                id: id,
            };
            await apiAcceptSplit(payloadParaAPI, tokenAuth);
        } catch (error) {
            console.error("Erro ao aceitar gasto:", error);
            throw error;
        } finally {
            setLoadingSplit(false);
        }
    };

    const refuseSplit = async (id) => {
        setLoadingSplit(true);
        try {
            const payloadParaAPI = {
                id: id,
            };
            await apiRefuseSplit(payloadParaAPI, tokenAuth);
        } catch (error) {
            console.error("Erro ao recusar gasto:", error);
            throw error;
        } finally {
            setLoadingSplit(false);
        }
    };

    const fetchPedidosList = async (id) => {
        try {
            const response = await apiFetchPedidosList(id);
            return response 
        } catch (error) {
            console.error('Erro ao buscar lista de pedidos:', error);
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            if (isLoggedIn) {
                setLoadingSplit(true);
                try {
                    const [gastosDividido] = await Promise.all([
                        apiFetchSplitGastos(tokenAuth),
                    ])

                    setSplitGastos(gastosDividido);
                } catch (error) {
                    console.error("Erro ao buscar dados iniciais:", error);
                } finally {
                    setLoadingSplit(false);
                }
            } else {
                setSplitGastos([]);
            }
        }
        loadInitialData();
    }, [isLoggedIn]);

    const value = { loadingSplit, splitGastos, createSplit, fetchSplitGastos, acceptSplit, refuseSplit, fetchPedidosList };

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