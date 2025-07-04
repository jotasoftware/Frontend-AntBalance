import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './CadastroGastoPage.module.css';
import { toast } from 'react-toastify';
import Botao from '../../components/botao/Botao';
import { FaSquarePlus } from "react-icons/fa6";

function CadastroGastoPage() {
    const [nome, setNome] = useState('');
    const [valor, setValor] = useState('');
    const [categoria, setCategoria] = useState('');
    const [fonte, setFonte] = useState('');
    const [parcelas, setParcelas] = useState(1);
    
    const handleChangeNome = (event) => {
        setNome(event.target.value);
    }

    const formatarValorMonetario = (valor) => {
        const apenasNumeros = valor.replace(/\D/g, '');
        
        if (apenasNumeros === '') return '';
        
        const numeroFormatado = (parseInt(apenasNumeros) / 100).toFixed(2);
        const partes = numeroFormatado.split('.');
        partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        
        return partes.join(',');
    }
    
    const handleChangeValor = (event) => {
        const inputValue = event.target.value;
        if (inputValue === '') {
            setValor('');
            return;
        }
        const valorFormatado = formatarValorMonetario(inputValue);
        setValor(valorFormatado);
    }

    const handleChangeCategoria = (event) => {
        setCategoria(event.target.value);
    }

    const handleChangeFonte = (event) => {
        setFonte(event.target.value);
    }

    const handleChangeParcelas = (event) => {
        const numParcelas = parseInt(event.target.value);
        setParcelas(numParcelas); 
    }

    return (
        <div className={styles.cadastroGastoContainer}>
            <div className={styles.formContainer}>
                <header>
                    <span>Cadastrar Novo Gasto</span>
                </header>

                <div className={styles.inputContainer}>
                    <label htmlFor="nome">Nome: </label>
                    <input 
                        type="text"
                        name='nome'
                        id='nome'
                        placeholder='Nome do Gasto' 
                        value={nome}
                        onChange={handleChangeNome}
                    />
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="valor">Valor: </label>
                    <div className={styles.valorInputContainer}>
                        <input 
                            type="text" 
                            name='valor'
                            id='valor'
                            placeholder='0,00' 
                            value={valor}
                            onChange={handleChangeValor}
                        />
                    </div>
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="categoria">Categoria de Gasto: </label>
                    <input 
                        type="text"
                        name='categoria'
                        id='categoria'
                        placeholder='Selecione a categoria' 
                        value={categoria}
                        onChange={handleChangeCategoria}
                    />
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="fonte">Fonte: </label>
                    <input 
                        type="text"
                        name='fonte'
                        id='fonte'
                        placeholder='Fonte do Gasto' 
                        value={fonte}
                        onChange={handleChangeFonte}
                    />
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="parcelas">Quantidade de Parcelas: </label>
                    <select 
                        name='parcelas'
                        id='parcelas'
                        value={parcelas}
                        onChange={handleChangeParcelas}
                        required
                    >
                        <option value="1">À vista</option>
                        <option value="2">2x</option>
                        <option value="3">3x</option>
                        <option value="4">4x</option>
                        <option value="5">5x</option>
                        <option value="6">6x</option>
                        <option value="7">7x</option>
                        <option value="8">8x</option>
                        <option value="9">9x</option>
                        <option value="10">10x</option>
                        <option value="11">11x</option>
                        <option value="12">12x</option>
                        <option value="13">13x</option>
                        <option value="14">14x</option>
                        <option value="15">15x</option>
                        <option value="16">16x</option>
                        <option value="17">17x</option>
                        <option value="18">18x</option>
                        <option value="19">19x</option>
                        <option value="20">20x</option>
                        <option value="21">21x</option>
                        <option value="22">22x</option>
                        <option value="23">23x</option>
                        <option value="24">24x</option>
                    </select>
                </div>
                <div className={styles.buttonContainer}>
                    <Botao icon={<FaSquarePlus size={24} color={"white"}/>} name={"Cadastrar"}/>
                </div>
            </div>
        </div>
    );
}

export default CadastroGastoPage;