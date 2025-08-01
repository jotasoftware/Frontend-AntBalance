import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '@/context/ExpenseContext';
import styles from './CadastroGastoPage.module.css';
import { toast } from 'react-toastify';
import Botao from '@/components/common/botao/Botao';
import { FaSquarePlus } from "react-icons/fa6";
import ModalCategoria from '@/components/user/modalCategoria/ModalCategoria';
import { formatarValorMonetario } from '@/utils/formatarValorMonetario';


function CadastroGastoPage() {
    const navigate = useNavigate();
    const { createGasto, createCategoria, fetchCategorias, categorias, deleteCategoria } = useExpenses();

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);

    const [nome, setNome] = useState('');
    const [valor, setValor] = useState('');
    const [fonte, setFonte] = useState('');
    const [parcelas, setParcelas] = useState(1);
    const [modalCategoriaAberto, setModalCategoriaAberto] = useState(false);
    const [categoria, setCategoria] = useState('');
    const [categoriaId, setCategoriaId] = useState(null);

    useEffect(() => {
        if (categorias.length === 0) {
            fetchCategorias();
        }
    }, []);

    const handleChangeNome = (event) => {
        if (event.target.value.length <= 25) setNome(event.target.value);
    }

    const handleChangeValor = (event) => {
        const inputValue = event.target.value;
        if (inputValue === '') {
            setValor('');
            return;
        }
        if (inputValue.length <= 12) {
            const valorFormatado = formatarValorMonetario(inputValue);
            setValor(valorFormatado);
        }
    }

    const handleChangeFonte = (event) => {
        if (event.target.value.length <= 25) setFonte(event.target.value);
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
            setIsLoading(true);
            try {
                await createCategoria({ nome: novaCategoria });
                toast.success(`Categoria "${novaCategoria}" criada com sucesso!`);
            } catch (error) {
                toast.error("Não foi possível criar a categoria.");
            }finally{
                setIsLoading(false);
            }
        }
    }

    const handleDeleteCategoria = async (categoria) => {
        try {
            setIsLoadingDelete(true);
            await deleteCategoria(categoria.id);
            if (categoria.id === categoriaId) {
                setCategoria('');
                setCategoriaId(null);
            }

            toast.success(`Categoria ${categoria.nome} excluída com sucesso!`);
        } catch (error) {
            toast.error(error.response.data.mensagem);
            console.error("Erro ao excluir categoria:", error);
        } finally{
            setIsLoadingDelete(false);
        }
    }


    const handleFormSubmit = async (event) => {
        event.preventDefault();
        if (!nome) {
            toast.warn("Por favor, preencha o nome.");
            return;
        }
        if (!valor) {
            toast.warn("Por favor, preencha o valor.");
            return;
        }
        if (!categoria) {
            toast.warn("Por favor, selecione uma categoria.");
            return;
        }
        if (!fonte) {
            toast.warn("Por favor, preencha a fonte.");
            return;
        }
        if (!parcelas) {
            toast.warn("Por favor, preencha o número de parcelas.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await createGasto({ nome, valor, categoriaId, fonte, parcelas });
            toast.success('Gasto adicionado com sucesso.');
            if(response.excedeu){
                toast.warn('Atenção! Limite de valor para a categoria excedido.');
            }
            setNome("")
            setValor("");
            setCategoria("");
            setFonte("");
            setParcelas(1);
            navigate('/gastos', { replace: true });
        } catch (err) {
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
                            icon={<FaSquarePlus size={24} color={"white"} />}
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
                onDeleteCategoria={handleDeleteCategoria}
                loadingAdd={isLoading}
                loadingDelete={isLoadingDelete}
            />
        </div>
    );
}

export default CadastroGastoPage;