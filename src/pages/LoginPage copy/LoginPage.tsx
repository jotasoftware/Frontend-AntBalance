import React, { useEffect, useState } from 'react'
import styles from './LoginPage.module.css'
import { FaGoogle, FaFacebook, FaArrowLeft } from 'react-icons/fa'
import { Link, redirect } from 'react-router-dom'
import {auth} from '../../firebase/firebaseConfig'
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { useNavigate } from 'react-router-dom'
import { useCreateUserWithEmailAndPassword, useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Loader from '../../components/Loader/Loader'

const LoginPage = () => {
    const [type, setType] = useState<string>('login')
    const [email, setEmail] = useState<string>('')
    const [pass, setPass] = useState<string>('')
    const [errorEmail, setErrorEmail] = useState<boolean>(false)
    const [errorPass, setErrorPass] = useState<boolean>(false)
    const navigate = useNavigate()
    const [createUserWithEmailAndPassword, user, loadingCreate, errorCreate ] = useCreateUserWithEmailAndPassword(auth)
    const [signInWithEmailAndPassword, userSignIn, loadingSignIn, errorSignIn ] = useSignInWithEmailAndPassword(auth)

    const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        setEmail(event.target.value);
        if(regexEmail.test(event.target.value)) setErrorEmail(false)
    }
    const handleChangePass = (event: React.ChangeEvent<HTMLInputElement>) => {
        const regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        setPass(event.target.value);
        if(regexPass.test(event.target.value)) setErrorPass(false)
    }
    const handleClickGoogle = ()=>{
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
        .then((result) => {
          const user = result.user;
          navigate('/')
        }).catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          const email = error.customData.email;
          const credential = GoogleAuthProvider.credentialFromError(error);
        })
    }
    const handleClickFacebook = async()=>{
        const provider = new FacebookAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
            const credential = FacebookAuthProvider.credentialFromResult(result);
            navigate('/');
        }).catch((error) => {
            console.log(error)
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = FacebookAuthProvider.credentialFromError(error);
        });
    }

    const validateForm = () =>{
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        const errors = []
        if(!regexEmail.test(email)){
            errors.push('Invalid Email')
            toast.error(`Invalid Email`)
        }
        if(!regexPass.test(pass)){
            errors.push('Invalid Password')
            toast.error(`Invalid Password - 8 characters with capital letters, numbers and any special characters`)
        }
        return errors.length>0 
    }
    const handleSubmitLogin = (e: React. MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setErrorPass(false)
        if(!validateForm()){
            signInWithEmailAndPassword(email, pass)
        }
    }
    const handleSubmitSignup = (e: React. MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setErrorPass(false)
        if(!validateForm()){
            createUserWithEmailAndPassword(email, pass)
        }
    }

    const cleanAll = ()=> {
        setEmail('')
        setPass('')
    }

    useEffect(()=>{
        cleanAll()
        setErrorEmail(false)
        setErrorPass(false)
    }, [type])
    useEffect(()=>{
        if(errorCreate?.message == 'Firebase: Error (auth/email-already-in-use).') toast.error(`There is already a registration with this email`)
        if(errorSignIn?.message == 'Firebase: Error (auth/invalid-credential).') toast.error(`Invalid Credentials`)
    }, [errorCreate, errorSignIn])
    useEffect(()=>{
        if (!loadingCreate && user){
            toast.success('User created')
            cleanAll()
            setType('login')
        }
    }, [loadingCreate, user])
    useEffect(()=>{
        if (!loadingSignIn && userSignIn){
            toast.success('Login successful')
            setTimeout(() => {
                navigate('/')
            }, 1000)
        }
    }, [loadingSignIn, userSignIn])

  return (
    <div className={styles.page}>
        <ToastContainer />
        <Link to='/' className={styles.backPage}><FaArrowLeft size={24}></FaArrowLeft></Link>
        <div className={styles.container}>
            <header>
                {loadingSignIn || loadingCreate ? <Loader /> : <img src="https://trisogbucket.s3.amazonaws.com/icons/trisogicon.svg" alt="" />}
                {type == 'login' ? 
                <span>Log in to an account or create one</span>
                : <span>Create your account</span>}
            </header>
            <form>
                <div className={styles.inputContainer}>
                    <label htmlFor="email">E-mail: </label>
                    <input 
                        type="text"
                        name='email'
                        id='email'
                        placeholder='Type an e-mail' 
                        value={email}
                        onChange={handleChangeEmail}
                    />
                    {errorEmail && <p style={{ color: 'red', fontSize: '10px'}}>Invalid Email</p>}
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="email">Password</label>
                    <input 
                        type="password"
                        name='password'
                        id='password'
                        placeholder='Type your password' 
                        value={pass}
                        onChange={handleChangePass}
                    />
                     {errorPass && <p style={{ color: 'red', fontSize: '10px'}}>Invalid Password</p>}
                </div>
                {type == 'login' ? 
                <button type="submit" onClick={handleSubmitLogin}>Log in</button>
                : <button type="submit" onClick={handleSubmitSignup}>Sign up</button>}
            </form>
            <div className={styles.googleFacebook}>
                <button onClick={handleClickGoogle}><FaGoogle></FaGoogle> Google</button>
                <button onClick={handleClickFacebook}><FaFacebook></FaFacebook> Facebook</button>
            </div>
            <div className={styles.create}>
                {type == 'login' ? 
                <>
                <p>Don't have an account? </p>
                <span onClick={() => setType('signup')} className={styles.setType}>Create One</span>
                </>
                : <>
                <p>Do you have an account? </p>
                <span onClick={() => setType('login')} className={styles.setType}>Login here</span>
                </>}
            </div>  
        </div>
    </div>
  )
}

export default LoginPage