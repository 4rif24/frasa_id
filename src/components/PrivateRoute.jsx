import { Navigate, useLocation } from 'react-router-dom';
import useUser from '../../hooks/useUser';

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useUser();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-secondary mx-auto"></div>
          <p className="mt-4 text-gray-600">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    // Redirect ke login page dengan state untuk kembali ke halaman sebelumnya
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;