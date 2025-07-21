import React, { useEffect } from 'react';
import styles from './SharePopup.module.css';
import Avatar from '@/components/common/avatar/Avatar';

export function SharePopup({show, shareEmail, valorDivisao, handleChangeShareEmail, handleShareValor, handleCloseSharePopup, submitShareGasto, pedidos, loading}) {

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
            {pedidos!=null && (pedidos.pendentes.length > 0 || pedidos.aceitos.length > 0) && (
                <div className={styles.shareContainer}>
                    <div className={styles.shareDiv}>
                        <span>Pendentes:</span>
                        <div className={styles.iconsShare}>
                            {pedidos.pendentes.map((item) => (
                                <div key={item.id} className={styles.item}>
                                <Avatar name={item.usuarioDoisId} size={25}shadow={'none'} borderSize={'2px solid white'}></Avatar>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.shareDiv}>
                    <span>Aceitos:</span>
                        <div className={styles.iconsShare}>
                            {pedidos.aceitos.map((item) => (
                                <div key={item.id} className={styles.item}>
                                <Avatar name={item.idUsuario} size={25}shadow={'none'} borderSize={'2px solid white'}></Avatar>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            </div>

            <div className={styles.popupFooter}>
            <button
                className={styles.buttonCancel}
                onClick={handleCloseSharePopup}
            >
                Cancelar
            </button>
            <button
                className={`${styles.buttonSubmit} ${loading ? styles.loading : ''}`}
                onClick={submitShareGasto}
                disabled={loading}
                >
                {loading ? 'Compartilhando...' : 'Compartilhar'}
            </button>
            </div>
        </div>
        </div>
    );
}
