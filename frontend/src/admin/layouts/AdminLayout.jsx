import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-4 text-xl font-bold border-b">TaskFlow Admin</div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin/dashboard" className="block p-2 rounded hover:bg-gray-50">Dashboard</Link>
          <Link to="/admin/companies" className="block p-2 rounded hover:bg-gray-50">Companies</Link>
        </nav>
        <div className="p-4 border-t">
          <button onClick={logout} className="w-full text-left p-2 text-red-600 hover:bg-red-50 rounded">Logout</button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
