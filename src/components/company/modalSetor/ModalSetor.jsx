import React, { useState } from 'react';
import styles from './ModalSetor.module.css';
import { toast } from 'react-toastify';
import { IoRemoveOutline, IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5";
import {FaPlus, FaTimes} from 'react-icons/fa';
import Loading from '@/components/common/loading/Loading';


const ModalSetor = ({ isOpen, onClose, onSelectSetor, setores, onAddSetor, onDeleteSetor, loadingAdd, loadingDelete }) => {
    const [novoSetor, setNovoSetor] = useState('');
    const [mostrarInputNovo, setMostrarInputNovo] = useState(false);
    const [setorDeletandoId, setSetorDeletandoId] = useState(null)


    const handleAddNovoSetor = () => {
        if (novoSetor.trim()) {
            const setorExiste = setores.some(
                setor => setor.nome.toLowerCase() === novoSetor.trim().toLowerCase()
            );

            if (setorExiste) {
                toast.warn(novoSetor + ' já existe!');
                return;
            }

            onAddSetor(novoSetor.trim());
            setNovoSetor('');
            setMostrarInputNovo(false);
            console.log(novoSetor)
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddNovoSetor();
        }
    };

    const handleDeleteSetor = (setor, e) => {
        e.stopPropagation();
        setSetorDeletandoId(setor.id);
        if (window.confirm('Tem certeza que deseja excluir ' + setor.nome + '?')) {
            onDeleteSetor(setor);
        }else{
            setSetorDeletandoId(null)
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Selecione um Setor</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className={styles.setoresGrid}>
                    {setores.map((setor, index) => (
                        <button
                            key={setor.id}
                            className={styles.setorItem}
                            onClick={() => {
                                if (setores == null) {
                                    setMostrarInputNovo(true)
                                } else {
                                    onSelectSetor(setor.nome, setor.id);
                                    onClose();
                                }

                            }}
                        >
                            <span
                                className={styles.deleteButton}
                                onClick={(e) => handleDeleteSetor(setor, e)}
                                title='Excluir setor'
                            >
                                <IoRemoveOutline size={12} />
                            </span>
                            <span className={styles.setorIcon}>
                                {setorDeletandoId === setor.id && loadingDelete ? (
                                    <div className={styles.setorDeleteLoading}>
                                        <Loading />
                                    </div>
                                ) : (
                                    index + 1
                                )}
                            </span>
                            <span className={styles.setorNome}>
                                {setor.nome}
                            </span>
                        </button>
                    ))}

                    {loadingAdd && <div
                        className={styles.setorLoading}
                    >
                        <div>
                            <Loading></Loading>
                        </div>
                    </div>}

                    {!mostrarInputNovo ? (
                        <button
                            className={`${styles.setorItem} ${styles.addSetorButton}`}
                            onClick={() => setMostrarInputNovo(true)}
                        >
                            <span className={styles.setorIcon}>
                                <FaPlus size={20} />
                            </span>
                            <span className={styles.setorNome}>Novo Setor</span>
                        </button>
                    ) : (
                        <div className={styles.novoSetorInput}>
                            <input
                                type="text"
                                placeholder="Nome do setor"
                                value={novoSetor}
                                onChange={(e) => { if (e.target.value.length <= 15) setNovoSetor(e.target.value) }}
                                onKeyPress={handleKeyPress}
                                autoFocus
                            />
                            <button
                                className={styles.confirmButton}
                                onClick={handleAddNovoSetor}
                            >
                                <IoCheckmarkOutline size={20} />

                            </button>
                            <button
                                className={styles.cancelButton}
                                onClick={() => {
                                    setMostrarInputNovo(false);
                                    setNovoSetor('');
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

export default ModalSetor;