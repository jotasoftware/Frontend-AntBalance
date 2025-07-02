import React, { createContext, useState, useEffect, useContext } from "react";
import { login as apiLogin, register as apiRegister } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try{
            const response = await apiLogin(credentials);
            if(response.token){
                localStorage.setItem('token', response.token);
                setIsLoggedIn(true);
            }else{
                throw new Error("Token não retornado pela API");
            }
        }catch(error){
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await apiRegister(userData);
            if (response.token) {
                localStorage.setItem('token', response.token);
                setIsLoggedIn(true);
            }
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    const value = { isLoggedIn, loading, login, logout, register };

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