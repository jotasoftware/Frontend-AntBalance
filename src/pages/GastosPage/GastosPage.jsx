import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './GastosPage.module.css';
import { toast } from 'react-toastify';
import Botao from '../../components/botao/Botao';
import { IoPrintOutline } from "react-icons/io5";
import { FaSquarePlus } from "react-icons/fa6";
import GridCard from '../../components/gridcard/GridCard';
import { useExpenses } from '../../context/ExpenseContext';
import { Link, useOutletContext } from 'react-router-dom';
import Table from '../../components/table/Table';
import { FaTrash } from "react-icons/fa";
import Loading from '../../components/loading/Loading';
import { useSplit } from '../../context/SplitExpanseContext';
import { converterStringParaNumero } from '../../utils/converterStringNumero';
import { formatarValorMonetario } from '../../utils/formatarValorMonetario';
import { converterValorBruto} from '../../utils/converterValorBruto';
import { FaPlus } from "react-icons/fa6";
import ModalCategoria from '../../components/modalCategoria/ModalCategoria';
import RelatorioGastos from '../../components/relatorio/RelatorioGastos';

function GastosPage() {
    const [sortOrder, setSortOrder] = useState('recentes');
    const [selectedGastos, setSelectedGastos] = useState([]); 
    const [valorDivisao, setValorDivisao] = useState(""); 
    const [gastoAtual, setGastoAtual] = useState(null)
    const [selectAll, setSelectAll] = useState(false); 
    const { token } = useAuth();
    const {gastos, inactiveGastos, inactiveGasto, loadingGasto, categorias, editarGasto, gerarRelatorioPdf } = useExpenses();
    const { createSplit } = useSplit();
    
    const [showSharePopup, setShowSharePopup] = useState(false);
    const [shareEmail, setShareEmail] = useState('');
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [gastoToDelete, setGastoToDelete] = useState(null);
    const [showDeleteMultiplePopup, setShowDeleteMultiplePopup] = useState(false);

    const [showEditPopup, setShowEditPopup] = useState(false);
    const [gastoToEdit, setGastoToEdit] = useState(null);
    const [editFormData, setEditFormData] = useState({
        descricao: '',
        categoriaId: '',
        categoriaNome: '',
        fonte: '',
    });

    const [modalCategoriaAberto, setModalCategoriaAberto] = useState(false);
    const [categoria, setCategoria] = useState('');
    const [categoriaId, setCategoriaId] = useState(null);

    const { isMobile } = useOutletContext();

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
        
        setShowDeleteMultiplePopup(true);
    };

    const handleDeleteMultipleConfirmado = async () => {
        try {
            await inactiveGastos(selectedGastos); 
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

    const handleEditGasto = (gasto) => {
        setShowEditPopup(true);
        setGastoToEdit(gasto);
        setEditFormData({
            descricao: gasto.descricao || '',
            categoriaId: gasto.categoriaId || '',
            categoriaNome: gasto.categoria?.nome || '',
            fonte: gasto.fonte || '',
        });
        
    };

    const handleCloseEditPopup = () => {
        setShowEditPopup(false);
        setGastoToEdit(null);
        setEditFormData({
            descricao: '',
            categoriaId: '',
            categoriaNome: '',
            fonte: ''
        });
    };

    const handleEditChange = (field, value) => {
        setEditFormData(prev => ({...prev,[field]: value}
        ));
    };

    const handleEditValorChange = (inputValue) => {
        if (inputValue === '') {
            handleEditChange('valor', '');
            return;
        }
        if (inputValue.length <= 12) {
            const valorFormatado = formatarValorMonetario(inputValue);
            handleEditChange('valor', valorFormatado);
        }
    };

    const submitEditGasto = async () => {
        if (!editFormData.descricao.trim()) {
            toast.warn("Por favor, preencha o nome.");
            return;
        }
        
        if (!editFormData.categoriaId) {
            toast.warn("Por favor, selecione uma categoria.");
            return;
        }
        
        if (!editFormData.fonte.trim()) {
            toast.warn("Por favor, preencha a fonte.");
            return;
        }
        try {
            const updateData = {
                descricao: editFormData.descricao,
                ativo: gastoToEdit.ativo,
                valorTotal: gastoToEdit.valorTotal,
                parcelado: gastoToEdit.parcelado,
                numeroParcelas: gastoToEdit.numeroParcelas,
                categoriaId: editFormData.categoriaId,
                fonte: editFormData.fonte,
                data: gastoToEdit.data,
                parcelas: gastoToEdit.parcelas
            };

            try {
                await editarGasto(gastoToEdit.id, updateData);
                toast.success(`${gastoToEdit.descricao} gasto editado com sucesso!`);
                setShowDeletePopup(false);
                setGastoToDelete(null);
                handleCloseEditPopup();
            } catch (error) {
                toast.error("Não foi possível editar o gasto.");
            }
        } catch (error) {
            toast.error("Erro ao atualizar o gasto. Tente novamente.");
            console.error("Erro ao atualizar gasto:", error);
        }
    };



    const handleDeleteGastoUnico = async(gasto) => {
        setGastoToDelete(gasto);
        setShowDeletePopup(true);
    };

    const handleDeleteGastoTrue = async() => {
        if (!gastoToDelete) return;
            try {
                await inactiveGasto(gastoToDelete.id);
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

    const handleSelectCategoria = (categoriaSelecionada, id) => {
        setCategoria(categoriaSelecionada);
        setCategoriaId(id);
        setEditFormData(prevData => ({
            ...prevData,
            categoriaId: id,
            categoriaNome: categoriaSelecionada 
        }));
    };
    
    const handleAddCategoria = async (novaCategoria) => {
        if (!categorias.includes(novaCategoria)) {
            try {
                await createCategoria({ nome: novaCategoria });
                toast.success(`Categoria "${novaCategoria}" criada com sucesso!`);
            } catch (error) {
                toast.error("Não foi possível criar a categoria.");
            }
        }
    };
    
    const handleDeleteCategoria = async (categoria) => {
        try {
            await deleteCategoria(categoria.id);
    
            if (categoria.id === categoriaId) {
                setCategoria('');
                setCategoriaId(null);
            }
    
            toast.success(`Categoria ${categoria.nome} excluída com sucesso!`);
        } catch (error) {
            toast.error(error.response.data.mensagem);
            console.error("Erro ao excluir categoria:", error);
        }
    };
    
    const handleImprimirRelatorio = async () => {
        try {
            const payload = {
                dataInicio: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
                dataFim: new Date().toISOString().split('T')[0],
                tipoRelatorio: 'COMPLETO'
            };
    
            const pdfBlob = await gerarRelatorioPdf(payload, token);
    
            if (!pdfBlob) {
                throw new Error('Não foi possível gerar o relatório');
            }
    
            const url = window.URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            
            const dataAtual = new Date().toISOString().split('T')[0];
            link.setAttribute('download', `relatorio_gastos_${dataAtual}.pdf`);
            
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            window.URL.revokeObjectURL(url);
            
            toast.success('Relatório gerado com sucesso!');
            
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
            toast.error('Erro ao gerar relatório PDF. Tente novamente.');
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
                            {isMobile ? <Botao icon={<FaPlus size={24} color={"white"}/>} /> : <Botao icon={<FaSquarePlus size={24} color={"white"}/>} name={"Adicionar"}/>}
                        </Link>
                        {isMobile ? <Botao icon={<IoPrintOutline size={24} color={"white"} onClick={handleImprimirRelatorio} />} />: <Botao icon={<IoPrintOutline size={24} color={"white"}/>} name={"Imprimir"} onClick={handleImprimirRelatorio}/>}
                        
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
                            handleEditGasto(gasto);
                        }}
                        onDeleteGasto={(gasto) => {
                            handleDeleteGastoUnico(gasto);
                        }}
                        isMobile={isMobile}
                        loading={false}
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
                                <div className={styles.inputContainer}>
                                    <label htmlFor="shareEmail">E-mail do destinatário:</label>
                                    <input 
                                        type="email"
                                        id="shareEmail"
                                        placeholder="Digite o email para compartilhar"
                                        value={shareEmail}
                                        onChange={handleChangeShareEmail}
                                    />
                                </div>
                                <div className={styles.inputContainer}>
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

            {showEditPopup && (
                    <div className={styles.popupOverlay}>
                        <div className={styles.popup}>
                            <div className={styles.popupHeader}>
                                <header>
                                    <span>Editar Gasto</span>
                                </header>
                                <button 
                                    className={styles.closeButton}
                                    onClick={handleCloseEditPopup}
                                >
                                    ×
                                </button>
                            </div>
                            <div className={styles.popupContent}>
                                <div className={styles.inputContainer}>
                                    <label htmlFor="editNome">Nome:</label>
                                    <input
                                        type="text"
                                        id="editNome"
                                        placeholder="Nome do gasto"
                                        value={editFormData.descricao}
                                        onChange={(e) => handleEditChange('descricao', e.target.value)}
                                    />
                                </div>
                                    
                                <div className={styles.inputContainer}>
                                <div className={styles.inputContainer}>
                                    <label htmlFor="categoria">Categoria de Gasto: </label>
                                    <button
                                        type="button"
                                        className={styles.categoriaSelectButton}
                                        onClick={() => setModalCategoriaAberto(true)}
                                    >
                                        {editFormData.categoriaNome || 'Selecione a categoria'}
                                    </button>
                                </div>
                                    
                                    <div className={styles.inputContainer}>
                                        <label htmlFor="editFonte">Fonte:</label>
                                        <input
                                            type="text"
                                            id="editFonte"
                                            placeholder="Fonte do gasto"
                                            value={editFormData.fonte}
                                            onChange={(e) => handleEditChange('fonte', e.target.value)}
                                        />
                                    </div>
                                    
                                </div>
                            </div>
                            <div className={styles.popupFooter}>
                                <button 
                                    className={styles.buttonCancel}
                                    onClick={handleCloseEditPopup}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    className={styles.buttonSubmit}
                                    onClick={submitEditGasto}
                                >
                                    Salvar alterações
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

            <ModalCategoria
                isOpen={modalCategoriaAberto}
                onClose={() => setModalCategoriaAberto(false)}
                onSelectCategoria={handleSelectCategoria}
                categorias={categorias}
                onAddCategoria={handleAddCategoria}
                onDeleteCategoria={handleDeleteCategoria}
            />
        </div>
    );
}

export default GastosPage;