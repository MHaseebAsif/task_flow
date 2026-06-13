import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutGrid, LayoutDashboard, Building2, LogOut, ChevronLeft, ChevronRight, Menu } from "lucide-react";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Companies", path: "/admin/companies", icon: Building2 },
  ];

  return (
    <div className="font-sans bg-background min-h-screen text-white flex overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap');
      `}</style>

      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setMobileOpen(false)} 
        />
      )}

      <div 
        className={`fixed top-0 left-0 h-full bg-surface border-r border-white/10 flex flex-col z-50 transition-all duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 ${collapsed ? "md:w-20" : "md:w-64"} w-64`}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <Link to="/admin/dashboard" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-700 flex items-center justify-center shrink-0">
              <LayoutGrid className="w-4 h-4 text-white" />
            </div>
            <span className={`text-lg font-semibold tracking-tight transition-opacity duration-300 md:block ${collapsed ? "md:hidden" : "block"}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              TaskFlow
            </span>
          </Link>
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className="hidden md:flex items-center justify-center w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 text-gray-400 transition-colors shrink-0"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto overflow-x-hidden">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                title={collapsed ? link.name : undefined}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-primary/10 text-primary border-l-2 border-primary"
                    : "text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent"
                } ${collapsed ? "md:justify-center" : ""}`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className={`whitespace-nowrap transition-opacity duration-300 md:block ${collapsed ? "md:hidden" : "block"}`}>
                  {link.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className={`flex items-center gap-3 mb-4 px-2 ${collapsed ? "md:justify-center" : ""}`}>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || "S"}
            </div>
            <div className={`flex-1 min-w-0 transition-opacity duration-300 md:block ${collapsed ? "md:hidden" : "block"}`}>
              <p className="text-sm font-medium truncate text-gray-200">{user?.name || "Super Admin"}</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-primary/20 text-primary uppercase tracking-wider mt-1">
                Super Admin
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            title={collapsed ? "Log out" : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors ${collapsed ? "md:justify-center" : ""}`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className={`whitespace-nowrap transition-opacity duration-300 md:block ${collapsed ? "md:hidden" : "block"}`}>
              Log out
            </span>
          </button>
        </div>
      </div>

      <div className={`flex-1 flex flex-col min-h-screen relative overflow-hidden transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"}`}>
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-purple-600 opacity-20 blur-[160px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-primary opacity-15 blur-[140px] pointer-events-none" />

        <header className="h-16 border-b border-white/10 bg-background/50 backdrop-blur-md flex items-center justify-between md:justify-end px-4 md:px-6 sticky top-0 z-10">
          <button 
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 p-4 md:p-6 relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
