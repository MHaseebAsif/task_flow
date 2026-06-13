import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutGrid, LayoutDashboard, FolderKanban, ListChecks, Users, History, Settings, LogOut } from "lucide-react";

const CompanyLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: "Dashboard", path: "/company/dashboard", icon: LayoutDashboard, roles: ["admin", "manager", "member"] },
    { name: "Projects", path: "/company/projects", icon: FolderKanban, roles: ["admin", "manager"] },
    { name: "Tasks", path: "/company/tasks", icon: ListChecks, roles: ["admin", "manager", "member"] },
    { name: "Team", path: "/company/team", icon: Users, roles: ["admin"] },
    { name: "Audit Logs", path: "/company/audit-logs", icon: History, roles: ["admin"] },
    { name: "Settings", path: "/company/settings", icon: Settings, roles: ["admin"] },
  ];

  const allowedLinks = navLinks.filter(link => link.roles.includes(user?.role || "member"));

  const getPageTitle = () => {
    const currentLink = navLinks.find(link => location.pathname.startsWith(link.path));
    return currentLink ? currentLink.name : "Dashboard";
  };

  const companyName = user?.company?.name || user?.company_name || "Workspace";
  const companyLogo = user?.company?.logo_url || user?.logo_url;

  return (
    <div className="font-sans bg-background min-h-screen text-white flex">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap');
      `}</style>

      <div className="fixed top-0 left-0 w-64 h-full bg-surface border-r border-white/10 flex flex-col z-20">
        <Link to="/company/dashboard" className="flex items-center gap-2 p-6 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-700 flex items-center justify-center shrink-0">
            <LayoutGrid className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            TaskFlow
          </span>
        </Link>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {allowedLinks.map((link) => {
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
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-gray-200">{user?.name || "User"}</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-primary/20 text-primary uppercase tracking-wider mt-1">
                {user?.role || "Member"}
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

        <header className="h-16 border-b border-white/10 bg-background/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {getPageTitle()}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-300">{companyName}</span>
            {companyLogo ? (
              <img src={companyLogo} alt={companyName} className="w-8 h-8 rounded-md object-cover border border-white/10" />
            ) : (
              <div className="w-8 h-8 rounded-md bg-surface border border-white/10 flex items-center justify-center text-xs font-semibold text-gray-400">
                {companyName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-6 relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CompanyLayout;
