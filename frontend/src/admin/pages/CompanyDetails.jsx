import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Users, FolderKanban, ListChecks, ChevronDown } from "lucide-react";

const CompanyDetails = () => {
  const { id } = useParams();

  const [company, setCompany] = useState({
    id: id || "1",
    name: "Acme Corp",
    plan: "pro",
    status: "active",
    createdAt: "2023-10-15",
    usersCount: 12,
    projectsCount: 5,
    tasksCount: 128,
  });

  const [teamMembers] = useState([
    {
      id: 1,
      name: "Ali Khan",
      email: "ali@acme.com",
      role: "admin",
    },
  ]);

  const [isPlanDropdownOpen, setIsPlanDropdownOpen] = useState(false);

  const toggleStatus = () => {
    setCompany(prev => ({
      ...prev,
      status: prev.status === "active" ? "blocked" : "active"
    }));
  };

  const updatePlan = (newPlan) => {
    setCompany(prev => ({ ...prev, plan: newPlan }));
    setIsPlanDropdownOpen(false);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <Link to="/admin/companies" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to companies
      </Link>

      <div className="bg-surface border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-start justify-between gap-6 shadow-xl">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {company.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium uppercase tracking-wider ${
              company.plan === "enterprise" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
              company.plan === "pro" ? "bg-primary/10 text-primary border border-primary/20" :
              "bg-white/5 text-gray-400 border border-white/10"
            }`}>
              {company.plan}
            </span>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium tracking-wider ${
              company.status === "active" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
            }`}>
              {company.status === "active" ? "Active" : "Blocked"}
            </span>
            <span className="text-sm text-gray-400">Created {company.createdAt}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setIsPlanDropdownOpen(!isPlanDropdownOpen)}
              className="inline-flex items-center gap-2 bg-surface border border-white/10 hover:bg-white/5 transition-colors text-white px-4 py-2 rounded-lg font-medium text-sm"
            >
              Upgrade Plan
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {isPlanDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-surface border border-white/10 rounded-xl shadow-xl overflow-hidden z-20">
                <button onClick={() => updatePlan("free")} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">Free Plan</button>
                <button onClick={() => updatePlan("pro")} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">Pro Plan</button>
                <button onClick={() => updatePlan("enterprise")} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">Enterprise Plan</button>
              </div>
            )}
          </div>
          <button
            onClick={toggleStatus}
            className={`inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              company.status === "active" 
                ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20" 
                : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20"
            }`}
          >
            {company.status === "active" ? "Block Company" : "Unblock Company"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-surface border border-white/10 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4">
            <Users className="w-5 h-5 text-gray-300" />
          </div>
          <div className="text-3xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {company.usersCount}
          </div>
          <div className="text-sm text-gray-400 mt-1">Users</div>
        </div>

        <div className="bg-surface border border-white/10 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4">
            <FolderKanban className="w-5 h-5 text-gray-300" />
          </div>
          <div className="text-3xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {company.projectsCount}
          </div>
          <div className="text-sm text-gray-400 mt-1">Projects</div>
        </div>

        <div className="bg-surface border border-white/10 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4">
            <ListChecks className="w-5 h-5 text-gray-300" />
          </div>
          <div className="text-3xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {company.tasksCount}
          </div>
          <div className="text-sm text-gray-400 mt-1">Tasks</div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Team Members
        </h2>
        <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/5 text-gray-400 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-200">
                {teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{member.name}</td>
                    <td className="px-6 py-4 text-gray-400">{member.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wider bg-white/5 text-gray-300 border border-white/10">
                        {member.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
