import React, { useState } from 'react';
import styles from './GastoItem.module.css';

function GastoItem({ gasto }) {
    const [expandido, setExpandido] = useState(false);

    const toggleExpandido = () => {
        setExpandido(!expandido);
    };

    const parcelasRestantes = gasto.parcelas?.filter(p => new Date(p.dataVencimento) > new Date()).length || 0;

    return (
        <div 
            className={`${styles.gastoItem} ${expandido ? styles.expandido : ''}`} 
            onClick={toggleExpandido}
        >
            <div className={styles.gastoInfo}>
                <h4>{gasto.descricao}</h4>
                <p>Fonte: {gasto.fonte}</p>
            </div>
            <div className={styles.gastoValorData}>
                <p>R$ {gasto.valorTotal.toFixed(2)}</p>
                <p>{new Date(gasto.data).toLocaleDateString()}</p>
            </div>

            {expandido && (
                <div className={`${styles.gastoDetalhes} ${expandido ? styles.expandido : ''}`} >
                    <p>Total de Parcelas: <strong>{gasto.numeroParcelas}</strong></p>
                    <p>Parcelas Restantes: <strong>{parcelasRestantes}</strong></p>
                </div>
            )}
        </div>
    );
}

export default GastoItem;
