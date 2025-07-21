import React from 'react';
import styles from './EditFuncionarioPopup.module.css';

export function EditFuncionarioPopup({ show, editFormData, handleEditChange,setModalSetorAberto, handleCloseEditPopup, submitEditFuncionario, loading}) {
    if (!show) return null;

    return (
        <div className={styles.popupOverlay}>
        <div className={styles.popup}>
            <div className={styles.popupHeader}>
            <header>
                <span>Editar Funcionario</span>
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
                placeholder="Nome do funcionario"
                value={editFormData.nome}
                onChange={(e) => handleEditChange('nome', e.target.value)}
                />
            </div>
            
            <div className={styles.inputContainer}>
                <label htmlFor="editNome">Telefone:</label>
                <input
                type="text"
                id="editTelefone"
                placeholder="Nome do funcionario"
                value={editFormData.telefone}
                onChange={(e) => handleEditChange('telefone', e.target.value)}
                />
            </div>

            <div className={styles.inputContainer}>
                <label htmlFor="editFonte">Cargo:</label>
                <input
                type="text"
                id="editFonte"
                placeholder="Fonte do gasto"
                value={editFormData.cargo}
                onChange={(e) => handleEditChange('cargo', e.target.value)}
                />
            </div>

            <div className={styles.inputContainer}>
                <label htmlFor="categoria">Setor:</label>
                <button
                type="button"
                className={styles.categoriaSelectButton}
                onClick={() => setModalSetorAberto(true)}
                >
                {editFormData.setorNome || 'Selecione o setor'}
                </button>
            </div>

            <div className={styles.inputContainer}>
                <label htmlFor="Salario">Salario: </label>
                <input
                    type="text"
                    name='salario'
                    id='salario'
                    placeholder='R$ 0,00'
                    value={editFormData.salario}
                    onChange={(e) => handleEditChange('salario', e.target.value)}
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
                onClick={submitEditFuncionario}
                disabled={loading}
                >
                {loading ? 'Salvando...' : 'Salvar alterações'}
            </button>
            </div>
        </div>
        </div>
    );
}
