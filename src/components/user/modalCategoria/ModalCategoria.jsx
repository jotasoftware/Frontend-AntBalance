// ModalCategoria.jsx
import React, { useEffect, useState } from 'react';
import styles from './ModalCategoria.module.css';
import { toast } from 'react-toastify';
import { IoRemoveOutline, IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5";
import { obterIconeCategoria } from '@/utils/obterIconeCategoria';
import { FaPlus } from 'react-icons/fa6';
import { FaTimes } from 'react-icons/fa';
import Loading from '@/components/common/loading/Loading';
  

const ModalCategoria = ({ isOpen, onClose, onSelectCategoria, categorias, onAddCategoria, onDeleteCategoria, role, loadingAdd, loadingDelete }) => {
    const [novaCategoria, setNovaCategoria] = useState('');
    const [mostrarInputNova, setMostrarInputNova] = useState(false);
    const [categoriaDeletandoId, setCategoriaDeletandoId] = useState(null);


    const handleAddNovaCategoria = () => {
        if (novaCategoria.trim()) {
            const categoriaExiste = categorias.some(
                categoria => categoria.nome.toLowerCase() === novaCategoria.trim().toLowerCase()
            );

            if (categoriaExiste) {
                toast.warn(novaCategoria + ' já existe!');
                return;
            }

            onAddCategoria(novaCategoria.trim());
            setNovaCategoria('');
            setMostrarInputNova(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddNovaCategoria();
        }
    };

    const handleDeleteCategoria = (categoria, e) => {
        e.stopPropagation();
        setCategoriaDeletandoId(categoria.id);
        if (window.confirm('Tem certeza que deseja excluir ' + categoria.nome + '?')) {
            onDeleteCategoria(categoria);
        }else{
            setCategoriaDeletandoId(null);
        }
    };
    
    if (!isOpen) return null;


    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>{role == 'EMPRESARIAL' ? 'Selecione um plano de contas' : 'Selecione uma Categoria'}</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className={styles.categoriasGrid}>
                {categorias.map((categoria, index) => (
                    <button
                        key={categoria.id}
                        className={styles.categoriaItem}
                        onClick={() => {
                            if (categorias == null) {
                                setMostrarInputNova(true)
                            } else {
                                onSelectCategoria(categoria.nome, categoria.id);
                                onClose(); 
                            }
                            
                        }}
                    >
                        <span
                            className={styles.deleteButton}
                            onClick={(e) => handleDeleteCategoria(categoria, e)}
                            title='Excluir categoria'
                        >
                            <IoRemoveOutline size={12} />
                        </span>

                        <span className={styles.categoriaIcon}>
                            {categoriaDeletandoId === categoria.id && loadingDelete ? (
                                <div className={styles.categoriaDeleteLoading}>
                                <Loading />
                                </div>
                            ) : role === "EMPRESARIAL" ? (
                                index + 1
                            ) : (
                                obterIconeCategoria(categoria.nome)
                            )}
                        </span>
                        <span className={styles.categoriaNome}>
                            {categoria.nome}
                        </span>
                    </button>
                ))}
                {loadingAdd && <div
                        className={styles.categoriaLoading}
                    >
                        <div>
                            <Loading></Loading>
                        </div>
                    </div>}

                    {!mostrarInputNova ? (
                        <button
                            className={`${styles.categoriaItem} ${styles.addCategoriaButton}`}
                            onClick={() => setMostrarInputNova(true)}
                        >
                            <span className={styles.categoriaIcon}>
                                <FaPlus size={20} />
                            </span>
                            <span className={styles.categoriaNome}>{role === "EMPRESARIAL" ? "Novo plano" : "Nova categoria"}</span>
                        </button>
                    ) : (
                        <div className={styles.novaCategoriaInput}>
                            <input
                                type="text"
                                placeholder={role === "EMPRESARIAL" ? "Nome do plano de contas" : "Nome da categoria"}
                                value={novaCategoria}
                                onChange={(e) => {if(e.target.value.length <=15)setNovaCategoria(e.target.value)}}
                                onKeyPress={handleKeyPress}
                                autoFocus
                            />
                            <button 
                                className={styles.confirmButton}
                                onClick={handleAddNovaCategoria}
                            >
                                <IoCheckmarkOutline size={20} />

                            </button>
                            <button 
                                className={styles.cancelButton}
                                onClick={() => {
                                    setMostrarInputNova(false);
                                    setNovaCategoria('');
                                }}
                            >
                                <IoCloseOutline size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalCategoria;