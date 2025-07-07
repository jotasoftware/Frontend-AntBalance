import React from 'react';
import styles from './ExpanseSplit.module.css';
import { IoCheckmarkOutline } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";


const ExpanseSplit = ({expenseSplit}) => {
  return (
    <div className={styles.expanseContainer}>
      <h6>Divisão de gasto</h6>
      <div className={styles.dataContainer}>
        <p className={styles.mes}>{expenseSplit.nome} deseja dividir um gasto de {expenseSplit.valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        })}
        </p>
      </div>
      <div className={styles.actions}>
          <div className={styles.accept}>
            <IoCheckmarkOutline/> 
          </div>
          <div className={styles.refuse}>
            <IoCloseOutline />
          </div>
        </div>
    </div>
  )
}

export default ExpanseSplit;