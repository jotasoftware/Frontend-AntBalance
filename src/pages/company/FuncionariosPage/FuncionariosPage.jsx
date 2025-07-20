import React, { useEffect, useState, useMemo } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IoPrintOutline } from 'react-icons/io5';
import { FaSquarePlus, FaPlus, FaTrash } from 'react-icons/fa6';

import { useEmployee } from '@/context/EmployeeContext';

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
import TableFuncionario from '@/components/company/tableFuncionario/TableFuncionario';

import { converterStringParaNumero } from '@/utils/converterStringNumero';
import { formatarValorMonetario, formatarValorInicioMonetario } from '@/utils/formatarValorMonetario';

import styles from './FuncionariosPage.module.css';
import { EditFuncionarioPopup } from '@/components/company/editFuncionarioPopup/EditFuncionarioPopup';
import ModalSetor from '@/components/company/modalSetor/ModalSetor';
import { ChangeSalarioPopup } from '@/components/company/changeSalarioPopup/ChangeSalarioPopup';


function FuncionariosPage() {
    //dados page
    const [sortOrder, setSortOrder] = useState('recentes');
    const [selectedFuncionarios, setSelectedFuncionarios] = useState([]); 
    const [selectAll, setSelectAll] = useState(false); 
    const {funcionarios, createSetor, setores, fetchFuncionarios, inactiveFuncionario, fetchSetores, editarFuncionario, deleteSetor, inactiveFuncionarios, loadingFuncionario } = useEmployee();
    const [findInput, setFindInput] = useState('')
    const { isMobile } = useOutletContext();
    useEffect(()=>{
        fetchSetores()
        console.log(funcionarios)
    },[])

    //dados modais e popup
    const [modalSetorAberto, setModalSetorAberto] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showDeleteMultiplePopup, setShowDeleteMultiplePopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showChangeSalaryPopup, setShowChangeSalaryPopup] = useState(false);
    const [funcionarioAtual, setFuncionarioAtual] = useState(null)
    const [shareEmail, setShareEmail] = useState('');
    const [funcionarioToDelete, setFuncionarioToDelete] = useState(null);
    const [funcionarioToEdit, setFuncionarioToEdit] = useState(null);
    const [editFormData, setEditFormData] = useState({
        nome: '',
        setorId: '',
        setorNome: '',
        cargo: '',
        telefone: '',
    });
    const [salaryIncreaseValue, setSalaryIncreaseValue] = useState(null)
    const [salaryIncreasePercent, setSalaryIncreasePercent] = useState(null)
    const [setorId, setSetorId] = useState(null);
      

    //ordenaçao
    const funcionariosOrdenados = useMemo(() => {
        const termoBusca = findInput.toLowerCase();
    
        const filtrados = funcionarios.filter(funcionario =>
            funcionario.nome.toLowerCase().includes(termoBusca) ||
            funcionario.setor?.nome.toLowerCase().includes(termoBusca) ||
            funcionario.cargo.toLowerCase().includes(termoBusca)
        );
    
        const sorted = [...filtrados];
    
        sorted.sort((a, b) => {
            switch (sortOrder) {
                case 'maior_salario':
                    return b.salario - a.salario;
    
                case 'menor_salario':
                    return a.salario - b.salario;
    
                case 'antigos':
                    return new Date(a.dataCadastro).getTime() - new Date(b.dataCadastro).getTime();
    
                case 'recentes':
                    return new Date(b.dataCadastro).getTime() - new Date(a.dataCadastro).getTime();
    
                case 'nome':
                    return a.nome.localeCompare(b.nome);
    
                case 'setor':
                    return (a.setor?.nome || '').localeCompare(b.setor?.nome || '');
    
                default:
                    return 0;
            }
        });
    
        return sorted;
    }, [funcionarios, sortOrder, findInput]);
    
    

    // const handleShareValor = (event) => {
    //     const valorNumerico = event.target.value;
    //     if (valorNumerico === '') {
    //         setValor('');
    //         return;
    //     }
    //     if (valorNumerico.length <= 12) {
    //         const valorFormatado = formatarValorMonetario(valorNumerico);
    //         setValorDivisao(valorFormatado);
    //     }
    // }

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };

    const handleSelectAll = (event) => {
        const isChecked = event.target.checked;
        setSelectAll(isChecked);
        if (isChecked) {
            const allIds = funcionariosOrdenados.map(funcionario => funcionario.id);
            setSelectedFuncionarios(allIds);
        } else {
            setSelectedFuncionarios([]);
        }
    };

    const handleSelectFuncionario = (funcionarioId) => {
        setSelectedFuncionarios(prev => {
            if (prev.includes(funcionarioId)) {
                const newSelected = prev.filter(id => id !== funcionarioId);
                
                setSelectAll(newSelected.length === funcionariosOrdenados.length);
                
                return newSelected;
            } else {
                const newSelected = [...prev, funcionarioId];
                
                setSelectAll(newSelected.length === funcionariosOrdenados.length);
                
                return newSelected;
            }
        });
    };

    const isFuncionarioSelected = (funcionarioId) => {
        return selectedFuncionarios.includes(funcionarioId);
    };


    const handleDeleteSelected = async () => {
        if (selectedFuncionarios.length === 0) {
            toast.warning('Nenhum gasto selecionado para apagar.');
            return;
        }
        setShowDeleteMultiplePopup(true);
    };

    const handleDeleteMultipleConfirmado = async () => {
        try {
            await inactiveFuncionarios(selectedFuncionarios); 
            toast.success(`${selectedFuncionarios.length} funcionários${selectedFuncionarios.length > 1 ? 's' : ''} deletado${selectedFuncionarios.length > 1 ? 's' : ''} com sucesso!`);
            setSelectedFuncionarios([]);
            setSelectAll(false);
            setShowDeleteMultiplePopup(false);
        } catch (error) {
            toast.error("Não foi possível apagar os funcionários.");
        }
    };

    const handleCloseDeleteMultiplePopup = () => {
        setShowDeleteMultiplePopup(false);
    };

    const handleEditFuncionario = (funcionario) => {
        setShowEditPopup(true);
        setFuncionarioToEdit(funcionario);
        console.log(funcionario)
        setEditFormData({
            nome: funcionario.nome || '',
            setorId: funcionario.setor.id || '',
            setorNome: funcionario.setor?.nome || '',
            cargo: funcionario.cargo || '',
            telefone: funcionario.telefone || '',
            salario: formatarValorInicioMonetario(funcionario.salario.toString()) || ''
        });
    };

    const handleCloseEditPopup = () => {
        setShowEditPopup(false);
        setFuncionarioToEdit(null);
        setEditFormData({
            nome: '',
            setorId: '',
            setorNome: '',
            cargo: '',
            telefone: '',
        });
    };

    const handleEditChange = (field, value) => {
        if (field === 'telefone') {
            let input = value.replace(/\D/g, '');
    
            if (input.length > 11) input = input.slice(0, 11);
    
            let formatted = input;
    
            if (input.length > 0) formatted = `(${input.slice(0, 2)}`;
            if (input.length >= 3) formatted += `) ${input.slice(2, 7)}`;
            if (input.length >= 8) formatted += `-${input.slice(7, 11)}`;
    
            setEditFormData(prev => ({
                ...prev,
                [field]: formatted
            }));
        } else if (field === 'salario') {
            if (value === '') {
                setEditFormData(prev => ({ ...prev, [field]: '' }));
                return;
            }
    
            if (value.length > 12) return;
    
            const valorFormatado = formatarValorMonetario(value);
    
            setEditFormData(prev => ({ ...prev, [field]: valorFormatado }));
            return;
        } else{
            setEditFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };
    

    const submitEditFuncionario = async () => {
        if (!editFormData.nome.trim()) {
            toast.warn("Por favor, preencha o nome.");
            return;
        }
        
        if (!editFormData.cargo.trim()) {
            toast.warn("Por favor, preencha o cargo.");
            return;
        }

        if (!editFormData.setorId) {
            toast.warn("Por favor, selecione um setor.");
            return;
        }

        if (!editFormData.telefone.trim()) {
            toast.warn("Por favor, preencha a telefone.");
            return;
        }

        if (!editFormData.salario.trim()) {
            toast.warn("Por favor, preencha o salário.");
            return;
        }



        const valorNumerico = converterStringParaNumero(editFormData.salario);
        try {
            const updateData = {
                nome: editFormData.nome,
                cargo: editFormData.cargo,
                ativo: funcionarioToEdit.ativo,
                salario: valorNumerico,
                telefone: editFormData.telefone,
                setorId: editFormData.setorId,
                dataCadastro: funcionarioToEdit.dataCadastro,
            };

            try {
                await editarFuncionario(funcionarioToEdit.id, updateData);
                if(valorNumerico!=funcionarioToEdit.salario){
                    const variacao = ((valorNumerico - funcionarioToEdit.salario) / funcionarioToEdit.salario) * 100;
                    if(variacao>0){
                        toast.success(`${funcionarioToEdit.nome} editado com sucesso!\nAumento de ${variacao.toFixed(2)}% no salário`)
                    }else{
                        toast.success(`${funcionarioToEdit.nome} editado com sucesso!\nRedução de ${variacao.toFixed(2)}% no salário`)
                    }
                }else{
                    toast.success(`${funcionarioToEdit.nome} editado com sucesso!`);
                }
                setShowDeletePopup(false);
                setFuncionarioToDelete(null);
                handleCloseEditPopup();
            } catch (error) {
                toast.error("Não foi possível editar o funcionario.");
            }
        } catch (error) {
            toast.error("Erro ao atualizar o funcionario. Tente novamente.");
            console.error("Erro ao atualizar funcionário:", error);
        }
    };



    const handleDeleteFuncionarioUnico = async(funcionario) => {
        setFuncionarioToDelete(funcionario);
        setShowDeletePopup(true);
    };

    const handleDeleteFuncionarioTrue = async() => {
        if (!funcionarioToDelete) return;
            try {
                await inactiveFuncionario(funcionarioToDelete.id);
                toast.success(`${funcionarioToDelete.nome} removido com sucesso!`);
                setShowDeletePopup(false);
                setFuncionarioToDelete(null);
            } catch (error) {
                toast.error("Não foi possível apagar o funcionario.");
            }
        }

    const handleCloseDeletePopup = () => {
        setShowDeletePopup(false);
        setFuncionarioToDelete(null);
    };

    const handleSelectSetor = (setorSelecionado, id) => {
        setSetorId(id);
        setEditFormData(prevData => ({
            ...prevData,
            setorId: id,
            setorNome: setorSelecionado 
        }));
    };
    
    const handleAddSetor = async (novoSetor) => {
        if (!setores.includes(novoSetor)) {
            try {
                await createSetor({ nome: novoSetor });
                toast.success(`Setor "${novoSetor}" criado com sucesso!`);
            } catch (error) {
                toast.error("Não foi possível criar a setor.");
            }
        }
    };
    
    const handleDeleteSetor = async (setor) => {
        try {
            console.log(setor.nome)
            await deleteSetor(setor.id);
    
            if (setor.id === setorId) {
                setSetorId(null);
            }
    
            toast.success(`Setor ${setor.nome} excluído com sucesso!`);
        } catch (error) {
            toast.error(error.response.data.mensagem);
            console.error("Erro ao excluir o setor:", error);
        }
    };

    const handleChangeSearch = (event) => {
        setFindInput(event.target.value)
    }
    
    const handleImprimirRelatorio = async () => {
        // try {
    
        //     const pdfBlob = await gerarRelatorioPdf(selectedFuncionarios);
    
        //     if (!pdfBlob) {
        //         throw new Error('Não foi possível gerar o relatório');
        //     }
    
        //     const url = window.URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
        //     const link = document.createElement('a');
        //     link.href = url;
            
        //     const dataAtual = new Date().toISOString().split('T')[0];
        //     link.setAttribute('download', `relatorio_gastos_${dataAtual}.pdf`);
            
        //     document.body.appendChild(link);
        //     link.click();
        //     link.remove();
            
        //     window.URL.revokeObjectURL(url);
            
        //     toast.success('Relatório gerado com sucesso!');
            
        // } catch (error) {
        //     console.error('Erro ao gerar relatório:', error);
        //     toast.error('Erro ao gerar relatório PDF. Tente novamente.');
        // }
    };    

    useEffect(() => {
        if (funcionariosOrdenados.length > 0) {
            setSelectAll(selectedFuncionarios.length === funcionariosOrdenados.length);
        }
    }, [funcionariosOrdenados.length, selectedFuncionarios.length]);

    return (
        <div className={styles.gastosContainer}>
            <GridCard flex={1}>
                <div className={styles.gastosHeaderContainer}>
                    <div className={styles.gastosTitle}>
                        <h4>Funcionarios</h4>
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
                                <option value="maior_salario">Maior Salario</option>
                                <option value="menor_salario">Menor Salario</option>
                                <option value="nome">Nome</option>
                                <option value="setor">Setor</option>
                            </select>
                        </div>
                    </div>
                    <div className={styles.gastosActions}>
                        {!isMobile && <FindInput find={findInput} onChangeFind={handleChangeSearch}></FindInput>}
                        <Link to="/cadastrofuncionario">
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
                <TableFuncionario
                    funcionarios={funcionariosOrdenados}
                    selectedFuncionarios={selectedFuncionarios}
                    onSelectFuncionario={handleSelectFuncionario}
                    isFuncionarioSelected={isFuncionarioSelected}
                    selectAll={selectAll}
                    onSelectAll={handleSelectAll}
                    type={'active'}
                    onEditFuncionario={(funcionario) => {
                        handleEditFuncionario(funcionario);
                    }}
                    onDeleteFuncionario={(funcionario) => {
                        handleDeleteFuncionarioUnico(funcionario);
                    }}
                    isMobile={isMobile}
                    loading={loadingFuncionario}
                />

                <DeletePopup
                    show={showDeletePopup}
                    onClose={handleCloseDeletePopup}
                    onConfirm={handleDeleteFuncionarioTrue}
                    infoToDelete={funcionarioToDelete}
                    type={"FUNCIONARIO"}
                />

                <DeleteMultiplePopup
                    show={showDeleteMultiplePopup}
                    onClose={handleCloseDeleteMultiplePopup}
                    onConfirm={handleDeleteMultipleConfirmado}
                    selectedItems={selectedFuncionarios}
                    itemList={funcionariosOrdenados}
                    itemLabel="funcionário"
                />

                <EditFuncionarioPopup
                    show={showEditPopup}
                    editFormData={editFormData}
                    handleEditChange={handleEditChange}
                    setModalSetorAberto={setModalSetorAberto}
                    handleCloseEditPopup={handleCloseEditPopup}
                    submitEditFuncionario={submitEditFuncionario}
                />
                            
                {selectedFuncionarios.length > 0 && (
                    <div className={styles.selectionInfo}>
                        {selectedFuncionarios.length} gasto{selectedFuncionarios.length > 1? 's' : ''} selecionado{selectedFuncionarios.length > 1? 's' : ''} 
                    </div>
                )}

                <div className={styles.botaoApagar}>
                    <Botao 
                        icon={<FaTrash size={20} color={"white"} />} 
                        name={`Apagar (${selectedFuncionarios.length})`}
                        disabled={selectedFuncionarios.length === 0}
                        onClick={handleDeleteSelected}
                    />
                </div>
            </GridCard>
             <ModalSetor
                isOpen={modalSetorAberto}
                onClose={() => setModalSetorAberto(false)}
                onSelectSetor={handleSelectSetor}
                setores={setores}
                onAddSetor={handleAddSetor}
                onDeleteSetor={handleDeleteSetor}
            />
        </div>
    );
}

export default FuncionariosPage;