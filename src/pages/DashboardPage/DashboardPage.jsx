import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './DashboardPage.module.css';
import { toast } from 'react-toastify';
import Botao from '../../components/botao/Botao';
import { FaSquarePlus } from "react-icons/fa6"

function DashboardPage() {

    return (
        <div className={styles.dashboardContainer}>
            <Botao icon={<FaSquarePlus size={24} color={"white"}/>} name={"Adicionar"}/>
        </div>
    );
}

export default DashboardPage;