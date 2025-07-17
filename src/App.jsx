import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react'
import './App.css'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import { SplitExpenseProvider } from './context/SplitExpanseContext';

import MainLayout from './layouts/MainLayout/MainLayout';
import LoginPage from './pages/common/LoginPage/LoginPage';
import EditarCadastroPage from './pages/common/EditarCadastroPage/EditarCadastroPage'
import RecoverPage from './pages/common/RecoverPage/RecoverPage';
import ConfigPage from './pages/common/ConfigPage/ConfigPage';
import Private from './components/common/private/Private';

import AppRoutes from '@/routes/AppRoutes';  

function App() {
  return (
    <BrowserRouter>
    <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <AuthProvider>
        <ExpenseProvider>
          <SplitExpenseProvider>
            <AppRoutes />
          </SplitExpenseProvider>
        </ExpenseProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
