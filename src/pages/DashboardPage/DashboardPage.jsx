import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './DashboardPage.module.css';
import { toast } from 'react-toastify';
import Botao from '../../components/botao/Botao';
import { FaSquarePlus } from "react-icons/fa6"
import GridCard from '../../components/gridcard/GridCard';
import Valores from '../../components/valores/Valores';

function DashboardPage() {
    const valor = 1215254.50

    return (
        <div className={styles.dashboardContainer}>
            <GridCard flex={2}>
                <h4>Resumo</h4>
                <Valores mes="Esse mês" valor={valor} bgColor={'#1a45b8'} mesColor={'white'} valorColor={'white'}></Valores>
                <Valores mes="Proximos meses" valor={valor} bgColor={'transparent'} mesColor={'black'} valorColor={'#1a45b8'}></Valores>
            </GridCard>
            <GridCard flex={3}>
                <h4>Ultimos gastos</h4>
                <Botao icon={<FaSquarePlus size={24} color={"white"}/>} name={"Adicionar"}/>
            </GridCard>
        </div>
    );
}

export default DashboardPage;