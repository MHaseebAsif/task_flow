import { useState } from "react";
import { Link } from "react-router-dom";

const Companies = () => {
  const [companies] = useState([
    {
      id: 1,
      name: "Acme Corp",
      plan: "pro",
      users: 12,
      projects: 5,
      tasks: 128,
      status: "active",
    },
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Companies
        </h1>
        <p className="text-sm text-gray-400">
          Manage all registered companies
        </p>
      </div>

      <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/5 text-gray-400 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">Company Name</th>
                <th className="px-6 py-4 font-medium">Plan</th>
                <th className="px-6 py-4 font-medium">Users</th>
                <th className="px-6 py-4 font-medium">Projects</th>
                <th className="px-6 py-4 font-medium">Tasks</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-200">
              {companies.map((company) => (
                <tr key={company.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{company.name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wider ${
                      company.plan === "enterprise" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                      company.plan === "pro" ? "bg-primary/10 text-primary border border-primary/20" :
                      "bg-white/5 text-gray-400 border border-white/10"
                    }`}>
                      {company.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">{company.users}</td>
                  <td className="px-6 py-4">{company.projects}</td>
                  <td className="px-6 py-4">{company.tasks}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium tracking-wider ${
                      company.status === "active" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                    }`}>
                      {company.status === "active" ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/admin/companies/${company.id}`} className="text-primary hover:text-primary/80 font-medium transition-colors">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Companies;
