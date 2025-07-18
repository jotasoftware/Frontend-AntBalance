import React from 'react';
import styles from './CategoriaItem.module.css';
import { obterIconeCategoria } from '@/utils/obterIconeCategoria';
import { TbUserShare, TbEdit, TbTrash } from "react-icons/tb";


const CategoriaItem = ({categoria, onEdit, onDelete}) => {

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(categoria);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(categoria);
  };

  return (
    <div className={styles.categoriaItemContainer}>
      <div className={styles.categoriaIcon}>
        {obterIconeCategoria(categoria.nome, 23)}
      </div>
      <div className={styles.categoriaItemInfo}>
        <span className={styles.categoriaItemName}>
          {categoria.nome}  
        </span>
        <span>
          {(!categoria.limiteDeGasto && categoria.limiteDeGasto!=0) ? 
            <p>Sem Limite</p>
          : 
            <p>Limite: {categoria.limiteDeGasto.toLocaleString
              ('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
              }) || 0}</p>
          }
        </span>
      </div>
      <div className={styles.actionOptions}>
        <div className={styles.actionIcon} onClick={handleEdit}>
            <TbEdit />
        </div>
        <div className={styles.actionIcon} onClick={handleDelete}>
            <TbTrash />
        </div>
      </div>
    </div>
  )
}

export default CategoriaItem;