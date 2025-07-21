import React, { useState } from 'react';
import styles from './ExpanseSplit.module.css';
import { IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5";
import { useSplit } from '@/context/SplitExpanseContext';
import { useExpenses } from '@/context/ExpenseContext';
import Loading from '@/components/common/loading/Loading';
import { toast } from 'react-toastify';

const ExpanseSplit = ({ expenseSplit, onAction }) => {
  const { acceptSplit, refuseSplit } = useSplit();
  const { fetchGastos, fetchValores } = useExpenses();

  const [loadingType, setLoadingType] = useState(null);

  const clickAccept = async () => {
    setLoadingType('accept');
    try {
      await acceptSplit(expenseSplit.id); 
      await fetchGastos();
      await fetchValores();
      onAction();
    } catch (error) {
      toast.error("Não foi possível aceitar esse gasto.");
    } finally {
      setLoadingType(null);
    }
  };

  const clickRefuse = async () => {
    setLoadingType('refuse');
    try {
      await refuseSplit(expenseSplit.id); 
      onAction();
    } catch (error) {
      toast.error("Não foi possível recusar esse gasto.");
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className={styles.expanseContainer}>
      <h6>Divisão de gasto</h6>
      <div className={styles.dataContainer}>
        <p className={styles.mes}>
          {expenseSplit.usuarioUmId} te enviou um gasto de {expenseSplit.valorDividido.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </p>
      </div>

      <div className={styles.actions}>
        {loadingType ? (
          <div className={styles.loadingWrapper}>
            <Loading style={{ width: '16px', height: '16px' }} />
          </div>
        ) : (
          <>
            <div className={styles.accept} onClick={clickAccept}>
              <div className={styles.iconWrapper}>
                <IoCheckmarkOutline />
              </div>
            </div>
            <div className={styles.refuse} onClick={clickRefuse}>
              <div className={styles.iconWrapper}>
                <IoCloseOutline />
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default ExpanseSplit;
