import React from 'react';
import styles from './EditPopup.module.css';

export function EditPopup({ show, editFormData, handleEditChange,setModalCategoriaAberto, handleCloseEditPopup, submitEditGasto, loading}) {
    if (!show) return null;
    
    return (
        <div className={styles.popupOverlay}>
        <div className={styles.popup}>
            <div className={styles.popupHeader}>
            <header>
                <span>Editar Gasto</span>
            </header>
            <button
                className={styles.closeButton}
                onClick={handleCloseEditPopup}
                aria-label="Fechar popup"
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
                <label htmlFor="categoria">Categoria de Gasto:</label>
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

            <div className={styles.popupFooter}>
            <button
                className={styles.buttonCancel}
                onClick={handleCloseEditPopup}
            >
                Cancelar
            </button>
            <button
                className={`${styles.buttonSubmit} ${loading ? styles.loading : ''}`}
                onClick={submitEditGasto}
                disabled={loading}
                >
                {loading ? 'Salvando...' : 'Salvar alterações'}
            </button>
            </div>
        </div>
        </div>
    );
}
