import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './GastosPage.module.css';
import { toast } from 'react-toastify';
import Botao from '../../components/botao/Botao';
import { IoPrintOutline } from "react-icons/io5"

function GastosPage() {

    return (
        <div className={styles.gastosContainer}>
            <Botao icon={<IoPrintOutline size={24} color={"white"}/>} name={"Imprimir"}/>
        </div>
    );
}

export default GastosPage;