import React from 'react';
import styles from './SharePopup.module.css';

export function SharePopup({show, shareEmail, valorDivisao, handleChangeShareEmail, handleShareValor, handleCloseSharePopup, submitShareGasto}) {
    if (!show) return null;

    return (
        <div className={styles.popupOverlay}>
        <div className={styles.popup}>
            <div className={styles.popupHeader}>
            <header>
                <span>Compartilhar Gasto</span>
            </header>
            <button
                className={styles.closeButton}
                onClick={handleCloseSharePopup}
                aria-label="Fechar popup"
            >
                ×
            </button>
            </div>

            <div className={styles.popupContent}>
            <div className={styles.inputContainer}>
                <label htmlFor="shareEmail">E-mail do destinatário:</label>
                <input
                type="email"
                id="shareEmail"
                placeholder="Digite o email para compartilhar"
                value={shareEmail}
                onChange={handleChangeShareEmail}
                />
            </div>

            <div className={styles.inputContainer}>
                <label htmlFor="valorDivisao">Valor para dividir:</label>
                <input
                type="text"
                id="valorDivisao"
                placeholder="Digite o valor a dividir"
                value={valorDivisao}
                onChange={handleShareValor}
                />
            </div>
            </div>

            <div className={styles.popupFooter}>
            <button
                className={styles.buttonCancel}
                onClick={handleCloseSharePopup}
            >
                Cancelar
            </button>
            <button
                className={styles.buttonSubmit}
                onClick={submitShareGasto}
            >
                Compartilhar
            </button>
            </div>
        </div>
        </div>
    );
}
