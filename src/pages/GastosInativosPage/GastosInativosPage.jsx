import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './GastosInativosPage.module.css';
import { toast } from 'react-toastify';
import Botao from '../../components/botao/Botao';
import { IoPrintOutline } from "react-icons/io5";
import GridCard from '../../components/gridcard/GridCard';
import { useExpenses } from '../../context/ExpenseContext';
import Table from '../../components/table/Table';
import { FaTrash } from "react-icons/fa";
import Loading from '../../components/loading/Loading';
import { useOutletContext } from 'react-router-dom';

function GastosInativosPage() {
    const [sortOrder, setSortOrder] = useState('recentes');
    const [selectedGastos, setSelectedGastos] = useState([]); 
    const [selectAll, setSelectAll] = useState(false); 
    const { gastosInativos, loadingInativo, deleteGastos, activeGasto } = useExpenses();
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [gastoToDelete, setGastoToDelete] = useState(null);
    const [showDeleteMultiplePopup, setShowDeleteMultiplePopup] = useState(false);

    const { isMobile } = useOutletContext();

    const gastosOrdenados = useMemo(() => {
        const sorted = [...gastosInativos];
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
    }, [gastosInativos, sortOrder]);

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
            
            setShowDeleteMultiplePopup(true);
        };
    
        const handleDeleteMultipleConfirmado = async () => {
            try {
                await deleteGastos(selectedGastos); 
                toast.success(`${selectedGastos.length} gasto${selectedGastos.length > 1 ? 's' : ''} deletado${selectedGastos.length > 1 ? 's' : ''} com sucesso!`);
                
                //para limpar
                setSelectedGastos([]);
                setSelectAll(false);
                setShowDeleteMultiplePopup(false);
            } catch (error) {
                toast.error("Não foi possível apagar os gastos.");
            }
        };
    
        const handleCloseDeleteMultiplePopup = () => {
            setShowDeleteMultiplePopup(false);
        };

    const handleActiveGasto = async (gasto)=>{
        try {
            await activeGasto(gasto.id); 
            toast.success(`${gasto.descricao} foi inserido de volta a sua lista de gastos!`);
        } catch (error) {
            toast.error("Não foi possível ativar seu gasto.");
            console.error(error)
        }
    }

    const handleDeleteGasto = async (gasto)=>{
        try {
            await deleteGastos([gasto.id]); 
            toast.success(`${gasto.descricao} deletado com sucesso!`);
        } catch (error) {
            toast.error("Não foi possível apagar os gastos.");
        }
        
        setSelectedGastos([]);
    }

    const handleDeleteGastoUnico = async(gasto) => {
            setGastoToDelete(gasto);
            setShowDeletePopup(true);
            // try {
            //     await inactiveGasto(gasto.id); 
            //     toast.success(`${gasto.descricao} gasto removido com sucesso!`);
            // } catch (error) {
            //     toast.error("Não foi possível apagar o gasto.");
            // }
        };
    
        const handleDeleteGastoTrue = async() => {
            if (!gastoToDelete) return;
                try {
                    await deleteGastos([gastoToDelete.id]);
                    toast.success(`${gastoToDelete.descricao} gasto removido com sucesso!`);
                    setShowDeletePopup(false);
                    setGastoToDelete(null);
                } catch (error) {
                    toast.error("Não foi possível apagar o gasto.");
                }
            }
    
        const handleCloseDeletePopup = () => {
            setShowDeletePopup(false);
            setGastoToDelete(null);
        };
    
        const handleCloseSharePopup = () => {
            setShowSharePopup(false);
            setShareEmail('');
            setValorDivisao('')
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
                        <h4>Gastos Inativos</h4>
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
                        {isMobile ? <Botao icon={<IoPrintOutline size={24} color={"white"} />} /> : <Botao icon={<IoPrintOutline size={24} color={"white"} />} name={"Imprimir"} />}
                    </div>
                </div>
                <Table 
                    gastos={gastosOrdenados}
                    selectedGastos={selectedGastos}
                    onSelectGasto={handleSelectGasto}
                    isGastoSelected={isGastoSelected}
                    selectAll={selectAll}
                    onSelectAll={handleSelectAll}
                    type={'inative'}
                    onActiveGasto={(gasto) => {
                        handleActiveGasto(gasto);
                    }}
                    onDeleteGasto={(gasto) => {
                        handleDeleteGastoUnico(gasto);
                    }}
                    isMobile={isMobile}
                    loading={loadingInativo}
                />
                
                {selectedGastos.length > 0 && (
                    <div className={styles.selectionInfo}>
                        {selectedGastos.length} gasto{selectedGastos.length > 1? 's' : ''} selecionado{selectedGastos.length > 1? 's' : ''} 
                    </div>
                )}

{showDeletePopup && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popup}>
                        <div className={styles.popupHeader}>
                            <header>
                                <span>Confirmar Exclusão</span>
                            </header>
                            <button 
                                className={styles.closeButton}
                                onClick={handleCloseDeletePopup}
                            >
                                ×
                            </button>
                        </div>
                        <div className={styles.popupContent}>
                            <div className={styles.confirmMessage}>
                                <span>Tem certeza que deseja excluir o gasto?</span>
                                {gastoToDelete && (
                                    <div className={styles.gastoInfo}>
                                        <strong>{gastoToDelete.descricao}</strong>
                                        <span className={styles.gastoValor}>
                                            Valor: {gastoToDelete.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={styles.popupFooter}>
                            <button 
                                className={styles.buttonCancel}
                                onClick={handleCloseDeletePopup}
                            >
                                Cancelar
                            </button>
                            <button 
                                className={styles.buttonDelete}
                                onClick={handleDeleteGastoTrue}
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteMultiplePopup && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popup}>
                        <div className={styles.popupHeader}>
                            <header>
                                <span>Confirmar Exclusão</span>
                            </header>
                            <button 
                                className={styles.closeButton}
                                onClick={handleCloseDeleteMultiplePopup}
                            >
                                ×
                            </button>
                        </div>
                        <div className={styles.popupContent}>
                            <div className={styles.confirmMessage}>
                                <span>
                                    Tem certeza que deseja excluir {selectedGastos.length} gasto{selectedGastos.length > 1 ? 's' : ''}?
                                </span>
                                <div className={styles.selectedGastosList}>
                                    <h4>Gastos selecionados:</h4>
                                    <div className={styles.gastosList}>
                                        {gastosOrdenados
                                            .filter(gasto => selectedGastos.includes(gasto.id))
                                            .map(gasto => (
                                                <div key={gasto.id} className={styles.gastoItem}>
                                                    <div className={styles.gastoInfo}>
                                                        <strong>{gasto.descricao}</strong>
                                                        <span className={styles.gastoValor}>
                                                            {gasto.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                        </span>
                                                    </div>
                                                    
                                                </div>
                                            ))
                                        }
                                    </div>
                                    
                                    <div className={styles.totalValue}>
                                        <strong>
                                            Total: {gastosOrdenados
                                                .filter(gasto => selectedGastos.includes(gasto.id))
                                                .reduce((total, gasto) => total + gasto.valorTotal, 0)
                                                .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                            }
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.popupFooter}>
                            <button 
                                className={styles.buttonCancel}
                                onClick={handleCloseDeleteMultiplePopup}
                            >
                                Cancelar
                            </button>
                            <button 
                                className={styles.buttonDelete}
                                onClick={handleDeleteMultipleConfirmado}
                            >
                                Excluir {selectedGastos.length} gasto{selectedGastos.length > 1 ? 's' : ''}
                            </button>
                        </div>
                    </div>
                </div>
             )}

                <div className={styles.botaoApagar}>
                    <Botao 
                        icon={<FaTrash size={20} color={"white"} />} 
                        name={`Apagar Permanente(${selectedGastos.length})`}
                        onClick={handleDeleteSelected}
                        disabled={selectedGastos.length === 0}
                    />
                </div>
            </GridCard>
        </div>
    );
}

export default GastosInativosPage;