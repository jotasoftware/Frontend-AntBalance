import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './EditarCadastroPage.module.css';
import { toast } from 'react-toastify';
import Botao from '../../components/botao/Botao';
import { FaSquarePlus } from "react-icons/fa6";



function EditarCadastroPage() {
    const { userName, edit, setUserName } = useAuth();
    const [nome, setNome] = useState(userName);
    const [senhaAtual, setSenhaAtual] = useState('');
    const [senhaNova, setSenhaNova] = useState('');
    
    const handleChangeNome = (event) => {
        setNome(event.target.value);
    }

    const handleChangeSenhaAtual = (event) => {
        setSenhaAtual(event.target.value);
    }

     const handleChangeSenhaNova = (event) => {
        setSenhaNova(event.target.value);
    }

    const validateForm = () => {
        const regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        
        if(!regexPass.test(senhaNova)){
            toast.warn("Senha deve ter 8+ caracteres, com maiúscula, minúscula, número e símbolo.");
            return false;
        }
        return true;
    };


    const handleFormSubmit = async(event) => {
        event.preventDefault();
        if(!nome){
            toast.warn('Por favor, preencha todos os campos.');
            return;
        }
        if(!senhaAtual == ""){
            if(!validateForm()){
                return;
            }
        }
        try{
            await edit({ nome, senhaAtual, senhaNova });
            toast.success('Usuário editado com sucesso.');
            setSenhaAtual("")
            setSenhaNova("")
            setUserName(nome)
        } catch (err) {
            if (err.response && err.response.data) {
                const mensagem =
                    typeof err.response.data === 'string'
                        ? err.response.data
                        : err.response.data.message || 'Erro ao editar o usuário.';
                toast.error(mensagem);
            } else {
                toast.error('Erro desconhecido ao editar o usuário.');
            }
            console.error("Falha no cadastro do gasto:", err);
        }
    };

    return (
        <div className={styles.editarCadastroPageContainer}>
            <form className={styles.formContainer} onSubmit={handleFormSubmit}>
                <header>
                    <span>Editar Cadastro</span>
                </header>

                <div className={styles.inputContainer}>
                    <label htmlFor="nome">Nome: </label>
                    <input 
                        type="text"
                        name='nome'
                        id='nome'
                        placeholder='Nome' 
                        value={nome}
                        onChange={handleChangeNome}
                    />
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="senhaAtual">Senha Atual: </label>
                    <input 
                        type="password" 
                        name='senhaAtual'
                        id='senhaAtual'
                        placeholder='Senha Atual' 
                        value={senhaAtual}
                        onChange={handleChangeSenhaAtual}
                    />
                </div>
                
                <div className={styles.inputContainer}>
                    <label htmlFor="senhaNova">Nova Senha: </label>
                    <input 
                        type="password" 
                        name='senhaNova'
                        id='senhaNova'
                        placeholder='Nova Senha' 
                        value={senhaNova}
                        onChange={handleChangeSenhaNova}
                    />
                </div>
                <button 
                    type="submit" 
                    className={styles.buttonSubmit}
                >
                    <Botao 
                        icon={<FaSquarePlus size={24} color={"white"}/>} 
                        name={"Editar"}
                    />
                </button>
            </form>
        </div>
    );
}

export default EditarCadastroPage;