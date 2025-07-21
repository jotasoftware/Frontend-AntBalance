import React, { useEffect, useState } from 'react';
import styles from './ConfigPage.module.css';
import { toast } from 'react-toastify';
import Botao from '../../../components/common/botao/Botao';
import { MdOutlineModeEdit } from "react-icons/md";
import { HiOutlineTrash } from "react-icons/hi";
import GridCard from '../../../components/common/gridcard/GridCard';
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext';
import { TbCategory } from "react-icons/tb";
import { useExpenses } from '@/context/ExpenseContext';
import { useEmployee } from '@/context/EmployeeContext';
import { IoPersonRemoveOutline } from "react-icons/io5";


function ConfigPage() {

    const { userRole } = useAuth();
    const {fetchCategorias} = useExpenses()
    const {fetchFuncionariosInativos} = useEmployee()

    useEffect(()=>{
        fetchCategorias()
        if(userRole=="EMPRESARIAL") fetchFuncionariosInativos()
    },[])

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
                    {userRole == 'PESSOAL' &&
                        <Link to="/categorias">
                            <TbCategory size={30}></TbCategory>
                            Categorias
                        </Link>
                    }
                    {userRole == 'EMPRESARIAL' &&
                        <Link to="/funcionariosinativos">
                            <IoPersonRemoveOutline size={30}></IoPersonRemoveOutline>
                            Funcionários Inativos
                        </Link>
                    }
                </div>
                
            </GridCard>
        </div>
    );
};

export default ConfigPage;