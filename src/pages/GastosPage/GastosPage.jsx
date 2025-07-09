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
import { Link } from 'react-router-dom';
import Table from '../../components/table/Table';
import { FaTrash } from "react-icons/fa";
import Loading from '../../components/loading/Loading';

function GastosPage() {
    const [sortOrder, setSortOrder] = useState('recentes');
    const { token } = useAuth();
    const {gastos, loading} = useExpenses();
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
                        <Link to="/cadastrogasto"><Botao icon={<FaSquarePlus size={24} color={"white"}/>} name={"Adicionar"}/></Link>
                        <Botao icon={<IoPrintOutline size={24} color={"white"} />} name={"Imprimir"} />
                    </div>
                </div>
                {loading ? <Loading></Loading> : <Table gastos={gastosOrdenados}></Table>}
                <div className={styles.botaoApagar}>
                    <Botao icon={<FaTrash size={20} color={"white"} />} name={"Apagar"} />
                </div>
            </GridCard>
        </div>
    );
}

export default GastosPage;
