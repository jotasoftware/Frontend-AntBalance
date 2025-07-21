import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from './AuthContext';
import { 
    createCategoria as apiCreateCategoria, 
    createGasto as apiCreateGasto, 
    fetchCategorias as apiFetchCategorias, 
    fetchGastos as apiFetchGastos,
    fetchGastosMes as apiFetchGastosMes,
    fetchGastosInativos as apiFetchGastosInativos,
    fetchValores as apiFetchValores,
    inactiveGastos as apiInactiveGastos,
    inactiveGasto as apiInactiveGasto,
    activeGasto as apiActiveGasto,
    deleteGastos as apiDeleteGastos,
    deleteCategoria as apiDeleteCategoria,
    editarGasto as apiEditarGasto,
    editarCategoria as apiEditarCategoria,
    gerarRelatorioPdf as apiGerarRelatorioPdf,
} from '../services/expenseService';
import { converterStringParaNumero } from "../utils/converterStringNumero";
import { getMesAtualFormatado } from "@/utils/getMesAtualFormatado";

export const ExpenseContext = createContext(null);

export const ExpenseProvider = ({ children }) => {
    const { isLoggedIn, tokenAuth } = useAuth(); 

    const [loading, setLoading] = useState(false);
    const [loadingValores, setLoadingValores] = useState(true);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingGasto, setLoadingGasto] = useState(true);
    const [loadingInativo, setLoadingInativo] = useState(true);
    const [gastos, setGastos] = useState([]);
    const [gastosMes, setGastosMes] = useState([]);
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
        setLoadingGasto(true);
        try {
            const response = await apiFetchGastos();
            setGastos(response);
            const responseMes = await apiFetchGastosMes();
            setGastosMes(responseMes)
        } catch (error) {
            console.error("Erro ao buscar gastos:", error);
            throw error;
        } finally {
            setLoadingGasto(false);
        }
    };

    const fetchGastosMes = async () => {
        try {
            const responseMes = await apiFetchGastosMes();
            setGastosMes(responseMes)
        } catch (error) {
            console.error("Erro ao buscar gastos:", error);
            throw error;
        }
    };

    const fetchGastosInativos = async () => {
        setLoading(true);
        try {
            const response = await apiFetchGastosInativos();
            setGastosInativos(response);
        } catch (error) {
            console.error("Erro ao buscar gastos:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const fetchCategorias = async () => {
        setLoading(true);
        try {
            const response = await apiFetchCategorias();
            setCategorias(response);
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
            throw error;
        } finally {
            console.log(loading)
            setLoading(false);
        }
    };

    const fetchValores = async () => {
        setLoadingValores(true);
        try {
            const response = await apiFetchValores();
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
            const valorNumerico = converterStringParaNumero(data.valor);

            const payloadParaAPI = {
                descricao: data.nome,
                valorTotal: valorNumerico,
                categoriaId: data.categoriaId,
                parcelado: true,
                fonte: data.fonte,
                numeroParcelas: data.parcelas,
                data: new Date().toISOString(),
            };

            const novoGasto = await apiCreateGasto(payloadParaAPI);
            fetchValores();
            
            let excedeu = false;
            if(novoGasto.categoria.limiteDeGasto!=null){
                let gastosMesmaCategoria = null;
                let totalGastoCategoria = null;
                const mesAtual = getMesAtualFormatado();
                const gastosDoMes = gastosMes.find((mes) => mes.mes === mesAtual)?.gastos || [];
                gastosMesmaCategoria = gastosDoMes.filter(
                    gasto => {
                        return gasto.categoria === novoGasto.categoria.nome
                    }
                  );
                totalGastoCategoria = gastosMesmaCategoria.reduce((acc, gasto) => acc + gasto.valor,0);
                if(novoGasto.numeroParcelas>1){
                    totalGastoCategoria += novoGasto.parcelas[0].valorParcela
                }else{
                    totalGastoCategoria += novoGasto.valorTotal
                }
                if(novoGasto.categoria.limiteDeGasto < totalGastoCategoria) excedeu = true;
            }
            setGastos(prevGastos => [...prevGastos, novoGasto]);
            fetchGastosMes()
            return {
                novoGasto,
                excedeu
            };
        } catch (error) {
            console.error("Erro ao criar gasto:", error);
            throw error;
        }
    };

    const editarGasto = async (id, data) => {
        try {
            const gastoAtualizado = await apiEditarGasto(id, data);
            fetchGastosMes()
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
        setLoadingDelete(true)
        try {
            await apiInactiveGastos(data);
            fetchGastos()
            fetchValores()
            fetchGastosInativos()
            fetchGastosMes()
        } catch (error) {
            console.error("Erro ao apagar lista de gastos:", error);
            throw error;
        }finally{
            setLoadingDelete(false)
        }
    };

    const inactiveGasto = async (data) => {
        setLoadingDelete(true)
        try {
            await apiInactiveGasto(data);
            fetchGastos()
            fetchValores()
            fetchGastosInativos()
            fetchGastosMes()
        } catch (error) {
            console.error("Erro ao remover o gasto:", error);
            throw error;
        }finally{
            setLoadingDelete(false)
        }
    };

    const activeGasto = async (data) => {
        try {
            await apiActiveGasto(data);
            fetchGastosInativos();
            fetchGastos()
            fetchValores()
            fetchGastosMes()
        } catch (error) {
            console.error("Erro ao ativar o gastos:", error);
            throw error;
        }
    };

    const deleteGastos = async (data) => {
        setLoadingDelete(true)
        try {
            await apiDeleteGastos(data);
            fetchGastosInativos()
        } catch (error) {
            console.error("Erro ao apagar lista de gastos:", error);
            throw error;
        }finally{
            setLoadingDelete(false)
        }
    };
    

    const createCategoria = async (data) => {
        try {
            let payloadParaAPI
            if(data.usarLimite){
                const valorNumerico = converterStringParaNumero(data.limiteDeGasto)
                payloadParaAPI = {
                    nome: data.nome,
                    limiteDeGasto: valorNumerico,
                };
            }else{
                payloadParaAPI = {
                    nome: data.nome,
                };
            }
            const novaCategoria = await apiCreateCategoria(payloadParaAPI);
            setCategorias(prevCategorias => [...prevCategorias, novaCategoria]);
        } catch (error) {
            console.error("Erro ao criar categoria:", error);
            throw error;
        }
    };

    const deleteCategoria = async (data) => {
        try {
            await apiDeleteCategoria(data);
            fetchCategorias()
        } catch (error) {
            console.error("Erro ao apagar lista de Categoria:", error);
            throw error;
        }
    };

    const editarCategoria = async (id, data) => {
        try {
            let payloadParaAPI
            if(data.usarLimite){
                const valorNumerico = converterStringParaNumero(data.limiteDeGasto)
                payloadParaAPI = {
                    nome: data.nome,
                    limiteDeGasto: valorNumerico,
                };
            }else{
                payloadParaAPI = {
                    nome: data.nome,
                };
            }
            const categoriaAtualizada = await apiEditarCategoria(id, payloadParaAPI);
            
            setCategorias(prevCategorias => 
                prevCategorias.map(categoria => categoria.id === id ? categoriaAtualizada : categoria
                )
            );
            await fetchGastos();
        } catch (error) {
            console.error("Erro ao atualizar categoria:", error);
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
                    setLoading(true);
                    setLoadingGasto(true);
                    setLoadingValores(true)
                    const [gastosData, categoriasData, gastosInativosData, valoresData, gastosMesData] = await Promise.all([
                        apiFetchGastos(),
                        apiFetchCategorias(),
                        apiFetchGastosInativos(),
                        apiFetchValores(),
                        apiFetchGastosMes()
                    ]);

                    setGastos(gastosData);
                    setCategorias(categoriasData);
                    setGastosInativos(gastosInativosData);
                    setGastosMes(gastosMesData);

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
                setGastosMes([])
            }
        }

        loadInitialData();
    }, [isLoggedIn]);

    const value = { loading, loadingValores, loadingGasto, loadingInativo, gastos, categorias, valorAtual, valoresFuturos, createGasto, createCategoria, fetchGastos, fetchCategorias, fetchValores, fetchGastosInativos, gastosInativos, valores, deleteGastos, deleteCategoria, inactiveGastos, inactiveGasto, activeGasto, editarGasto, editarCategoria, gerarRelatorioPdf, gastosMes, loadingDelete};

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