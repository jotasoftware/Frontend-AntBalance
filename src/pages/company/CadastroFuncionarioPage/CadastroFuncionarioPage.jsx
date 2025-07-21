import React, { useState, useEffect } from 'react';
import styles from './CadastroFuncionarioPage.module.css';
import { formatarValorMonetario } from '@/utils/formatarValorMonetario';
import { toast } from 'react-toastify';
import Botao from '@/components/common/botao/Botao';
import { FaSquarePlus } from "react-icons/fa6";
import ModalSetor from '@/components/company/modalSetor/ModalSetor';
import { useEmployee } from '@/context/EmployeeContext';
import { useNavigate } from 'react-router-dom';

function CadastroFuncionarioPage() {
    const navigate = useNavigate();
    const { createFuncionario, createSetor, setores, fetchSetores, deleteSetor } = useEmployee();

    useEffect(()=>{
        fetchSetores()
    }, [])

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);


    const [nome, setNome] = useState('');
    const [cargo, setCargo] = useState('');
    const [telefone, setTelefone] = useState('');
    const [salario, setSalario] = useState('');
    const [modalSetorAberto, setModalSetorAberto] = useState(false);
    const [setor, setSetor] = useState('');
    const [setorId, setSetorId] = useState(null);

    const handleChangeNome = (event) => {
        if (event.target.value.length <= 25) setNome(event.target.value);
    }

    const handleChangeCargo = (event) => {
        if (event.target.value.length <= 25) setCargo(event.target.value);
    }

    const handleChangeTelefone = (event) => {
        let input = event.target.value.replace(/\D/g, '');

        if (input.length > 11) input = input.slice(0, 11);

        let formatted = input;

        if (input.length > 0) formatted = `(${input.slice(0, 2)}`;
        if (input.length >= 3) formatted += `) ${input.slice(2, 7)}`;
        if (input.length >= 8) formatted += `-${input.slice(7, 11)}`;

        setTelefone(formatted);
    }

    const handleChangeSalario = (event) => {
        const inputValue = event.target.value;
        if (inputValue === '') {
            setSalario('');
            return;
        }
        if (inputValue.length <= 12) {
            const valorFormatado = formatarValorMonetario(inputValue);
            setSalario(valorFormatado);
        }
    }

    const handleSelectSetor = (setorSelecionado, id) => {
        setSetor(setorSelecionado);
        setSetorId(id)
    }

    const handleAddSetor = async (novoSetor) => {
        if (!setores.includes(novoSetor)) {
            setIsLoading(true)
            try {
                await createSetor({ nome: novoSetor });
                toast.success(`Setor "${novoSetor}" criado com sucesso!`);
            } catch (error) {
                toast.error("Não foi possível criar o setor.");
            }finally{
                setIsLoading(false)
            }
        }
    }

    const handleDeleteSetor = async (setor) => {
        try {
            setIsLoadingDelete(true)
            await deleteSetor(setor.id);
    
            if (setor.id === setorId) {
                setSetorId(null);
            }
    
            toast.success(`Setor ${setor.nome} excluído com sucesso!`);
        } catch (error) {
            toast.error(error.response.data.mensagem);
            console.error("Erro ao excluir categoria:", error);
        }finally{
            setIsLoadingDelete(false)
        }
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        if (!nome) {
            toast.warn("Por favor, preencha o nome.");
            return;
        }
        if (!salario) {
            toast.warn("Por favor, preencha o salario.");
            return;
        }
        if (!cargo) {
            toast.warn("Por favor, selecione o cargo.");
            return;
        }
        if (!telefone) {
            toast.warn("Por favor, preencha a telefone.");
            return;
        }

        if (!setor) {
            toast.warn("Por favor, selecione um setor.");
            return;
        }

        setIsLoading(true);
        try {
            await createFuncionario({ nome, salario, setorId, cargo, telefone });
            toast.success('Funcionario adicionado com sucesso.');
            setNome("")
            setSalario("");
            setSetorId("");
            setCargo("");
            setTelefone("");
            navigate('/funcionarios', { replace: true });
        } catch (err) {
            toast.error('Dados inválidos, tente novamente.');
            console.error("Falha no cadastro do gasto:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.cadastroFuncionarioContainer}>
            <form className={styles.formContainer} onSubmit={handleFormSubmit}>
                <header>
                    <span>Cadastrar Novo Funcionario</span>
                </header>

                <div className={styles.inputContainer}>
                    <label htmlFor="nome">Nome: </label>
                    <input
                        type="text"
                        name='nome'
                        id='nome'
                        placeholder='Nome do Funcionario'
                        value={nome}
                        onChange={handleChangeNome}
                    />
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="Cargo">Cargo: </label>
                    <input
                        type="text"
                        name='cargo'
                        id='cargo'
                        placeholder='Cargo do Funcionario'
                        value={cargo}
                        onChange={handleChangeCargo}
                    />
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="setor">Setores de Funcionarios: </label>
                    <button
                        type="button"
                        className={styles.setorSelectButton}
                        onClick={() => setModalSetorAberto(true)}
                    >
                        {setor || 'Selecione o setor'}
                    </button>
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="Telefone">Telefone: </label>
                    <input
                        type="text"
                        name='telefone'
                        id='telefone'
                        placeholder='(99) 99999-9999'
                        value={telefone}
                        onChange={handleChangeTelefone}
                    />
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="Salario">Salario: </label>
                    <input
                        type="text"
                        name='salario'
                        id='salario'
                        placeholder='R$ 0,00'
                        value={salario}
                        onChange={handleChangeSalario}
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
            <ModalSetor
                isOpen={modalSetorAberto}
                onClose={() => setModalSetorAberto(false)}
                onSelectSetor={handleSelectSetor}
                setores={setores}
                onAddSetor={handleAddSetor}
                onDeleteSetor={handleDeleteSetor}
                loadingAdd={isLoading}
                loadingDelete={isLoadingDelete}
            />
        </div>
    );
}

export default CadastroFuncionarioPage;