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

import styles from './FuncionariosInativosPage.module.css';


function FuncionariosInativosPage() {
    //dados page
    const [sortOrder, setSortOrder] = useState('recentes');
    const [selectedFuncionarios, setSelectedFuncionarios] = useState([]); 
    const [selectAll, setSelectAll] = useState(false); 
    const [funcionarioToDelete, setFuncionarioToDelete] = useState(false); 
    const {funcionariosInativos, activeFuncionario, fetchFuncionarios, fetchFuncionariosInativos, deleteFuncionarios, loadingInativo, loadingDelete } = useEmployee();
    const { isMobile } = useOutletContext();
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showDeleteMultiplePopup, setShowDeleteMultiplePopup] = useState(false);
      

    //ordenaçao
    const funcionariosOrdenados = useMemo(() => {
    
        const sorted = [...funcionariosInativos];
    
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
    }, [funcionariosInativos, sortOrder]);
    

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };

    const handleSelectAll = (event) => {
        const isChecked = event.target.checked;
        setSelectAll(isChecked);
        if (isChecked) {
            console.log(funcionariosInativos)
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
            await deleteFuncionarios(selectedFuncionarios); 
            toast.success(`${selectedFuncionarios.length} funcionários${selectedFuncionarios.length > 1 ? 's' : ''} deletado${selectedFuncionarios.length > 1 ? 's' : ''} permanentemente com sucesso com sucesso!`);
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

    const handleDeleteFuncionarioUnico = async(funcionario) => {
        setFuncionarioToDelete(funcionario);
        setShowDeletePopup(true);
    };

    const handleDeleteFuncionarioTrue = async() => {
        if (!funcionarioToDelete) return;
            try {
                await deleteFuncionarios([funcionarioToDelete.id]);
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

    const handleActiveGasto = async (funcionario)=>{
        try {
            await activeFuncionario(funcionario.id); 
            toast.success(`${funcionario.descricao} foi inserido de volta a sua lista de funcionários!`);
        } catch (error) {
            toast.error("Não foi possível ativar seu funcionario.");
            console.error(error)
        }
    }


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
                        <h4>Funcionarios Inativos</h4>
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
                        
                    </div>
                </div>
                <TableFuncionario
                    funcionarios={funcionariosOrdenados}
                    selectedFuncionarios={selectedFuncionarios}
                    onSelectFuncionario={handleSelectFuncionario}
                    isFuncionarioSelected={isFuncionarioSelected}
                    selectAll={selectAll}
                    onSelectAll={handleSelectAll}
                    type={'inative'}
                    onDeleteFuncionario={(funcionario) => {
                        handleDeleteFuncionarioUnico(funcionario);
                    }}
                    onActiveFuncionario={(funcionario) => {
                        handleActiveGasto(funcionario);
                    }}
                    isMobile={isMobile}
                    loading={loadingInativo}
                />

                <DeletePopup
                    show={showDeletePopup}
                    onClose={handleCloseDeletePopup}
                    onConfirm={handleDeleteFuncionarioTrue}
                    infoToDelete={funcionarioToDelete}
                    type={"FUNCIONARIO"}
                    loading={loadingDelete}
                />

                <DeleteMultiplePopup
                    show={showDeleteMultiplePopup}
                    onClose={handleCloseDeleteMultiplePopup}
                    onConfirm={handleDeleteMultipleConfirmado}
                    selectedItems={selectedFuncionarios}
                    itemList={funcionariosOrdenados}
                    itemLabel="funcionário"
                    loading={loadingDelete}
                />
                            
                {selectedFuncionarios.length > 0 && (
                    <div className={styles.selectionInfo}>
                        {selectedFuncionarios.length} gasto{selectedFuncionarios.length > 1? 's' : ''} selecionado{selectedFuncionarios.length > 1? 's' : ''} 
                    </div>
                )}

                <div className={styles.botaoApagar}>
                    <Botao 
                        icon={<FaTrash size={20} color={"white"} />} 
                        name={`Apagar Permanentemente(${selectedFuncionarios.length})`}
                        disabled={selectedFuncionarios.length === 0}
                        onClick={handleDeleteSelected}
                    />
                </div>
            </GridCard>
        </div>
    );
}

export default FuncionariosInativosPage;