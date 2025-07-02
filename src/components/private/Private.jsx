import { useContext } from 'react';
import AuthProvider from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Private = ({ children }) => {
  const { isLoggedIn } = useContext(AuthProvider);

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default Private;
