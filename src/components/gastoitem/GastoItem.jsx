import React, { useState } from 'react';
import styles from './GastoItem.module.css';

function GastoItem({ gasto }) {
    const [expandido, setExpandido] = useState(false);

    const toggleExpandido = () => {
        setExpandido(!expandido);
    };

    const formatDate = (dataOriginal) =>{
        const [ano, mes, dia] = dataOriginal.split("-");

        return `${dia}/${mes}/${ano}`;
    }

    const parcelasRestantes = gasto.parcelas?.filter(p => new Date(p.dataVencimento) > new Date()).length || 0;

    return (
        <div 
            className={`${styles.gastoLine} ${expandido ? styles.expandido : ''}`} 
            onClick={toggleExpandido}
        >
            <div className={styles.gastoItem}>
                <input type="checkbox" name="" id="" />
                <div className={styles.gastoInfo}>
                    <div style={{width: '150px'}}>{gasto.descricao}</div>
                    <div style={{width: '100px'}}>{gasto.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                    <div style={{width: '90px'}}>{(gasto.numeroParcelas) > 1 ? gasto.numeroParcelas : 'A Vista' }</div>
                    <div style={{width: '140px'}}>{gasto.categoria.nome}</div>
                    <div style={{width: '140px'}}>{gasto.fonte}</div>
                    <div style={{width: '100px'}}>{formatDate(gasto.data)}</div>
                </div>
            </div>

            {expandido && (
                <div className={`${styles.gastoDetalhes} ${expandido ? styles.expandido : ''}`} >
                    <p>Apagar: <strong>{gasto.numeroParcelas}</strong></p>
                    <p>Parcelas Restantes: <strong>{parcelasRestantes}</strong></p>
                </div>
            )}
        </div>
    );
}

export default GastoItem;
