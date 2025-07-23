import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import styles from './DashboardPageCompany.module.css';
import { toast } from 'react-toastify';
import Botao from '@/components/common/botao/Botao';
import { FaSquarePlus } from "react-icons/fa6"
import GridCard from '@/components/common/gridcard/GridCard';
import Valores from '@/components/common/valores/Valores';
import { Link } from 'react-router-dom'
import { useExpenses } from '@/context/ExpenseContext';
import { Chart as ChartJS } from 'chart.js/auto';
import { Doughnut, Line } from 'react-chartjs-2';
import Charts from '@/components/company/charts/Charts';
import Loading from '@/components/common/loading/Loading';
import { useEmployee } from '@/context/EmployeeContext';
import { IoPersonAdd } from "react-icons/io5";

function DashboardPageCompany() {

    const { valorAtual, valoresFuturos, gastos, valores, loadingValores, gastosMes } = useExpenses();
    const { valoresSetor, loadingValoresSetor } = useEmployee();

    useEffect(() => {
        const isLoading = loadingValores || loadingValoresSetor;
        const hasSomeValue = valores.length > 0 || valoresSetor.length > 0;
    
        const shouldBlockScroll = isLoading && !hasSomeValue;
    
        if (shouldBlockScroll) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [loadingValores, valores, valoresSetor, loadingValoresSetor]);
    
    return (
        <div className={styles.container}>
            <div className={styles.dashboardContainer}>
            {(loadingValores || loadingValoresSetor) && valores.length === 0 && valoresSetor.length === 0 ? (
            <div className={styles.emptyContainer}>
                <Loading />
            </div>
            ) : valores.length === 0 && valoresSetor.length === 0 ? (
            <div className={styles.emptyContainer} data-scroll-block>
                <h4>Adicione seu primeiro gasto ou o primeiro funcionário para visualização da dashboard</h4>
                <div className={styles.linkIcons}>
                    <Link to="/cadastrogasto">
                        <Botao icon={<FaSquarePlus size={24} color={"white"} />} name={"Adicionar gasto"} />
                    </Link>
                    <Link to="/cadastrofuncionario">
                        <Botao icon={<IoPersonAdd size={18} color={"white"} />} name={"Adicionar funcionário"} />
                    </Link>
                </div>
            </div>
            ) : null}

                <GridCard flex={2}>
                    <h4>Resumo</h4>
                    <Valores mensagem="Gastos gerais" valor={valorAtual} bgColor={'#1a45b8'} mesColor={'white'} valorColor={'white'}></Valores>
                    <Valores mensagem="Salários" dadosMensais={valoresSetor} bgColor={'transparent'} mesColor={'black'} valorColor={'#1a45b8'}></Valores>
                </GridCard>
                <GridCard flex={3}>
                    <Charts gastos={gastos} valores={valores} valoresSetor={valoresSetor} gastosMes={gastosMes}></Charts>
                </GridCard>
            </div>
        </div>
    );
}

export default DashboardPageCompany;