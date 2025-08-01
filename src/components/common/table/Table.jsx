import React, { useEffect, useState } from 'react';
import GastoItem from '@/components/user/gastoitem/GastoItem';
import Loading from '@/components/common/loading/Loading';
import styles from './Table.module.css';

function Table({ gastos, selectedGastos, onSelectGasto, isGastoSelected, selectAll, onSelectAll, type, onShareGasto, onEditGasto, onDeleteGasto, onActiveGasto, loading, isMobile, role }) {
    const [gastoExpandidoId, setGastoExpandidoId] = useState(null);

    const handleToggle = (id) => {
        setGastoExpandidoId(prevId => (prevId === id ? null : id));
    };

    return (
        <div className={styles.gastosLista}>
            <div className={styles.tableHeaderGasto}>
                <input 
                    type="checkbox" 
                    checked={selectAll}
                    onChange={onSelectAll}
                    title="Selecionar todos"
                />
                <div>
                    <div style={{width: '150px'}}>Gastos</div>
                    <div style={{width: '100px'}}>Valor</div>
                    {!isMobile &&
                        (role == "EMPRESARIAL" ? <>
                            <div style={{width: '170px'}}>Plano de contas</div>
                            <div style={{width: '150px'}}>Fonte</div>
                            <div style={{width: '110px'}}>Data</div>
                        </> : <>
                            <div style={{width: '90px'}}>Parcelas</div>
                            <div style={{width: '140px'}}>Categoria</div>
                            <div style={{width: '140px'}}>Fonte</div>
                            <div style={{width: '100px'}}>Data</div>
                        </>)
                    }
                </div>
            </div>
            <div className={styles.tableBodyGasto}>
              {loading ? (
                    <div className={styles.gastosLoading}>
                        <Loading></Loading>
                    </div>
                ) : 
                (gastos.length === 0 ? (
                    <p>Nenhum gasto cadastrado.</p>
                ) : (
                    gastos.map((gasto) => (
                        <GastoItem 
                            key={gasto.id} 
                            gasto={gasto} 
                            expandido={gastoExpandidoId === gasto.id}
                            onToggle={() => handleToggle(gasto.id)}
                            isSelected={isGastoSelected(gasto.id)}
                            onSelect={onSelectGasto}
                            type={type}
                            onShare={onShareGasto}
                            onEdit={onEditGasto}
                            onDelete={onDeleteGasto}
                            onDeleteForever={onDeleteGasto}
                            onActive={onActiveGasto}
                            isMobile={isMobile}
                            role={role}
                        />
                    ))
                ))}
            </div>
        </div>
    );
}

export default Table;