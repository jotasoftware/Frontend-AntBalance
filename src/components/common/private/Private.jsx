2
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/components/common/loading/Loading';

const Private = ({ children }) => {
  const { isLoggedIn, loadingAuth } = useAuth();
  if (loadingAuth) {
    return <Loading />;
  }
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default Private;