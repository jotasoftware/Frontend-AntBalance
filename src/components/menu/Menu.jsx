import React from 'react'
import './Menu.css';
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';

const Menu = () => {

  const {logout} = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try{
      await login({ email, password });
      toast.success('Login bem sucedido.');
      localStorage.removeItem('token');
      navigate('/login', { replace: true});
    } catch (err){
        toast.error('Erro ao fazer logout. Tente novamente.');
        console.error("Falha no logout:", err);
    }
  }
  

  return (
    <div className='menuDiv'>
        <div className='menuItens1'>
            <div className='menuLink'><NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink></div>
            {/* <div className='menuLink'><NavLink to="/gastos" className={({ isActive }) => isActive ? 'active' : ''}>Equipes</NavLink></div> */}
        </div>

        
        <div className='menuItens2'>
            <div className='menuLink'><Link to="/config">Configurações</Link></div>
            <div className='menuLink'><Link to="/login" onClick={handleLogout}>Sair</Link></div>
        </div>
    </div>
  )
}

export default Menu;