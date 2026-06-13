import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutGrid, LayoutDashboard, Building2, LogOut } from "lucide-react";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Companies", path: "/admin/companies", icon: Building2 },
  ];


  return (
    <div className="font-sans bg-background min-h-screen text-white flex">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap');
      `}</style>

      <div className="fixed top-0 left-0 w-64 h-full bg-surface border-r border-white/10 flex flex-col z-20">
        <Link to="/admin/dashboard" className="p-6 border-b border-white/10 block hover:opacity-80 transition-opacity">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-700 flex items-center justify-center shrink-0">
              <LayoutGrid className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              TaskFlow
            </span>
          </div>
          <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block font-medium">
            Super Admin
          </span>
        </Link>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary border-l-2 border-primary"
                    : "text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || "S"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-gray-200">{user?.name || "Super Admin"}</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-primary/20 text-primary uppercase tracking-wider mt-1">
                Super Admin
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            Log out
          </button>
        </div>
      </div>

      <div className="flex-1 ml-64 flex flex-col min-h-screen relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-purple-600 opacity-20 blur-[160px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-primary opacity-15 blur-[140px] pointer-events-none" />

        <header className="h-16 border-b border-white/10 bg-background/50 backdrop-blur-md flex items-center px-6 sticky top-0 z-10">
        </header>

        <main className="flex-1 p-6 relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
