import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './RecoverPage.module.css';
import { toast } from 'react-toastify';
import Botao from '../../components/botao/Botao';
import { FaSquarePlus } from "react-icons/fa6";



function RecoverPage() {
    const navigate = useNavigate();
    const [senhaNova, setSenhaNova] = useState('');
    
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
        if(!senhaNova){
            toast.warn('Por favor, preencha todos os campos.');
            return;
        }
        if(!validateForm()){
            return;
        }
        /*
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
        }*/
    };

    return (
        <div className={styles.editarCadastroPageContainer}>
            <div className={styles.logoContainer}>
                <img src="logomini.svg" alt="" />
            </div>
            <div className={styles.container}>
                <form onSubmit={handleFormSubmit}>
                <header>
                    <span>Recuperação de Senha</span>
                </header>
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
                <div className={styles.buttonContainer}>
                    <button 
                        type="submit" 
                        className={styles.buttonSubmit}
                    >
                        <Botao 
                            icon={<FaSquarePlus size={24} color={"white"}/>} 
                            name={"Salvar"}
                        />
                    </button>
                </div>
            </form>
        </div>
        </div>
    );
}

export default RecoverPage;