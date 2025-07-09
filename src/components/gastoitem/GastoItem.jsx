import React, { useState } from 'react';
import styles from './GastoItem.module.css';
import { TbUserShare, TbEdit, TbTrash, TbCheck } from "react-icons/tb";

const GastoItem = ({ gasto, expandido, onToggle, isSelected, onSelect, type }) => {
    console.log(type)
    const formatDate = (dataOriginal) => {
        const dateObj = new Date(dataOriginal);
        const dia = String(dateObj.getDate()).padStart(2, '0');
        const mes = String(dateObj.getMonth() + 1).padStart(2, '0');
        const ano = dateObj.getFullYear();
        return `${dia}/${mes}/${ano}`;
      };

    const handleShare = (e) => {
        e.stopPropagation();
    };

    const handleEdit = (e) => {
        e.stopPropagation();
    };

    const handleDelete = (e) => {
        e.stopPropagation();
    };
    
    const handleActive = (e) => {
        e.stopPropagation();
    };

    const handleDeleteForever = (e) => {
        e.stopPropagation();
    };

    const handleCheckboxChange = (e) => {
        e.stopPropagation();
        onSelect(gasto.id);
    };

    return (
        <div 
            className={`${styles.gastoLine} ${expandido ? styles.expandido : ''} ${isSelected ? styles.selected : ''}`}
            onClick={onToggle}
        >
            <div className={styles.gastoItem}>
                <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={handleCheckboxChange}
                    onClick={(e) => e.stopPropagation()}
                />
                <div className={styles.gastoInfo}>
                    <div style={{width: '150px'}}>{gasto.descricao}</div>
                    <div style={{width: '100px'}}>
                        {gasto.valorTotal.toLocaleString('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL' 
                        })}
                    </div>
                    <div style={{width: '90px'}}>
                        {(gasto.numeroParcelas) > 1 ? gasto.numeroParcelas : 'A Vista'}
                    </div>
                    <div style={{width: '140px'}}>{gasto.categoria.nome}</div>
                    <div style={{width: '140px'}}>{gasto.fonte}</div>
                    <div style={{width: '100px'}}>{formatDate(gasto.data)}</div>
                </div>
            </div>

            {expandido && (
                <div className={`${styles.gastoDetalhes} ${expandido ? styles.expandido : ''}`}>
                    <div className={styles.actionIconsDiv}>
                    {type === 'active' ? (
                        <>
                        <div className={styles.actionIcon} onClick={handleShare}>
                            <TbUserShare />
                        </div>
                        <div className={styles.actionIcon} onClick={handleEdit}>
                            <TbEdit />
                        </div>
                        <div className={styles.actionIcon} onClick={handleDelete}>
                            <TbTrash />
                        </div>
                        </>
                    ) : (
                        <>
                        <div className={styles.actionIcon} onClick={handleActive}>
                            <TbCheck />
                        </div>
                        <div className={styles.actionIcon} onClick={handleDeleteForever}>
                            <TbTrash />
                        </div>
                        </>
                    )}
                    </div>
                </div>
                )}
        </div>
    );
}

export default GastoItem;