import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './GastosPage.module.css';
import { toast } from 'react-toastify';
import Botao from '../../components/botao/Botao';
import { IoPrintOutline } from "react-icons/io5";
import { FaSquarePlus } from "react-icons/fa6";
import GridCard from '../../components/gridcard/GridCard';
import { useExpenses } from '../../context/ExpenseContext';
import { Link } from 'react-router-dom';
import Table from '../../components/table/Table';
import { FaTrash } from "react-icons/fa";
import Loading from '../../components/loading/Loading';
import { useSplit } from '../../context/SplitExpanseContext';

function GastosPage() {
    const [sortOrder, setSortOrder] = useState('recentes');
    const [selectedGastos, setSelectedGastos] = useState([]); 
    const [selectAll, setSelectAll] = useState(false); 
    const { token } = useAuth();
    const { gastos, loading, inactiveGastos } = useExpenses();
    const { createSplit } = useSplit();

    const gastosOrdenados = useMemo(() => {
        const sorted = [...gastos];
        sorted.sort((a, b) => {
            switch (sortOrder) {
                case 'maior_valor':
                    return b.valorTotal - a.valorTotal;
                case 'menor_valor':
                    return a.valorTotal - b.valorTotal;
                case 'antigos':
                    return new Date(a.data) - new Date(b.data);
                case 'recentes':
                default:
                    return new Date(b.data) - new Date(a.data);
            }
        });
        return sorted;
    }, [gastos, sortOrder]);

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };

    const handleSelectAll = (event) => {
        const isChecked = event.target.checked;
        setSelectAll(isChecked);
        
        if (isChecked) {
            const allIds = gastosOrdenados.map(gasto => gasto.id);
            setSelectedGastos(allIds);
        } else {
            setSelectedGastos([]);
        }
    };

    const handleSelectGasto = (gastoId) => {
        setSelectedGastos(prev => {
            if (prev.includes(gastoId)) {
                const newSelected = prev.filter(id => id !== gastoId);
                
                setSelectAll(newSelected.length === gastosOrdenados.length);
                
                return newSelected;
            } else {
                const newSelected = [...prev, gastoId];
                
                setSelectAll(newSelected.length === gastosOrdenados.length);
                
                return newSelected;
            }
        });
    };

    const isGastoSelected = (gastoId) => {
        return selectedGastos.includes(gastoId);
    };

    const handleDeleteSelected = async () => {
        if (selectedGastos.length === 0) {
            toast.warning('Nenhum gasto selecionado para apagar.');
            return;
        }
        try {
            await inactiveGastos(selectedGastos); 
            toast.success(`${selectedGastos.length} gastos deletado com sucesso!`);
        } catch (error) {
            toast.error("Não foi possível apagar os gastos.");
        }
        
        setSelectedGastos([]);
        setSelectAll(false);
    };

    const handleShareGasto = async (gasto) => {
        try {
            let email = "carlos@gmail.com"
            let valorDivisao = 150
            console.log(gasto)
            await createSplit(gasto.id, email, valorDivisao); 
            toast.success(`${gasto.descricao} enviado para a divisão!`);
        } catch (error) {
            toast.error("Não foi possível dividir o gasto.");
            console.error(error)
        }
    };

    useEffect(() => {
        if (gastosOrdenados.length > 0) {
            setSelectAll(selectedGastos.length === gastosOrdenados.length);
        }
    }, [gastosOrdenados.length, selectedGastos.length]);

    return (
        <div className={styles.gastosContainer}>
            <GridCard flex={1}>
                <div className={styles.gastosHeaderContainer}>
                    <div className={styles.gastosTitle}>
                        <h4>Gastos</h4>
                        <div className={styles.sortContainer}>
                            <label htmlFor="sort">Ordenar por </label>
                            <select
                                id="sort"
                                value={sortOrder}
                                onChange={handleSortChange}
                                className={styles.sortSelect}
                            >
                                <option value="recentes">Mais Recentes</option>
                                <option value="antigos">Mais Antigos</option>
                                <option value="maior_valor">Maior Valor</option>
                                <option value="menor_valor">Menor Valor</option>
                            </select>
                        </div>
                    </div>
                    <div className={styles.gastosActions}>
                        <Link to="/cadastrogasto">
                            <Botao icon={<FaSquarePlus size={24} color={"white"}/>} name={"Adicionar"}/>
                        </Link>
                        <Botao icon={<IoPrintOutline size={24} color={"white"} />} name={"Imprimir"} />
                    </div>
                </div>

                {loading ? (
                    <Loading></Loading>
                ) : (
                    <Table 
                        gastos={gastosOrdenados}
                        selectedGastos={selectedGastos}
                        onSelectGasto={handleSelectGasto}
                        isGastoSelected={isGastoSelected}
                        selectAll={selectAll}
                        onSelectAll={handleSelectAll}
                        type={'active'}
                        onShareGasto={(gasto) => {
                            handleShareGasto(gasto);
                        }}
                        onEditGasto={(gasto) => {
                            
                        }}
                        onDeleteGasto={(gasto) => {
                        handleDeleteGastoUnico(gasto.id);
                        }}
                        onDeleteForeverGasto={(gasto) => {
                        handleDeletePermanente(gasto.id);
                        }}
                    />
                )}
                
                {selectedGastos.length > 0 && (
                    <div className={styles.selectionInfo}>
                        {selectedGastos.length} gasto{selectedGastos.length > 1? 's' : ''} selecionado{selectedGastos.length > 1? 's' : ''} 
                    </div>
                )}

                <div className={styles.botaoApagar}>
                    <Botao 
                        icon={<FaTrash size={20} color={"white"} />} 
                        name={`Apagar (${selectedGastos.length})`}
                        disabled={selectedGastos.length === 0}
                        onClick={handleDeleteSelected}
                    />
                </div>
            </GridCard>
        </div>
    );
}

export default GastosPage;