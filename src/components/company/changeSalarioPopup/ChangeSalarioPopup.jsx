import React from 'react';
import styles from './ChangeSalarioPopup.module.css';

export function ChangeSalarioPopup({show, salaryIncreasePercent, handleSalaryIncreaseValue, handleChangeSalaryIncreasePercent, salaryIncreaseValue, handleCloseChangeSalarioPopup, submitEditSalary}) {
    if (!show) return null;

    return (
        <div className={styles.popupOverlay}>
        <div className={styles.popup}>
            <div className={styles.popupHeader}>
            <header>
                <span>Editar Salario</span>
            </header>
            <button
                className={styles.closeButton}
                onClick={handleCloseChangeSalarioPopup}
                aria-label="Fechar popup"
            >
                ×
            </button>
            </div>

            <div className={styles.popupContent}>
            <div className={styles.inputContainer}>
                <label htmlFor="percent">Aumento (%):</label>
                <input
                type="number"
                id="percent"
                placeholder="Digite a % de salário que deseja aumentar"
                value={salaryIncreasePercent}
                onChange={handleChangeSalaryIncreasePercent}
                />
            </div>

            <div className={styles.inputContainer}>
                <label htmlFor="valorDivisao">Valor de salário novo:</label>
                <input
                type="text"
                id="valorDivisao"
                placeholder="Digite o valor "
                value={salaryIncreaseValue}
                onChange={handleSalaryIncreaseValue}
                />
            </div>
            </div>

            <div className={styles.popupFooter}>
            <button
                className={styles.buttonCancel}
                onClick={handleCloseChangeSalarioPopup}
            >
                Cancelar
            </button>
            <button
                className={styles.buttonSubmit}
                onClick={submitEditSalary}
            >
                Salvar
            </button>
            </div>
        </div>
        </div>
    );
}
