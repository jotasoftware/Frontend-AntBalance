import React, { useEffect, useState } from 'react';
import styles from './CategoriasPage.module.css';
import { toast } from 'react-toastify';
import Botao from '../../../components/common/botao/Botao';
import { MdOutlineModeEdit } from "react-icons/md";
import { HiOutlineTrash } from "react-icons/hi";
import GridCard from '../../../components/common/gridcard/GridCard';
import { Link } from 'react-router-dom'
import { useExpenses } from '@/context/ExpenseContext';
import CategoriaItem from '@/components/user/categoriaItem/CategoriaItem';
import { FormCategoriaPopup } from '@/components/user/formCategoriaPopup/FormCategoriaPopup';
import { formatarValorMonetario } from '@/utils/formatarValorMonetario';
import DeletePopup from '@/components/common/deletePopup/DeletePopup';
import { FaPlus } from "react-icons/fa6";
import Loading from '@/components/common/loading/Loading';


function CategoriasPage() {

    const { createCategoria, fetchCategorias, categorias, editarCategoria, deleteCategoria, loading } = useExpenses();

    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showCreatePopup, setShowCreatePopup] = useState(false);

    const [editFormData, setEditFormData] = useState({
        nome: '',
        limiteDeGasto: '',
        usarLimite: false,
    });
    const [categoriaToEdit, setCategoriaToEdit] = useState(null);

    const [categoriaToDelete, setCategoriaToDelete] = useState(null);

    const handleEditCategoria = (categoria) => {
        const flag = categoria.limiteDeGasto == null
        setShowEditPopup(true);
        setCategoriaToEdit(categoria);
        console.log(categoria.limiteDeGasto)
        setEditFormData({
            nome: categoria.nome || '',
            limiteDeGasto: formatarValorMonetario(categoria.limiteDeGasto?.toString() || ''),
            usarLimite: !flag
        });
    };

    const handleCreateCategoria = () => {
        setShowCreatePopup(true);
    };

    const handleCloseCreatePopup = () => {
        setShowCreatePopup(false);
        setEditFormData({
            nome: '',
            limiteDeGasto: '',
            usarLimite: false
        });
    };

    const handleCloseEditPopup = () => {
        setShowEditPopup(false);
        setCategoriaToEdit(null);
        setEditFormData({
            nome: '',
            limiteDeGasto: '',
            usarLimite: false
        });
    };

    const handleCloseDeletePopup = () => {
        setShowDeletePopup(false);
        setCategoriaToDelete(null);
    };

    const handleCreateChange = (field, value) => {
        if (field === 'limiteDeGasto') {
            if (value === '') {
                setEditFormData(prev => ({ ...prev, [field]: '' }));
                return;
            }
            if (value.length > 12) return;
            const valorFormatado = formatarValorMonetario(value);
    
            setEditFormData(prev => ({ ...prev, [field]: valorFormatado }));
            return;
        }

        setEditFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleEditChange = (field, value) => {
        if (field === 'limiteDeGasto') {
            if (value === '') {
                setEditFormData(prev => ({ ...prev, [field]: '' }));
                return;
            }
            if (value.length > 12) return;
            const valorFormatado = formatarValorMonetario(value);
    
            setEditFormData(prev => ({ ...prev, [field]: valorFormatado }));
            return;
        }

        setEditFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleDeleteCategoria = async (categoria) => {
        setCategoriaToDelete(categoria);
        setShowDeletePopup(true);
    }

    const handleDeleteCategoriaTrue = async() => {
        try {
            await deleteCategoria(categoriaToDelete.id);
            toast.success(`Categoria ${categoriaToDelete.nome} excluída com sucesso!`);
            setCategoriaToDelete(null)
            setShowDeletePopup(false);
        } catch (error) {
            toast.error(error.response.data.mensagem);
            console.error("Erro ao excluir categoria:", error);
        }
        }

    const submitEditCategoria = async () => {
        if (!editFormData.nome.trim()) {
            toast.warn("Por favor, preencha o nome.");
            return;
        }
        
        if (editFormData.usarLimite && !editFormData.limiteDeGasto) {
            toast.warn("Por favor, digite um valor para colocar de limite estipulado.");
            return;
        }
        try {
            await editarCategoria(categoriaToEdit.id, editFormData);
            toast.success(`Categoria: ${categoriaToEdit.nome} editada com sucesso!`);
            setShowEditPopup(false);
            setCategoriaToEdit(null);
            handleCloseEditPopup();
        } catch (error) {
            toast.error("Erro ao atualizar o gasto. Tente novamente.");
            console.error("Erro ao atualizar gasto:", error);
        }
    };

    const submitCreateCategoria = async () => {
        if (!editFormData.nome.trim()) {
            toast.warn("Por favor, preencha o nome.");
            return;
        }
        
        if (editFormData.usarLimite && !editFormData.limiteDeGasto) {
            toast.warn("Por favor, digite um valor para colocar de limite estipulado.");
            return;
        }
        try {
            await createCategoria(editFormData);
            toast.success(`Categoria criada com sucesso!`);
            setShowCreatePopup(false);
            handleCloseEditPopup();
        } catch (error) {
            toast.error("Erro ao atualizar o gasto. Tente novamente.");
            console.error("Erro ao atualizar gasto:", error);
        }
    };

    return (
        <div className={styles.categoriasContainer}>
            <GridCard flex={1}>
            <h4>Categorias</h4>
            <div className={styles.categoriasDiv}>
                <div className={styles.categoriasGrid}>
                {loading ? (
                    <div className={styles.gastosLoading}>
                        <Loading />
                    </div>
                ) : (
                    <>
                    {categorias.map((categoria) => (
                        <CategoriaItem
                        key={categoria.id}
                        categoria={categoria}
                        onEdit={handleEditCategoria}
                        onDelete={handleDeleteCategoria}
                        />
                    ))}
                    <div className={styles.categoriaItemContainer} onClick={handleCreateCategoria}>
                        <div className={styles.categoriaIcon}>
                        <FaPlus size={24} />
                        </div>
                    </div>
                    </>
                )}
                </div>
            </div>
                <FormCategoriaPopup
                    show={showEditPopup}
                    formData={editFormData}
                    handleChange={handleEditChange}
                    handleClosePopup={handleCloseEditPopup}
                    submitCategoria={submitEditCategoria}    
                />
                <FormCategoriaPopup
                    show={showCreatePopup}
                    formData={editFormData}
                    handleChange={handleCreateChange}
                    handleClosePopup={handleCloseCreatePopup}
                    submitCategoria={submitCreateCategoria}    
                />
                <DeletePopup
                    show={showDeletePopup}
                    onClose={handleCloseDeletePopup}
                    onConfirm={handleDeleteCategoriaTrue}
                    infoToDelete={categoriaToDelete}
                    type={'CATEGORIA'}
                />
            </GridCard>
        </div>
    );
};

export default CategoriasPage;