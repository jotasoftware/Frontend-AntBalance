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
import { converterStringParaNumero } from '../../utils/converterStringNumero';
import { formatarValorMonetario } from '../../utils/formatarValorMonetario';

function GastosPage() {
    const [sortOrder, setSortOrder] = useState('recentes');
    const [selectedGastos, setSelectedGastos] = useState([]); 
    const [valorDivisao, setValorDivisao] = useState(""); 
    const [gastoAtual, setGastoAtual] = useState(null)
    const [selectAll, setSelectAll] = useState(false); 
    const { token } = useAuth();
    const { gastos, inactiveGastos, inactiveGasto, loadingGasto } = useExpenses();
    const { createSplit } = useSplit();
    
    const [showSharePopup, setShowSharePopup] = useState(false);
    //const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [shareEmail, setShareEmail] = useState('');

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

    const validateForm = (email) => {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if(!regexEmail.test(email)){
            toast.warn(`Email invalido`);
            return false;
        }
        return true;
    };

    const handleShareValor = (event) => {
        const valorNumerico = event.target.value;
        if (valorNumerico === '') {
            setValor('');
            return;
        }
        if (valorNumerico.length <= 12) {
            const valorFormatado = formatarValorMonetario(valorNumerico);
            setValorDivisao(valorFormatado);
        }
    }

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

    const handleShare = (e) => {
        e.stopPropagation();
    };

    const handleChangeShareEmail = (event) => {
        setShareEmail(event.target.value);
    }; 

    const handleShareGasto = async (gasto) => { 
        if(gasto.numeroParcelas!=1){
            toast.warn("Somente gastos à vista podem ser compartilhados.")
        }else{
            setGastoAtual(gasto)
            setShowSharePopup(true);
        }
    };

    const submitShareGasto = async (gasto) => {
        if(!validateForm(shareEmail)) {
            return;
        }
        if(converterStringParaNumero(valorDivisao) > gastoAtual.valorTotal){
            toast.warn("Você não pode enviar valores maiores que do gasto")
            return
        }
        
        try {

            await createSplit(gastoAtual.id, shareEmail, valorDivisao); 
            toast.success(`${gastoAtual.descricao} enviado para a para ${shareEmail}!`);
            setValorDivisao("");
            setShareEmail("")
            setShowSharePopup(false);
        } catch (error) {
            toast.error("Não foi possível dividir o gasto.");
            console.error(error)
        }
    };

    

    const handleDeleteGastoUnico = async(gasto) => {
        try {
            await inactiveGasto(gasto.id); 
            toast.success(`${gasto.descricao} gasto removido com sucesso!`);
        } catch (error) {
            toast.error("Não foi possível apagar o gasto.");
        }
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
                            handleDeleteGastoUnico(gasto);
                        }}
                        onDeleteForeverGasto={(gasto) => {
                            handleDeletePermanente(gasto.id);
                        }}
                        loading={loadingGasto}
                    />

                {showSharePopup && (
                        <div className={styles.popupOverlay}>
                            <div className={styles.popup}>
                                <div className={styles.popupHeader}>
                                    <header>
                                        <span>Compartilhar Gasto</span>
                                    </header>
                                    <button 
                                        className={styles.closeButton}
                                        onClick={handleCloseSharePopup}
                                    >
                                        ×
                                    </button>
                                </div>
                                <div className={styles.popupContent}>
                                    <div className={styles.gastoDetails}>
                                        
                                    </div>
                                    <div className={styles.inputContainer}>
                                        <label htmlFor="shareEmail">E-mail do destinatário:</label>
                                        <input 
                                            type="email"
                                            id="shareEmail"
                                            placeholder="Digite o email para compartilhar"
                                            value={shareEmail}
                                            onChange={handleChangeShareEmail}
                                        />
                                        <label htmlFor="valorDivisao">Valor para dividir:</label>
                                        <input
                                            type='text'
                                            id='valorDivisao'
                                            placeholder='Digite o valor a dividir'
                                            value={valorDivisao}
                                            onChange={handleShareValor}
                                        />
                                    </div>
                                </div>
                                <div className={styles.popupFooter}>
                                    <button 
                                        className={styles.buttonCancel}
                                        onClick={handleCloseSharePopup}
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        className={styles.buttonSubmit}
                                        onClick={submitShareGasto}
                                    >
                                        Compartilhar
                                    </button>
                                </div>
                            </div>
                        </div>
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