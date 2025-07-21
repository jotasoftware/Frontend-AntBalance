2
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/components/common/loading/Loading';
import styles from './Private.module.css';

const Private = ({ children }) => {
  const { isLoggedIn, loadingAuth } = useAuth();
  console.log(loadingAuth)
  if (loadingAuth) {
    return (
      <div className={styles.loadingContainer}>
        <Loading />
      </div>
    );
  }
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default Private;