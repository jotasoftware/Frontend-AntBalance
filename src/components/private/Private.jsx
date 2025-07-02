import { useContext } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Private = ({ children }) => {
  const {isLoggedIn} = useAuth();

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default Private;
