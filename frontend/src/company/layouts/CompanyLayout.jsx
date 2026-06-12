import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CompanyLayout = () => {
  const { user, logout } = useAuth();
  const role = user?.role;

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-4 text-xl font-bold border-b">TaskFlow Company</div>
        <nav className="flex-1 p-4 space-y-2">
          {['admin', 'manager', 'member'].includes(role) && (
            <Link to="/company/dashboard" className="block p-2 rounded hover:bg-gray-50">Dashboard</Link>
          )}
          {['admin', 'manager'].includes(role) && (
            <Link to="/company/projects" className="block p-2 rounded hover:bg-gray-50">Projects</Link>
          )}
          {['admin', 'manager', 'member'].includes(role) && (
            <Link to="/company/tasks" className="block p-2 rounded hover:bg-gray-50">Tasks</Link>
          )}
          {role === 'admin' && (
            <Link to="/company/team" className="block p-2 rounded hover:bg-gray-50">Team</Link>
          )}
          {role === 'admin' && (
            <Link to="/company/audit-logs" className="block p-2 rounded hover:bg-gray-50">Audit Logs</Link>
          )}
          {role === 'admin' && (
            <Link to="/company/settings" className="block p-2 rounded hover:bg-gray-50">Settings</Link>
          )}
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

export default CompanyLayout;
