import React, { useState } from 'react';
import styles from './GastoItem.module.css';
import { IoMdUndo } from "react-icons/io";
import { TbUserShare, TbEdit, TbTrash } from "react-icons/tb";

const GastoItem = ({ gasto, expandido, onToggle, isSelected, onSelect, type, onShare, onEdit, onDelete, onDeleteForever, onActive, isMobile, role}) => {
    const formatDate = (dataOriginal) => {
        const dateObj = new Date(dataOriginal);
        const dia = String(dateObj.getDate()).padStart(2, '0');
        const mes = String(dateObj.getMonth() + 1).padStart(2, '0');
        const ano = dateObj.getFullYear();
        return `${dia}/${mes}/${ano}`;
      };

    const handleShare = (e) => {
        e.stopPropagation();
        onShare(gasto);
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        onEdit(gasto);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(gasto);
    };
    
    const handleActive = (e) => {
        e.stopPropagation();
        onActive(gasto);
    };

    const handleDeleteForever = (e) => {
        e.stopPropagation();
        onDeleteForever(gasto);
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
                    {!isMobile &&
                       (role == "EMPRESARIAL" ? <>
                            <div style={{width: '170px'}}>{gasto.categoria.nome}</div>
                            <div style={{width: '150px'}}>{gasto.fonte}</div>
                            <div style={{width: '110px'}}>{formatDate(gasto.data)}</div>
                        </> : <>
                            <div style={{width: '90px'}}>
                                {(gasto.numeroParcelas) > 1 ? gasto.numeroParcelas : 'À Vista'}
                            </div>
                            <div style={{width: '140px'}}>{gasto.categoria.nome}</div>
                            <div style={{width: '140px'}}>{gasto.fonte}</div>
                            <div style={{width: '100px'}}>{formatDate(gasto.data)}</div>
                        </>)
                    }
                    
                </div>
            </div>

            {expandido && (
                <div className={`${styles.gastoDetalhes} ${expandido ? styles.expandido : ''}`}>
                    {isMobile &&
                        <div className={styles.gastoMobileInfo}>
                            <div>
                                {(gasto.numeroParcelas) > 1 ? gasto.numeroParcelas : 'À Vista'}
                            </div>
                            <div>{gasto.categoria.nome}</div>
                            <div>{gasto.fonte}</div>
                            <div>{formatDate(gasto.data)}</div>
                        </div>
                    }
                    <div className={styles.actionIconsDiv}>
                    {type === 'active' ? (
                        <>
                        {role == "PESSOAL" &&
                            <div className={styles.actionIcon} onClick={handleShare}>
                            <TbUserShare />
                            </div>
                        }
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
                            <IoMdUndo />
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