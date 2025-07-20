import React, { useMemo } from 'react'
import './Menu.css';
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext';
import { RiCoinsLine } from "react-icons/ri"
import { IoSettingsSharp, IoLogOutOutline, IoApps } from "react-icons/io5"
import { toast } from 'react-toastify';
import { GoPeople } from "react-icons/go";


const Menu = () => {

  const {logout, userRole} = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try{
      logout();
      toast.success('Logout realizado com sucesso.');
      navigate('/login', { replace: true});
    } catch (err){
        toast.error('Erro ao fazer logout. Tente novamente.');
        console.error("Falha no logout:", err);
    }
  }
  

  return (
    <div className='menuContainer'>
        <div className='menuItens1'>
            <div className='menuLink'><NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}><IoApps />Dashboard</NavLink></div>
            <div className='menuLink'><NavLink to="/gastos" className={({ isActive }) => isActive ? 'active' : ''}><RiCoinsLine />Gastos</NavLink></div>
            {userRole==='EMPRESARIAL' &&
              <div className='menuLink'><NavLink to="/funcionarios" className={({ isActive }) => isActive ? 'active' : ''}><GoPeople />Funcionários</NavLink></div>
            }
        </div>

        <div className='menuItens2'>
            <div className='menuLink'><Link to="/config"><IoSettingsSharp />Configurações</Link></div>
            <div className='menuLink'><Link to="/login" onClick={handleLogout}><IoLogOutOutline />Sair</Link></div>
        </div>
    </div>
  )
}

export default Menu;