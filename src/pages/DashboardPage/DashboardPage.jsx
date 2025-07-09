import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './DashboardPage.module.css';
import { toast } from 'react-toastify';
import Botao from '../../components/botao/Botao';
import { FaSquarePlus } from "react-icons/fa6"
import GridCard from '../../components/gridcard/GridCard';
import Valores from '../../components/valores/Valores';
import { Link } from 'react-router-dom'
import { useExpenses } from '../../context/ExpenseContext';
import { Chart as ChartJS } from 'chart.js/auto';
import { Doughnut, Line } from 'react-chartjs-2';
import Charts from '../../components/charts/Charts';

function DashboardPage() {

    const { valorAtual, valoresFuturos, gastos, valores } = useExpenses();

    return (
        <div className={styles.dashboardContainer}>
            <GridCard flex={2}>
                <h4>Resumo</h4>
                <Valores mes="Esse mês" valor={valorAtual} bgColor={'#1a45b8'} mesColor={'white'} valorColor={'white'}></Valores>
                <Valores mes="Proximos meses" dadosMensais={valoresFuturos} bgColor={'transparent'} mesColor={'black'} valorColor={'#1a45b8'}></Valores>
            </GridCard>
            <GridCard flex={3}>
                <Charts gastos={gastos} valores={valores}></Charts>
            </GridCard>
        </div>
    );
}

export default DashboardPage;