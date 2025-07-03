import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './DashboardPage.module.css';
import { toast } from 'react-toastify';
import Botao from '../../components/botao/Botao';
import { FaSquarePlus } from "react-icons/fa6"
import GridCard from '../../components/gridcard/GridCard';

function DashboardPage() {

    return (
        <div className={styles.dashboardContainer}>
            <GridCard flex={2}>
                <h4>Resumo</h4>
                <Botao icon={<FaSquarePlus size={24} color={"white"}/>} name={"Adicionar"}/>
            </GridCard>
            <GridCard flex={3}>
                <h4>Ultimos gastos</h4>
                <Botao icon={<FaSquarePlus size={24} color={"white"}/>} name={"Adicionar"}/>
            </GridCard>
        </div>
    );
}

export default DashboardPage;