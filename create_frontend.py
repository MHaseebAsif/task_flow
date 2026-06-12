import os

structure = {
    "frontend/package.json": """{
  "name": "taskflow-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.6.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "vite": "^5.0.0"
  }
}
""",
    "frontend/vite.config.js": """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
""",
    "frontend/tailwind.config.js": """/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
""",
    "frontend/postcss.config.js": """export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
""",
    "frontend/index.html": """<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TaskFlow</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
""",
    "frontend/.env": "VITE_BASE_URL=http://127.0.0.1:8000\n",
    "frontend/.gitignore": "node_modules\ndist\n.env\n",
    "frontend/src/index.css": """@tailwind base;
@tailwind components;
@tailwind utilities;
""",
    "frontend/src/main.jsx": """import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
""",
    "frontend/src/App.jsx": """import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AppRoutes />
    </div>
  );
}

export default App;
""",
    "frontend/src/Helpers/constant.js": 'export const BASE_URL = import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8000";\n',
    "frontend/src/Helpers/axiosInterceptor.js": """import axios from 'axios';
import { BASE_URL } from './constant';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
""",
    "frontend/src/context/AuthContext.jsx": """import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [token, user]);

  const login = (data) => {
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
""",
    "frontend/src/routes/AppRoutes.jsx": """import { Routes, Route } from 'react-router-dom';
import WebsiteLayout from '../website/layouts/WebsiteLayout';
import LandingPage from '../website/pages/LandingPage';
import Login from '../auth/pages/Login';
import Signup from '../auth/pages/Signup';
import AdminRoute from './AdminRoute';
import AdminLayout from '../admin/layouts/AdminLayout';
import AdminDashboard from '../admin/pages/Dashboard';
import Companies from '../admin/pages/Companies';
import CompanyDetails from '../admin/pages/CompanyDetails';
import CompanyRoute from './CompanyRoute';
import CompanyLayout from '../company/layouts/CompanyLayout';
import CompanyDashboard from '../company/pages/Dashboard';
import Projects from '../company/pages/Projects';
import Tasks from '../company/pages/Tasks';
import Team from '../company/pages/Team';
import AuditLogs from '../company/pages/AuditLogs';
import Settings from '../company/pages/Settings';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<WebsiteLayout />}>
        <Route index element={<LandingPage />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin/*" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="companies" element={<Companies />} />
          <Route path="companies/:id" element={<CompanyDetails />} />
        </Route>
      </Route>
      <Route path="/company/*" element={<CompanyRoute />}>
        <Route element={<CompanyLayout />}>
          <Route path="dashboard" element={<CompanyDashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="team" element={<Team />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
""",
    "frontend/src/routes/AdminRoute.jsx": """import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user, token } = useAuth();
  
  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== 'super_admin') return <Navigate to="/company/dashboard" replace />;
  
  return <Outlet />;
};

export default AdminRoute;
""",
    "frontend/src/routes/CompanyRoute.jsx": """import { Navigate, Outlet } from 'react-router-dom';
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
""",
    "frontend/src/routes/ProtectedRoute.jsx": """import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { token } = useAuth();
  
  if (!token) return <Navigate to="/login" replace />;
  
  return <Outlet />;
};

export default ProtectedRoute;
""",
    "frontend/src/Component/RoleGate.jsx": """import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleGate = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/company/dashboard" replace />;
  }

  return children;
};

export default RoleGate;
""",
    "frontend/src/company/layouts/CompanyLayout.jsx": """import { Outlet, Link } from 'react-router-dom';
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
""",
    "frontend/src/admin/layouts/AdminLayout.jsx": """import { Outlet, Link } from 'react-router-dom';
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
""",
    "frontend/src/website/layouts/WebsiteLayout.jsx": """import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const WebsiteLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default WebsiteLayout;
""",
    "frontend/src/website/components/Navbar.jsx": """import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <div className="text-xl font-bold">TaskFlow</div>
      <nav className="space-x-4">
        <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded">Sign Up</Link>
      </nav>
    </header>
  );
};

export default Navbar;
""",
    "frontend/src/website/components/Footer.jsx": """const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 text-center mt-auto">
      <p>&copy; 2026 TaskFlow SaaS</p>
    </footer>
  );
};

export default Footer;
""",
}

empty_components = [
    "frontend/src/admin/pages/Dashboard.jsx",
    "frontend/src/admin/pages/Companies.jsx",
    "frontend/src/admin/pages/CompanyDetails.jsx",
    "frontend/src/auth/pages/Login.jsx",
    "frontend/src/auth/pages/Signup.jsx",
    "frontend/src/website/pages/LandingPage.jsx",
    "frontend/src/company/pages/Dashboard.jsx",
    "frontend/src/company/pages/Projects.jsx",
    "frontend/src/company/pages/ProjectDetails.jsx",
    "frontend/src/company/pages/Tasks.jsx",
    "frontend/src/company/pages/Team.jsx",
    "frontend/src/company/pages/AuditLogs.jsx",
    "frontend/src/company/pages/Settings.jsx",
    "frontend/src/Component/DataTable.jsx",
    "frontend/src/Component/Modal.jsx",
    "frontend/src/Component/ProtectedRoute.jsx"
]

empty_apis = [
    "frontend/src/Helpers/authApi.js",
    "frontend/src/Helpers/companyApi.js",
    "frontend/src/Helpers/projectApi.js",
    "frontend/src/Helpers/taskApi.js",
    "frontend/src/Helpers/adminApi.js"
]

for comp in empty_components:
    name = os.path.basename(comp).replace(".jsx", "")
    structure[comp] = f"const {name} = () => {{ return <div className='p-4'>{name} Component</div>; }};\n\nexport default {name};\n"

for api in empty_apis:
    structure[api] = "import axiosInstance from './axiosInterceptor';\n"

for path, content in structure.items():
    os.makedirs(os.path.dirname(os.path.join(os.getcwd(), path)), exist_ok=True)
    with open(os.path.join(os.getcwd(), path), "w", encoding="utf-8") as f:
        f.write(content)

print("Frontend structure created successfully!")
