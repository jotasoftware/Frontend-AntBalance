import { useState } from 'react'
import './App.css'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import Private from './components/private/Private';
import { AuthProvider } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import GastosPage from './pages/GastosPage/GastosPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import MainLayout from './layouts/MainLayout/MainLayout';
import CadastroGastoPage from './pages/CadastroGastoPage/CadastroGastoPage'
import EditarCadastroPage from './pages/ConfigPage/EditarCadastroPage'
import Private from './components/private/Private';
import RecoverPage from './pages/RecoverPage/RecoverPage';

function App() {
  return (
    <BrowserRouter>
    <ToastContainer
        position="top-right"
        autoClose={4000}
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
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<RecoverPage />} />
            <Route
              path="/"
              element={
                <Private>
                  <MainLayout />
                </Private>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="gastos" element={<GastosPage />} />
              <Route path="cadastrogasto" element={<CadastroGastoPage />} />
              <Route path="editarcadastro" element={<EditarCadastroPage />} />
              <Route path="reset-password" element={<RecoverPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ExpenseProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
