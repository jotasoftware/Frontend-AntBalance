import React, { useState } from 'react';
import styles from './ConfigPage.module.css';
import { toast } from 'react-toastify';
import Botao from '../../components/botao/Botao';
import { FaEdit } from "react-icons/fa";
import GridCard from '../../components/gridcard/GridCard';
import { Link } from 'react-router-dom'


function ConfigPage() {

    return (
        <div className={styles.configContainer}>
            <GridCard flex={1}>
                <h4>Configurações</h4>
                <Link to="/editarcadastro"><Botao icon={<FaEdit size={24} color={"white"}/>} name={"Editar Cadastro"}/></Link>
                
            </GridCard>
        </div>
    );
};

export default ConfigPage;