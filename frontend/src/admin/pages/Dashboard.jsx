import { useState } from "react";
import { Building2, CheckCircle2, XCircle, Users, FolderKanban, ListChecks } from "lucide-react";

const Dashboard = () => {
  const [stats] = useState({
    totalCompanies: 0,
    activeCompanies: 0,
    blockedCompanies: 0,
    totalUsers: 0,
    totalProjects: 0,
    totalTasks: 0,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Platform Overview
        </h1>
        <p className="text-sm text-gray-400">
          Monitor all companies and usage
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-surface border border-white/10 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div className="text-3xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {stats.totalCompanies}
          </div>
          <div className="text-sm text-gray-400 mt-1">Total Companies</div>
        </div>

        <div className="bg-surface border border-white/10 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {stats.activeCompanies}
          </div>
          <div className="text-sm text-gray-400 mt-1">Active Companies</div>
        </div>

        <div className="bg-surface border border-white/10 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center mb-4">
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-3xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {stats.blockedCompanies}
          </div>
          <div className="text-sm text-gray-400 mt-1">Blocked Companies</div>
        </div>

        <div className="bg-surface border border-white/10 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div className="text-3xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {stats.totalUsers}
          </div>
          <div className="text-sm text-gray-400 mt-1">Total Users</div>
        </div>

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
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
            <ListChecks className="w-5 h-5 text-primary" />
          </div>
          <div className="text-3xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {stats.totalTasks}
          </div>
          <div className="text-sm text-gray-400 mt-1">Total Tasks</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
