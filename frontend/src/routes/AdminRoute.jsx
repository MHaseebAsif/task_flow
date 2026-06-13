import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user, token } = useAuth();
  
  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== 'super_admin') return <Navigate to="/login" replace />;
  
  return <Outlet />;
};

export default AdminRoute;
