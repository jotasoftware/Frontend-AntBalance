import React, { useEffect, useState } from 'react';
import FuncionarioItem from '../funcionarioItem/FuncionarioItem';
import Loading from '@/components/common/loading/Loading';
import styles from './TableFuncionario.module.css';

function TableFuncionario({ funcionarios, onSelectFuncionario, isFuncionarioSelected, selectAll, onSelectAll, type, onEditFuncionario, onDeleteFuncionario, onActiveFuncionario, loading, isMobile }) {
    const [funcionarioExpandidoId, setFuncionarioExpandidoId] = useState(null);

    const handleToggle = (id) => {
        setFuncionarioExpandidoId(prevId => (prevId === id ? null : id));
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
                    <div style={{width: '150px'}}>Funcionario</div>
                    <div style={{width: '100px'}}>Salário</div>
                    {!isMobile &&
                        <>
                            <div style={{width: '120px'}}>Telefone</div>
                            <div style={{width: '130px'}}>Setor</div>
                            <div style={{width: '100px'}}>Cargo</div>
                            <div style={{width: '130px'}}>Data Cadastro</div>
                        </>
                    }
                </div>
            </div>
            <div className={styles.tableBodyGasto}>
              {loading ? (
                    <div className={styles.gastosLoading}>
                        <Loading></Loading>
                    </div>
                ) : 
                (funcionarios.length === 0 ? (
                    <p>Nenhum funcionário cadastrado.</p>
                ) : (
                    funcionarios.map((funcionario) => (
                        <FuncionarioItem 
                            key={funcionario.id} 
                            funcionario={funcionario} 
                            expandido={funcionarioExpandidoId === funcionario.id}
                            onToggle={() => handleToggle(funcionario.id)}
                            isSelected={isFuncionarioSelected(funcionario.id)}
                            onSelect={onSelectFuncionario}
                            type={type}
                            onEdit={onEditFuncionario}
                            onDelete={onDeleteFuncionario}
                            onDeleteForever={onDeleteFuncionario}
                            onActive={onActiveFuncionario}
                            isMobile={isMobile}
                        />
                    ))
                ))}
            </div>
        </div>
    );
}

export default TableFuncionario;