import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import styles from './DashboardPage.module.css';
import { toast } from 'react-toastify';
import Botao from '../../../components/common/botao/Botao';
import { FaSquarePlus } from "react-icons/fa6"
import GridCard from '../../../components/common/gridcard/GridCard';
import Valores from '../../../components/user/valores/Valores';
import { Link } from 'react-router-dom'
import { useExpenses } from '../../../context/ExpenseContext';
import { Chart as ChartJS } from 'chart.js/auto';
import { Doughnut, Line } from 'react-chartjs-2';
import Charts from '../../../components/user/charts/Charts';
import Loading from '../../../components/common/loading/Loading';

function DashboardPage() {

    const { valorAtual, valoresFuturos, gastos, valores, loadingValores } = useExpenses();

    useEffect(() => {
        const shouldBlockScroll = loadingValores || valores.length === 0;

        if (shouldBlockScroll) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [loadingValores, valores]);
    return (
        <div className={styles.container}>
            <div className={styles.dashboardContainer}>
                {loadingValores ? 
                <div className={styles.emptyContainer}>
                    <Loading/> 
                </div>
                :
                    valores.length ==0 &&
                    <div className={styles.emptyContainer} data-scroll-block>
                        <h4>Adicione seu primeiro gasto para visualização da dashboard</h4>
                        <Link to="/cadastrogasto">
                                <Botao icon={<FaSquarePlus size={24} color={"white"}/>} name={"Adicionar"}/>
                        </Link>
                    </div>
                }
                <GridCard flex={2}>
                    <h4>Resumo</h4>
                    <Valores mes="Esse mês" valor={valorAtual} bgColor={'#1a45b8'} mesColor={'white'} valorColor={'white'}></Valores>
                    <Valores mes="Proximos meses" dadosMensais={valoresFuturos} bgColor={'transparent'} mesColor={'black'} valorColor={'#1a45b8'}></Valores>
                </GridCard>
                <GridCard flex={3}>
                    <Charts gastos={gastos} valores={valores}></Charts>
                </GridCard>
            </div>
        </div>
    );
}

export default DashboardPage;