import React, { createContext, useState, useEffect, useContext } from "react";
import { login as apiLogin, register as apiRegister, edit as apiEdit, recover as apiRecover, editPassword as apiEditPassword } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [userName, setUserName] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [tokenAuth, setTokenAuth] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedName = localStorage.getItem('userName');
        const storedRole = localStorage.getItem('userRole');
        if (token) {
            console.log(token)
            setIsLoggedIn(true);
            setUserName(storedName);
            setUserRole(storedRole);
            setTokenAuth(token)
        }
        setLoadingAuth(false);
    }, []);

    const login = async (credentials) => {
        try{
            const response = await apiLogin(credentials);
            if(response.token && response.name && response.role) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('userName', response.name);
                localStorage.setItem('userRole', response.role);
                setIsLoggedIn(true);
                setUserName(response.name);
                setUserRole(response.role);
                setTokenAuth(response.token);
            }else{
                throw new Error("Token não retornado pela API");
            }
        }catch(error){
            throw error;
        }
    };

    const register = async (data) => {
        try {
            const payloadParaAPI = {
                name: data.name,
                email: data.email, 
                password: data.password, 
                role: data.selectRole
            };
            const response = await apiRegister(payloadParaAPI);
            if (response.token) {
                localStorage.setItem('token', response.token);
                setIsLoggedIn(true);
            }
        } catch (error) {
            throw error;
        }
    };

    const recover = async (email) => {
        setLoadingAuth(true)
        try {
            const response = await apiRecover(email);
            setLoadingAuth(false)
            return response.message
        } catch (error) {
            throw error;
        }
    };

    const edit = async (credentials) => {
        try {
            const response = await apiEdit(credentials, tokenAuth);
            return response
        } catch (error) {
            throw error;
        }
    };

    const editPassword = async (credentials) => {
        try {
            const response = await apiEditPassword(credentials);
            return response
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        setIsLoggedIn(false);
        setUserName(null);
        setUserRole(null);
        setTokenAuth(null)
    };

    const value = { isLoggedIn, loadingAuth, login, logout, register, edit, userName, recover, editPassword, setUserName, userRole, tokenAuth};

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};