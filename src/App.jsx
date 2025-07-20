import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react'
import './App.css'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider} from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import { SplitExpenseProvider } from './context/SplitExpanseContext';
import { EmployeeProvider } from './context/EmployeeContext';

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
            <EmployeeProvider>
              <AppRoutes />
            </EmployeeProvider>
          </SplitExpenseProvider>
        </ExpenseProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
