import React from 'react';
import styles from './ExpanseSplit.module.css';
import { IoCheckmarkOutline } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";
import { useSplit } from '../../context/SplitExpanseContext';
import { useExpenses } from '../../context/ExpenseContext';


const ExpanseSplit = ({expenseSplit, onAction}) => {

  const { acceptSplit, refuseSplit } = useSplit();
  const { gastos, fetchGastos, fetchValores } = useExpenses();

  const clickAccept = async ()=>{
    try {
      await acceptSplit(expenseSplit.id); 
      await fetchGastos()
      await fetchValores()
      onAction()
    } catch (error) {
        toast.error("Não foi possível aceitar esse gasto.");
    }
  }

  const clickRefuse = async ()=>{
    try {
      await refuseSplit(expenseSplit.id); 
      onAction()
      console.log("recusado com sucesso")
    } catch (error) {
        toast.error("Não foi possível recusar esse gasto.");
    }
  }

  return (
    <div className={styles.expanseContainer}>
      <h6>Divisão de gasto</h6>
      <div className={styles.dataContainer}>
        <p className={styles.mes}>{expenseSplit.usuarioUmId} te enviou um gasto de {expenseSplit.valorDividido.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        })}
        </p>
      </div>
      <div className={styles.actions}>
          <div className={styles.accept} onClick={clickAccept}>
            <IoCheckmarkOutline/> 
          </div>
          <div className={styles.refuse} onClick={clickRefuse}>
            <IoCloseOutline />
          </div>
        </div>
    </div>
  )
}

export default ExpanseSplit;