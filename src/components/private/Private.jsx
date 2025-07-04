
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from '../loading/Loading';

const Private = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  if (loading) {
    return <Loading />;
  }
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default Private;