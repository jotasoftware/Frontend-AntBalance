import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './GastosPage.module.css';
import { toast } from 'react-toastify';
import Botao from '../../components/botao/Botao';
import { IoPrintOutline } from "react-icons/io5"
import { FaSquarePlus } from "react-icons/fa6"
import GridCard from '../../components/gridcard/GridCard';
import { useExpenses } from '../../context/ExpenseContext';
import { Link, useOutletContext } from 'react-router-dom';
import Table from '../../components/table/Table';
import { FaTrash } from "react-icons/fa";
import Loading from '../../components/loading/Loading';
import { useSplit } from '../../context/SplitExpanseContext';
import { converterStringParaNumero } from '../../utils/converterStringNumero';
import { formatarValorMonetario } from '../../utils/formatarValorMonetario';
import { converterValorBruto} from '../../utils/converterValorBruto';
import { FaPlus } from "react-icons/fa6";
import RelatorioGastos from '../../components/relatorio/RelatorioGastos';

function GastosPage() {
    const [sortOrder, setSortOrder] = useState('recentes');

    // const gastosOrdenados = useMemo(() => {
    //     const sorted = [...gastos]; 
    
    //     sorted.sort((a, b) => {
    //       switch (sortOrder) {
    //         case 'maior_valor':
    //           return b.amount - a.amount;
    //         case 'menor_valor':
    //           return a.amount - b.amount;
    //         case 'antigos':
    //           return new Date(a.date) - new Date(b.date);
    //         case 'recentes':
    //         default:
    //           return new Date(b.date) - new Date(a.date);
    //       }
    // })
    
    // return sorted;
    // }, [gastos, sortOrder]);

    const handleSortChange = (event) => {
        const novaOrdem = event.target.value;
        setSortOrder(novaOrdem);
    }

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
                        <Link to="/cadastrogasto">
                            {isMobile ? <Botao icon={<FaPlus size={24} color={"white"}/>} /> : <Botao icon={<FaSquarePlus size={24} color={"white"}/>} name={"Adicionar"}/>}
                        </Link>
                        {isMobile ? <Botao icon={<IoPrintOutline size={24} color={"white"} />} />: <Botao icon={<IoPrintOutline size={24} color={"white"} />} name={"Imprimir"} />}
                        <RelatorioGastos>   </RelatorioGastos>
                    </div>
                </div>
            </GridCard>
        </div>
    );
}

export default GastosPage;