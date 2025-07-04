import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../../context/ExpenseContext';
import styles from './CadastroGastoPage.module.css';
import { toast } from 'react-toastify';
import Botao from '../../components/botao/Botao';
import { FaSquarePlus } from "react-icons/fa6";
import ModalCategoria from './ModalCategoria';


function CadastroGastoPage() {
    const navigate = useNavigate();
    const { createGasto, createCategoria, fetchCategorias, categorias} = useExpenses();

    const [isLoading, setIsLoading] = useState(false);
    
    const [nome, setNome] = useState('');
    const [valor, setValor] = useState('');
    const [fonte, setFonte] = useState('');
    const [parcelas, setParcelas] = useState(1);
    const [modalCategoriaAberto, setModalCategoriaAberto] = useState(false);
    const [categoria, setCategoria] = useState('');
    const [categoriaId, setCategoriaId] = useState(null);
    
    const handleChangeNome = (event) => {
        setNome(event.target.value);
    }

    useEffect(() => {
        if (categorias.length === 0) {
            fetchCategorias();
        }
    }, []);

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

    const handleChangeFonte = (event) => {
        setFonte(event.target.value);
    }

    const handleChangeParcelas = (event) => {
        const numParcelas = parseInt(event.target.value);
        setParcelas(numParcelas); 
    }

    const handleSelectCategoria = (categoriaSelecionada, id) => {
        setCategoria(categoriaSelecionada);
        setCategoriaId(id)
    }

    const handleAddCategoria = async (novaCategoria) => {
        if (!categorias.includes(novaCategoria)) {
            try {
                await createCategoria({ nome: novaCategoria }); 
                setCategoria(novaCategoria);
                toast.success(`Categoria "${novaCategoria}" criada com sucesso!`);
            } catch (error) {
                toast.error("Não foi possível criar a categoria.");
            }
        }
    }

    const handleFormSubmit = async(event) => {
        event.preventDefault();
        if(!nome || !valor || !categoria || !fonte || !parcelas){
            toast.warn('Por favor, preencha todos os campos.');
            return;
        }

        setIsLoading(true);

        try{
            await createGasto({ nome, valor, categoriaId, fonte, parcelas });
            toast.success('Gasto adicionado com sucesso.');
            setNome("")
            setValor("");
            setCategoria("");
            setFonte("");
            setParcelas(1);
            navigate('/gastos', { replace: true});
        } catch (err){
            toast.error('Dados inválidos, tente novamente.');
            console.error("Falha no cadastro do gasto:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.cadastroGastoContainer}>
            <form className={styles.formContainer} onSubmit={handleFormSubmit}>
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
                    <button
                        type="button"
                        className={styles.categoriaSelectButton}
                        onClick={() => setModalCategoriaAberto(true)}
                    >
                        {categoria || 'Selecione a categoria'}
                    </button>
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
                    <button 
                        type="submit" 
                        className={styles.buttonSubmit}
                        disabled={isLoading}
                    >
                        <Botao 
                            icon={<FaSquarePlus size={24} color={"white"}/>} 
                            name={isLoading ? "Cadastrando..." : "Cadastrar"}
                        />
                    </button>
                </div>
            </form>

            <ModalCategoria
                isOpen={modalCategoriaAberto}
                onClose={() => setModalCategoriaAberto(false)}
                onSelectCategoria={handleSelectCategoria}
                categorias={categorias}
                onAddCategoria={handleAddCategoria}
            />
        </div>
    );
}

export default CadastroGastoPage;