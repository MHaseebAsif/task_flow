import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CompanyRoute = () => {
  const { user, token } = useAuth();
  
  if (!token) return <Navigate to="/login" replace />;
  if (!['admin', 'manager', 'member'].includes(user?.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return <Outlet />;
};

export default CompanyRoute;
