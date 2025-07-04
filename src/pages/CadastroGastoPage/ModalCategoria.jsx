// ModalCategoria.jsx
import React, { useState } from 'react';
import styles from './CadastroGastoPage.module.css';
import { FaTimes, FaPlus, FaUtensils, FaShoppingCart, FaFileInvoiceDollar, FaMoneyCheckAlt, FaEllipsisH } from "react-icons/fa";

const ModalCategoria = ({ isOpen, onClose, onSelectCategoria, categorias, onAddCategoria }) => {
    const [novaCategoria, setNovaCategoria] = useState('');
    const [mostrarInputNova, setMostrarInputNova] = useState(false);

    const iconesCategorias = {
        'Supermercado': <FaShoppingCart size={20} />,
        'Alimentação': <FaUtensils size={20} />,
        'Contas': <FaFileInvoiceDollar size={20} />,
        'Taxas': <FaMoneyCheckAlt size={20} />,
        'Outros': <FaEllipsisH size={20} />
    };

    const handleAddNovaCategoria = () => {
        if (novaCategoria.trim()) {
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

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Selecione uma Categoria</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className={styles.categoriasGrid}>
                    {categorias.map((categoria) => (
                        <button
                            key={categoria}
                            className={styles.categoriaItem}
                            onClick={() => {
                                onSelectCategoria(categoria);
                                onClose();
                            }}
                        >
                            <span className={styles.categoriaIcon}>
                                {iconesCategorias[categoria] || <FaEllipsisH size={20} />}
                            </span>
                            <span className={styles.categoriaNome}>{categoria}</span>
                        </button>
                    ))}

                    {!mostrarInputNova ? (
                        <button
                            className={`${styles.categoriaItem} ${styles.addCategoriaButton}`}
                            onClick={() => setMostrarInputNova(true)}
                        >
                            <span className={styles.categoriaIcon}>
                                <FaPlus size={20} />
                            </span>
                            <span className={styles.categoriaNome}>Nova Categoria</span>
                        </button>
                    ) : (
                        <div className={styles.novaCategoriaInput}>
                            <input
                                type="text"
                                placeholder="Nome da categoria"
                                value={novaCategoria}
                                onChange={(e) => setNovaCategoria(e.target.value)}
                                onKeyPress={handleKeyPress}
                                autoFocus
                            />
                            <button 
                                className={styles.confirmButton}
                                onClick={handleAddNovaCategoria}
                            >
                                ✓
                            </button>
                            <button 
                                className={styles.cancelButton}
                                onClick={() => {
                                    setMostrarInputNova(false);
                                    setNovaCategoria('');
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalCategoria;