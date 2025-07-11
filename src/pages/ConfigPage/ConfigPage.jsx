import React, { useState } from 'react';
import styles from './ConfigPage.module.css';
import { toast } from 'react-toastify';
import Botao from '../../components/botao/Botao';
import { MdOutlineModeEdit } from "react-icons/md";
import { HiOutlineTrash } from "react-icons/hi";
import GridCard from '../../components/gridcard/GridCard';
import { Link } from 'react-router-dom'


function ConfigPage() {

    return (
        <div className={styles.configContainer}>
            <GridCard flex={1}>
                <h4>Configurações</h4>
                <div className={styles.optionsContainer}>
                    <Link to="/editarcadastro">
                        <MdOutlineModeEdit size={30}></MdOutlineModeEdit>
                        Editar cadastro
                    </Link>
                    <Link to="/gastosinativos">
                        <HiOutlineTrash size={30}></HiOutlineTrash>
                        Lixeira de gastos
                    </Link>
                </div>
                
            </GridCard>
        </div>
    );
};

export default ConfigPage;