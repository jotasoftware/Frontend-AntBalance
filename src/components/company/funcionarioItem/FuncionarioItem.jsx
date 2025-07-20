import React, { useState } from 'react';
import styles from './FuncionarioItem.module.css';
import { IoMdUndo } from "react-icons/io";
import { TbEdit, TbTrash } from "react-icons/tb";

const FuncionarioItem = ({ funcionario, expandido, onToggle, isSelected, onSelect, type, onEdit, onDelete, onDeleteForever, onActive, isMobile}) => {
    const formatDate = (dataOriginal) => {
        const dateObj = new Date(dataOriginal);
        const dia = String(dateObj.getDate()).padStart(2, '0');
        const mes = String(dateObj.getMonth() + 1).padStart(2, '0');
        const ano = dateObj.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };

    const handleEditSalary = (e) => {
        e.stopPropagation();
        onEditSalary(funcionario);
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        onEdit(funcionario);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(funcionario);
    };
    
    const handleActive = (e) => {
        e.stopPropagation();
        onActive(funcionario);
    };

    const handleDeleteForever = (e) => {
        e.stopPropagation();
        onDeleteForever(funcionario);
    };

    const handleCheckboxChange = (e) => {
        e.stopPropagation();
        onSelect(funcionario.id);
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
                    <div style={{width: '150px'}}>{funcionario.nome}</div>
                    <div style={{width: '100px'}}>
                        {funcionario.salario.toLocaleString('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL' 
                        })}
                    </div>
                    {!isMobile &&
                        <>
                            <div style={{width: '120px'}}>
                                {funcionario.telefone}
                            </div>
                            <div style={{width: '130px'}}>{funcionario.setor?.nome}</div>
                            <div style={{width: '100px'}}>{funcionario.cargo}</div>
                            <div style={{width: '130px'}}>{formatDate(funcionario.dataCadastro)}</div>
                        </>
                    }
                    
                </div>
            </div>

            {expandido && (
                <div className={`${styles.gastoDetalhes} ${expandido ? styles.expandido : ''}`}>
                    {isMobile &&
                        <div className={styles.gastoMobileInfo}>
                            <div>{funcionario.telefone}</div>
                            <div>{funcionario.setor?.nome}</div>
                            <div>{funcionario.cargo}</div>
                            <div>{formatDate(funcionario.dataCadastro)}</div>
                        </div>
                    }
                    <div className={styles.actionIconsDiv}>
                    {type === 'active' ? (
                        <>
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

export default FuncionarioItem;