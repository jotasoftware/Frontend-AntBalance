import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './RecoverPage.module.css';
import { toast } from 'react-toastify';
import Botao from '../../components/botao/Botao';
import { FaSquarePlus } from "react-icons/fa6";
import Loading from '../../components/loading/Loading';



function RecoverPage() {
    const {editPassword} = useAuth();
    const navigate = useNavigate();
    const [senhaNova, setSenhaNova] = useState('');
    const [searchParams] = useSearchParams();
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
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
            toast.warn('Por favor, preencha a nova senha.');
            return;
        }
        if(!validateForm()){
            return;
        }
        setIsLoading(true);

        try{
            await editPassword({senhaNova, token});
            toast.success('Senha editada com sucesso');
            setSenhaNova("");
            navigate('/login', { replace: true});
        } catch (err){
            toast.error('Dados inválidos, tente novamente.');
            console.error("Falha no cadastro do gasto:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
            toast.warn('Digite a nova senha');
        } else {
            console.error("Nenhum token encontrado na URL.");
        }
    }, [searchParams]);

    return (
        <div className={styles.editarCadastroPageContainer}>
            <div className={styles.logoContainer}>
                {isLoading ? <Loading /> : <img src="logomini.svg" alt="" />}
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
                <button type="submit" className={styles.buttonSubmit}>Entrar</button>
            </form>
        </div>
        </div>
    );
}

export default RecoverPage;