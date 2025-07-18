import React from 'react';
import styles from './FormCategoriaPopup.module.css';

export function FormCategoriaPopup({show, formData, handleChange, handleClosePopup, submitCategoria}) {
    if (!show) return null;

    return (
        <div className={styles.popupOverlay}>
        <div className={styles.popup}>
            <div className={styles.popupHeader}>
            <header>
                <span>Editar Categoria</span>
            </header>
            <button
                className={styles.closeButton}
                onClick={handleClosePopup}
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
                    placeholder="Nome da categoria"
                    className={styles.inputEditNome}
                    value={formData.nome}
                    onChange={(e) => {if(e.target.value.length <=15)handleChange('nome', e.target.value)}}
                    />
                </div>

                <div className={styles.inputContainer}>
                    <div className={styles.labelSwitchWrapper}>
                        <label htmlFor="editLimite">Limite:</label>
                        <label className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={formData.usarLimite}
                            onChange={(e) => handleChange('usarLimite', e.target.checked)}
                        />
                        <span className={styles.slider}></span>
                        </label>
                    </div>

                    <div className={styles.limiteWrapper}>
                        <input
                        type="text"
                        id="editLimite"
                        placeholder='0,00'
                        value={formData.limiteDeGasto}
                        onChange={(e) => handleChange('limiteDeGasto', e.target.value)}
                        disabled={!formData.usarLimite}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.popupFooter}>
            <button
                className={styles.buttonCancel}
                onClick={handleClosePopup}
            >
                Cancelar
            </button>
            <button
                className={styles.buttonSubmit}
                onClick={submitCategoria}
            >
                Salvar alterações
            </button>
            </div>
        </div>
        </div>
    );
}
