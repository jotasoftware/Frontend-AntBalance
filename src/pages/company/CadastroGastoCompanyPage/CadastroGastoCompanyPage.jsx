import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '@/context/ExpenseContext';
import styles from './CadastroGastoCompanyPage.module.css';
import { toast } from 'react-toastify';
import Botao from '@/components/common/botao/Botao';
import { FaSquarePlus } from "react-icons/fa6";
import ModalCategoria from '@/components/user/modalCategoria/ModalCategoria';
import { formatarValorMonetario } from '@/utils/formatarValorMonetario';


function CadastroGastoCompanyPage() {
    const navigate = useNavigate();
    const { createGasto, createCategoria, fetchCategorias, categorias, deleteCategoria } = useExpenses();

    const [isLoading, setIsLoading] = useState(false);

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
            try {
                await createCategoria({ nome: novaCategoria });
                toast.success(`Categoria "${novaCategoria}" criada com sucesso!`);
            } catch (error) {
                toast.error("Não foi possível criar a categoria.");
            }
        }
    }

    const handleDeleteCategoria = async (categoria) => {
        try {
            await deleteCategoria(categoria.id);

            if (categoria.id === categoriaId) {
                setCategoria('');
                setCategoriaId(null);
            }

            toast.success(`Categoria ${categoria.nome} excluída com sucesso!`);
        } catch (error) {
            toast.error(error.response.data.mensagem);
            console.error("Erro ao excluir categoria:", error);
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
            await createGasto({ nome, valor, categoriaId, fonte, parcelas });
            toast.success('Gasto adicionado com sucesso.');
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
            />
        </div>
    );
}

export default CadastroGastoCompanyPage;