import React, { useState } from 'react';
import styles from './GastoItem.module.css';
import { TbUserShare, TbEdit, TbTrash } from "react-icons/tb";

function GastoItem({ gasto, expandido, onToggle }) {
    const formatDate = (dataOriginal) =>{
        const [ano, mes, dia] = dataOriginal.split("-");

        return `${dia}/${mes}/${ano}`
    }

    const handleShare = (e)=>{
        e.stopPropagation()
    }
    const handleEdit = (e)=>{
        e.stopPropagation()
    }
    const handleDelete = (e)=>{
        e.stopPropagation()
    }

    return (
        <div 
            className={`${styles.gastoLine} ${expandido ? styles.expandido : ''}`} 
            onClick={onToggle}
        >
            <div className={styles.gastoItem}>
                <input type="checkbox" name="" id="" onClick={(e) => e.stopPropagation()}/>
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
                    <div className={styles.actionIconsDiv}>
                        <div className={styles.actionIcon} onClick={handleShare}>
                            <TbUserShare/>  
                        </div>
                        <div className={styles.actionIcon} onClick={handleEdit}>
                            <TbEdit />
                        </div>
                        <div className={styles.actionIcon} onClick={handleDelete}>
                            <TbTrash/>  
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GastoItem;
