import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './LoginPage.module.css';
import { toast } from 'react-toastify';
import Loading from '../../components/loading/Loading';
import { useExpenses } from '../../context/ExpenseContext';

function LoginPage() {
    const {login, register, recover} = useAuth();
    const {fetchValores, fetchCategorias, fetchGastosInativos, fetchGastos} = useExpenses();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [type, setType] = useState('login');

    const [showEmailPopup, setShowEmailPopup] = useState(false);
    const [recoverEmail, setRecoverEmail] = useState('');
    
    const [selectType, setSelectType] = useState(null)


    const handleChangeEmail = (event) => {
        setEmail(event.target.value);
    }

    const handleChangePass = (event) => {
        setPassword(event.target.value);
    }

    const handleChangeName = (event) => {
        setName(event.target.value);
    }

    const handleChangeRecoverEmail = (event) => {
        setRecoverEmail(event.target.value);
    }

    const handleChangeSelectType = (event) => {
        setSelectType(event.target.value);
    }

    const validateForm = () => {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        
        if(!regexEmail.test(email)){
            toast.error(`Email invalido`);
            return false;
        }
        if(!regexPass.test(password) && (type === 'signup')){
            toast.warn("Senha deve ter 8+ caracteres, com maiúscula, minúscula, número e símbolo.");
            return false;
        }
        return true;
    };

    const validateRecoverEmail = () => {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!regexEmail.test(recoverEmail)){
            toast.error(`Email inválido`);
            return false;
        }
        return true;
    };

    const handleSubmitLogin = async () => {
        setIsLoading(true);
        try{
            await login({ email, password });
            await fetchValores();
            await fetchGastos();
            await fetchCategorias();
            await fetchGastosInativos();
            toast.success('Login bem sucedido.');
            setEmail("");
            setPassword("");
            setName("")
            navigate('/dashboard', { replace: true});
        } catch (err){
            toast.error('Email ou senha invalida, tente novamente.');
            setPassword("");
            console.error("Falha no login:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitCreate = async () => {
        setIsLoading(true);
        try{
            await register({selectType, email, password, name});
            toast.success('Usuário criado com sucesso.');
            setPassword("");
            setName("")
            setSelectType(null)
            setType('login')
        } catch (err){
            toast.error('Usuário não foi criado.');
            console.error("Falha no login:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleContinueRecover = async () => {
        if (!validateRecoverEmail()) {
            return;
        }
        setIsLoading(true)
        try{
            const response = await recover({ recoverEmail});
            toast.success(response);
            setShowEmailPopup(false)
        } catch (err){
            toast.error('Email não enviado.');
            console.error("Falha na recuperação:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClosePopup = () => {
        setShowEmailPopup(false);
        setRecoverEmail('');
    };
    
    const handleFormSubmit = (event) => {
        event.preventDefault();
        if (type === 'signup' &&  !selectType) {
            toast.warn("Por favor, escolha um tipo de conta.");
            return;
        }
        if (type === 'signup' && !name) {
            toast.warn("Por favor, preencha o nome.");
            return;
        }
        if (!email) {
            toast.warn("Por favor, preencha o e-mail.");
            return;
        }
        if (!password) {
            toast.warn("Por favor, preencha a senha.");
            return;
        }
        
        if(!validateForm()){
            return;
        }
        if (type === 'login') {
            handleSubmitLogin();
        } else {
            handleSubmitCreate();
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.logoContainer}>
                {isLoading ? <Loading /> : <img src="logomini.svg" alt="" />}
            </div>
            <div className={styles.container}>
                <form onSubmit={handleFormSubmit}>
                    {type === 'signup' &&
                    <>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputTypeLine}>
                                <label>
                                    <input
                                    type="radio"
                                    name="tipoUso"
                                    value="ADMIN"
                                    checked={selectType === 'ADMIN'}
                                    onChange={handleChangeSelectType}
                                    />
                                    Uso Pessoal
                                </label>
                                <label>
                                    <input
                                    type="radio"
                                    name="tipoUso"
                                    value="USER"
                                    checked={selectType === 'USER'}
                                    onChange={handleChangeSelectType}
                                    />
                                    Uso Empresarial
                                </label>
                            </div>
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="email">Nome: </label>
                            <input 
                                type="text"
                                name='name'
                                id='name'
                                placeholder='Digite o nome' 
                                value={name}
                                onChange={handleChangeName}
                            />
                        </div>
                    </>
                    }
                    <div className={styles.inputContainer}>
                        <label htmlFor="email">E-mail: </label>
                        <input 
                            type="text"
                            name='email'
                            id='email'
                            placeholder='Digite o email' 
                            value={email}
                            onChange={handleChangeEmail}
                        />
                    </div>
                    <div className={styles.inputContainer}>
                        <label htmlFor="password">Senha: </label>
                        <input 
                            type="password"
                            name='password'
                            id='password'
                            placeholder='Digite a senha' 
                            value={password}
                            onChange={handleChangePass}
                        />
                    </div>
                    {type === 'login' && <div className={styles.recover}>
                        <span 
                            onClick={() => setShowEmailPopup(true)} 
                            className={styles.setType}
                        >
                            Esqueci minha senha
                        </span>
                    </div>}
                    {type === 'login' ? 
                        <button type="submit" className={styles.buttonSubmit}>Entrar</button>
                        : <button type="submit" className={styles.buttonSubmit}>Criar conta</button>}
                </form>
                <div className={styles.create}>
                    {type === 'login' ? 
                    <>
                        <p>Não tem uma conta? </p>
                        <span onClick={() => {
                            setType('signup')
                            setEmail("");
                            setName("")
                            setPassword("");
                        }} className={styles.setType}>Criar conta</span>
                    </>
                    : <>
                        <p>Já tem uma conta? </p>
                        <span onClick={() => {
                            setType('login')
                            setEmail("");
                            setName("")
                            setPassword("");
                        }}  className={styles.setType}>Entrar</span>
                    </>}
                </div>  
            </div>
            {showEmailPopup && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popup}>
                        <div className={styles.popupHeader}>
                        <header>
                            <span>Esqueci minha senha</span>
                        </header>
                            <button 
                                className={styles.closeButton}
                                onClick={handleClosePopup}
                            >
                                ×
                            </button>
                        </div>
                        <div className={styles.popupContent}>
                            <div className={styles.inputContainer}>
                                <label htmlFor="recoverEmail">E-mail para recuperação:</label>
                                <input 
                                    type="email"
                                    id="recoverEmail"
                                    placeholder="Digite seu email"
                                    value={recoverEmail}
                                    onChange={handleChangeRecoverEmail}
                                />
                            </div>
                        </div>
                        <div className={styles.popupFooter}>
                            <button 
                                className={styles.buttonCancel}
                                onClick={handleClosePopup}
                            >
                                Cancelar
                            </button>
                            <button 
                                className={styles.buttonSubmit}
                                onClick={handleContinueRecover}
                                disabled={isLoading} 
                            >
                                {isLoading ? 'Carregando...' : 'Continuar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoginPage;