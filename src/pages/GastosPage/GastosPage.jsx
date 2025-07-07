import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './GastosPage.module.css';
import { toast } from 'react-toastify';
import Botao from '../../components/botao/Botao';
import { IoPrintOutline } from "react-icons/io5";
import { FaSquarePlus } from "react-icons/fa6";
import GridCard from '../../components/gridcard/GridCard';
import GastoItem from '../../components/gastoitem/GastoItem';
import { useExpenses } from '../../context/ExpenseContext';

function GastosPage() {
    const [sortOrder, setSortOrder] = useState('recentes');
    const { token } = useAuth();
    const {gastos} = useExpenses();
    console.log(gastos);
    const gastosOrdenados = useMemo(() => {
        const sorted = [...gastos];
        sorted.sort((a, b) => {
            switch (sortOrder) {
                case 'maior_valor':
                    return b.valorTotal - a.valorTotal;
                case 'menor_valor':
                    return a.valorTotal - b.valorTotal;
                case 'antigos':
                    return new Date(a.data) - new Date(b.data);
                case 'recentes':
                default:
                    return new Date(b.data) - new Date(a.data);
            }
        });
        return sorted;
    }, [gastos, sortOrder]);

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };

    return (
        <div className={styles.gastosContainer}>
            <GridCard flex={1}>
                <div className={styles.gastosHeaderContainer}>
                    <div className={styles.gastosTitle}>
                        <h4>Gastos</h4>
                        <div className={styles.sortContainer}>
                            <label htmlFor="sort">Ordenar por </label>
                            <select
                                id="sort"
                                value={sortOrder}
                                onChange={handleSortChange}
                                className={styles.sortSelect}
                            >
                                <option value="recentes">Mais Recentes</option>
                                <option value="antigos">Mais Antigos</option>
                                <option value="maior_valor">Maior Valor</option>
                                <option value="menor_valor">Menor Valor</option>
                            </select>
                        </div>
                    </div>
                    <div className={styles.gastosActions}>
                        <Botao icon={<FaSquarePlus size={24} color={"white"} />} name={"Adicionar"} />
                        <Botao icon={<IoPrintOutline size={24} color={"white"} />} name={"Imprimir"} />
                    </div>
                </div>

                <div className={styles.gastosLista}>
                    {gastosOrdenados.length === 0 ? (
                        <p>Nenhum gasto encontrado.</p>
                    ) : (
                        gastosOrdenados.map((gasto) => (
                            <GastoItem key={gasto.id} gasto={gasto} />
                        ))
                    )}
                </div>
            </GridCard>
        </div>
    );
}

export default GastosPage;
