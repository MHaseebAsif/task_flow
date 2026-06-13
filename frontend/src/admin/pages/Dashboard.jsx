import { useState, useEffect } from "react";
import { Building2, CheckCircle2, XCircle, Users, FolderKanban, ListChecks } from "lucide-react";
import { getAdminDashboard } from "../../Helpers/adminApi";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCompanies: 0,
    activeCompanies: 0,
    blockedCompanies: 0,
    totalUsers: 0,
    totalProjects: 0,
    totalTasks: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getAdminDashboard();
        const data = response.data;
        setStats({
          totalCompanies: data.total_companies || 0,
          activeCompanies: data.active_companies || 0,
          blockedCompanies: data.blocked_companies || 0,
          totalUsers: data.total_users || 0,
          totalProjects: data.total_projects || 0,
          totalTasks: data.total_tasks || 0,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-8">

      {isLoading ? (
        <div className="text-center py-12 text-gray-400 text-sm animate-pulse">Loading dashboard...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-surface border border-white/10 rounded-2xl p-6 hover:scale-105 transition-transform duration-300 cursor-pointer hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 group">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {stats.totalCompanies}
            </div>
            <div className="text-sm text-gray-400 mt-1">Total Companies</div>
          </div>

          <div className="bg-surface border border-white/10 rounded-2xl p-6 hover:scale-105 transition-transform duration-300 cursor-pointer hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 group">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:bg-emerald-500/30 transition-colors">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-3xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {stats.activeCompanies}
            </div>
            <div className="text-sm text-gray-400 mt-1">Active Companies</div>
          </div>

          <div className="bg-surface border border-white/10 rounded-2xl p-6 hover:scale-105 transition-transform duration-300 cursor-pointer hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 group">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center mb-4 group-hover:bg-red-500/30 transition-colors">
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-3xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {stats.blockedCompanies}
            </div>
            <div className="text-sm text-gray-400 mt-1">Blocked Companies</div>
          </div>

          <div className="bg-surface border border-white/10 rounded-2xl p-6 hover:scale-105 transition-transform duration-300 cursor-pointer hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 group">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {stats.totalUsers}
            </div>
            <div className="text-sm text-gray-400 mt-1">Total Users</div>
          </div>

          <div className="bg-surface border border-white/10 rounded-2xl p-6 hover:scale-105 transition-transform duration-300 cursor-pointer hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 group">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
              <FolderKanban className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {stats.totalProjects}
            </div>
            <div className="text-sm text-gray-400 mt-1">Total Projects</div>
          </div>

          <div className="bg-surface border border-white/10 rounded-2xl p-6 hover:scale-105 transition-transform duration-300 cursor-pointer hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 group">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
              <ListChecks className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {stats.totalTasks}
            </div>
            <div className="text-sm text-gray-400 mt-1">Total Tasks</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
