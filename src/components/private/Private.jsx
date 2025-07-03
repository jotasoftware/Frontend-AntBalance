import { useContext, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Private = ({ children }) => {
  const {isLoggedIn} = useAuth();
  useEffect(()=>{
    if(!isLoggedIn){
      toast.error('Faça login para acessar o sistema.');
    }
  }, [])
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default Private;
