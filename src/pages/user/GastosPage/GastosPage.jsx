import React, { useEffect, useState, useMemo } from 'react';
import { Link, useOutletContext, useRouteError } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IoPrintOutline } from 'react-icons/io5';
import { FaSquarePlus, FaPlus, FaTrash } from 'react-icons/fa6';

import { useAuth } from '@/context/AuthContext';
import { useExpenses } from '@/context/ExpenseContext';
import { useSplit } from '@/context/SplitExpanseContext';

import Botao from '@/components/common/botao/Botao';
import GridCard from '@/components/common/gridcard/GridCard';
import Table from '@/components/common/table/Table';
import Loading from '@/components/common/loading/Loading';
import ModalCategoria from '@/components/user/modalCategoria/ModalCategoria';
import RelatorioGastos from '@/components/user/relatorio/RelatorioGastos';
import FindInput from '@/components/common/findInput/FindInput';
import DeletePopup from '@/components/common/deletePopup/DeletePopup';
import DeleteMultiplePopup from '@/components/common/deleteMultiplePopup/DeleteMultiplePopup';
import { EditPopup } from '@/components/common/editPopup/EditPopup';
import { SharePopup } from '@/components/user/sharePopup/SharePopup';

import { converterStringParaNumero } from '@/utils/converterStringNumero';
import { formatarValorMonetario } from '@/utils/formatarValorMonetario';

import styles from './GastosPage.module.css';

function GastosPage() {
    //dados page
    const [sortOrder, setSortOrder] = useState('recentes');
    const [selectedGastos, setSelectedGastos] = useState([]); 
    const [selectAll, setSelectAll] = useState(false); 
    const { createSplit, fetchPedidosList, loadingSplit } = useSplit();
    const {gastos, inactiveGastos, inactiveGasto, loadingGasto, categorias, editarGasto, gerarRelatorioPdf, deleteCategoria, createCategoria, fetchCategorias, loadingDelete, loadingEdit } = useExpenses();
    const [findInput, setFindInput] = useState('')
    const { isMobile } = useOutletContext();
    const {userRole} = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);

    //dados modais e popup
    const [modalCategoriaAberto, setModalCategoriaAberto] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showSharePopup, setShowSharePopup] = useState(false);
    const [showDeleteMultiplePopup, setShowDeleteMultiplePopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [valorDivisao, setValorDivisao] = useState(""); 
    const [gastoAtual, setGastoAtual] = useState(null)
    const [pedidosDivisaoList, setPedidosDivisaoList] = useState(null)
    const [shareEmail, setShareEmail] = useState('');
    const [gastoToDelete, setGastoToDelete] = useState(null);
    const [gastoToEdit, setGastoToEdit] = useState(null);
    const [editFormData, setEditFormData] = useState({
        descricao: '',
        categoriaId: '',
        categoriaNome: '',
        fonte: '',
    });
    const [categoriaId, setCategoriaId] = useState(null);


    useEffect(()=>{
        fetchCategorias()
    },[])
    //ordenaçao
    const gastosOrdenados = useMemo(() => {
        const termoBusca = findInput.toLowerCase();
        const filtrados = gastos.filter(gasto =>
            gasto.descricao.toLowerCase().includes(termoBusca) ||
            gasto.categoria?.nome.toLowerCase().includes(termoBusca) ||
            gasto.fonte.toLowerCase().includes(termoBusca)
        );
        const sorted = [...filtrados];
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
    }, [gastos, sortOrder, findInput]);
    

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
            try {
                const response = await fetchPedidosList(gasto.id);
                setPedidosDivisaoList(response)
            } catch (error) {
                console.error("Não foi possível pegar os gastos.")
            }
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
            setPedidosDivisaoList(null)
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
        setPedidosDivisaoList(null)
        setShareEmail('');
        setValorDivisao('')
    };

    const handleSelectCategoria = (categoriaSelecionada, id) => {
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
                setIsLoading(true)
                await createCategoria({ nome: novaCategoria });
                toast.success(`Categoria "${novaCategoria}" criada com sucesso!`);
            } catch (error) {
                toast.error("Não foi possível criar a categoria.");
            }finally{
                setIsLoading(false)
            }
        }
    };
    
    const handleDeleteCategoria = async (categoria) => {
        try {
            setIsLoadingDelete(true)
            await deleteCategoria(categoria.id);
    
            if (categoria.id === categoriaId) {
                setCategoriaId(null);
            }
    
            toast.success(`Categoria ${categoria.nome} excluída com sucesso!`);
        } catch (error) {
            toast.error(error.response.data.mensagem);
            console.error("Erro ao excluir categoria:", error);
        }finally{
            setIsLoadingDelete(false)
        }
    };

    const handleChangeSearch = (event) => {
        setFindInput(event.target.value)
    }
    
    const handleImprimirRelatorio = async () => {
        try {
    
            const pdfBlob = await gerarRelatorioPdf(selectedGastos);
    
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
                        {!isMobile && <FindInput find={findInput} onChangeFind={handleChangeSearch}></FindInput>}
                        <Link to="/cadastrogasto">
                            {isMobile ? <Botao icon={<FaPlus size={24} color={"white"}/>} /> : <Botao icon={<FaSquarePlus size={24} color={"white"}/>} name={"Adicionar"}/>}
                        </Link>
                        {isMobile ? <Botao icon={<IoPrintOutline size={24} color={"white"} onClick={handleImprimirRelatorio} />} />: <Botao icon={<IoPrintOutline size={24} color={"white"}/>} name={"Imprimir"} onClick={handleImprimirRelatorio}/>}
                    </div>
                    {isMobile && 
                        <div className={styles.searchMobileAction}>
                            <FindInput find={findInput} onChangeFind={handleChangeSearch}></FindInput>
                        </div>
                    }
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
                    loading={loadingGasto}
                    role={userRole}
                />

                <SharePopup
                    show={showSharePopup}
                    shareEmail={shareEmail}
                    valorDivisao={valorDivisao}
                    handleChangeShareEmail={handleChangeShareEmail}
                    handleShareValor={handleShareValor}
                    handleCloseSharePopup={handleCloseSharePopup}
                    submitShareGasto={submitShareGasto}
                    pedidos={pedidosDivisaoList}
                    loading={loadingSplit}
                />

                <DeletePopup
                    show={showDeletePopup}
                    onClose={handleCloseDeletePopup}
                    onConfirm={handleDeleteGastoTrue}
                    infoToDelete={gastoToDelete}
                    loading={loadingDelete}
                />

                <DeleteMultiplePopup
                    show={showDeleteMultiplePopup}
                    onClose={handleCloseDeleteMultiplePopup}
                    onConfirm={handleDeleteMultipleConfirmado}
                    selectedItems={selectedGastos}
                    itemList={gastosOrdenados}
                    itemLabel="gasto"
                    loading={loadingDelete}
                />

                <EditPopup
                    show={showEditPopup}
                    editFormData={editFormData}
                    handleEditChange={handleEditChange}
                    setModalCategoriaAberto={setModalCategoriaAberto}
                    handleCloseEditPopup={handleCloseEditPopup}
                    submitEditGasto={submitEditGasto}
                    loading={loadingEdit}
                />
                            
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
                role={userRole}
                loadingAdd={isLoading}
                loadingDelete={isLoadingDelete}
            />
        </div>
    );
}

export default GastosPage;