import React, { useState, useMemo } from 'react';
import styles from './Table.module.css';
import GastoItem from '../gastoitem/GastoItem';

const Table = ({gastos}) => {
  
  return (
    <div className={styles.gastosLista}>
        <div className={styles.tableHeaderGasto}>
          <input type="checkbox" name="" id="" />
          <div>
            <div style={{width: '150px'}}>Gastos</div>
            <div style={{width: '100px'}}>Valor</div>
            <div style={{width: '90px'}}>Parcelas</div>
            <div style={{width: '140px'}}>Categoria</div>
            <div style={{width: '140px'}}>Fonte</div>
            <div style={{width: '100px'}}>Data</div>
          </div>
        </div>
        <div className={styles.tableBodyGasto}>
          {gastos.length === 0 ? (
              <p>Nenhum gasto encontrado.</p>
          ) : (
              (gastos.map((gasto) => (
                  <GastoItem key={gasto.id} gasto={gasto} />
              )))
          )}
          {gastos.length === 0 ? (
              <p>Nenhum gasto encontrado.</p>
          ) : (
              (gastos.map((gasto) => (
                  <GastoItem key={gasto.id} gasto={gasto} />
              )))
          )}
          {gastos.length === 0 ? (
              <p>Nenhum gasto encontrado.</p>
          ) : (
              (gastos.map((gasto) => (
                  <GastoItem key={gasto.id} gasto={gasto} />
              )))
          )}
        </div>
    </div>
  );
};

export default Table;