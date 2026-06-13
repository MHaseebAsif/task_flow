import { useState, useEffect } from "react";
import { FolderKanban, ListChecks, CheckCircle2, Users } from "lucide-react";
import { getDashboard } from "../../Helpers/companyApi";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    teamMembers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getDashboard();
        const data = response.data;
        setStats({
          totalProjects: data.projects || 0,
          totalTasks: data.tasks || 0,
          completedTasks: data.completed_tasks || 0,
          teamMembers: data.users || 0,
        });
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Dashboard
        </h1>
        <p className="text-sm text-gray-400">
          Overview of your workspace
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-gray-400 text-sm animate-pulse">Loading dashboard...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface border border-white/10 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <FolderKanban className="w-5 h-5 text-primary" />
              </div>
              <div className="text-3xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {stats.totalProjects}
              </div>
              <div className="text-sm text-gray-400 mt-1">Total Projects</div>
            </div>

            <div className="bg-surface border border-white/10 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4">
                <ListChecks className="w-5 h-5 text-gray-300" />
              </div>
              <div className="text-3xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {stats.totalTasks}
              </div>
              <div className="text-sm text-gray-400 mt-1">Total Tasks</div>
            </div>

            <div className="bg-surface border border-white/10 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-3xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {stats.completedTasks}
              </div>
              <div className="text-sm text-gray-400 mt-1">Completed Tasks</div>
            </div>

            <div className="bg-surface border border-white/10 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-gray-300" />
              </div>
              <div className="text-3xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {stats.teamMembers}
              </div>
              <div className="text-sm text-gray-400 mt-1">Team Members</div>
            </div>
          </div>

          <div className="bg-surface border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Recent Activity
            </h2>
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-gray-500">No recent activity yet</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
