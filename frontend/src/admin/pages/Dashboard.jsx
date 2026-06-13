import { useState, useEffect } from "react";
import { Building2, CheckCircle2, XCircle, Users, FolderKanban, ListChecks } from "lucide-react";
import { getAdminDashboard, getAllCompanies } from "../../Helpers/adminApi";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCompanies: 0,
    activeCompanies: 0,
    blockedCompanies: 0,
    totalUsers: 0,
    totalProjects: 0,
    totalTasks: 0,
  });
  const [companiesData, setCompaniesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, companiesRes] = await Promise.all([
          getAdminDashboard(),
          getAllCompanies()
        ]);
        
        const data = dashboardRes.data;
        setStats({
          totalCompanies: data.total_companies || 0,
          activeCompanies: data.active_companies || 0,
          blockedCompanies: data.blocked_companies || 0,
          totalUsers: data.total_users || 0,
          totalProjects: data.total_projects || 0,
          totalTasks: data.total_tasks || 0,
        });

        setCompaniesData(companiesRes.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const planCounts = companiesData.reduce((acc, company) => {
    acc[company.subscription_plan] = (acc[company.subscription_plan] || 0) + 1;
    return acc;
  }, { free: 0, pro: 0, enterprise: 0 });

  const pieData = [
    { name: 'Free', value: planCounts.free, color: '#f59e0b' },
    { name: 'Pro', value: planCounts.pro, color: '#8b5cf6' },
    { name: 'Enterprise', value: planCounts.enterprise, color: '#10b981' },
  ].filter(d => d.value > 0);

  const statusCounts = companiesData.reduce((acc, company) => {
    if (company.is_active) acc.active += 1;
    else acc.blocked += 1;
    return acc;
  }, { active: 0, blocked: 0 });

  const barData = [
    { name: 'Active', count: statusCounts.active, color: '#10b981' },
    { name: 'Blocked', count: statusCounts.blocked, color: '#ef4444' },
  ];

  return (
    <div className="space-y-8">
      {isLoading ? (
        <div className="text-center py-12 text-gray-400 text-sm animate-pulse">Loading dashboard...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-surface border border-white/10 rounded-2xl p-6 hover:scale-105 transition-transform duration-300 cursor-pointer hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 group flex justify-between items-start">
              <div>
                <div className="text-3xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {stats.totalCompanies}
                </div>
                <div className="text-sm text-gray-400 mt-1">Total Companies</div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
            </div>

            <div className="bg-surface border border-white/10 rounded-2xl p-6 hover:scale-105 transition-transform duration-300 cursor-pointer hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 group flex justify-between items-start">
              <div>
                <div className="text-3xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {stats.activeCompanies}
                </div>
                <div className="text-sm text-gray-400 mt-1">Active Companies</div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
            </div>

            <div className="bg-surface border border-white/10 rounded-2xl p-6 hover:scale-105 transition-transform duration-300 cursor-pointer hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 group flex justify-between items-start">
              <div>
                <div className="text-3xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {stats.blockedCompanies}
                </div>
                <div className="text-sm text-gray-400 mt-1">Blocked Companies</div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
            </div>

            <div className="bg-surface border border-white/10 rounded-2xl p-6 hover:scale-105 transition-transform duration-300 cursor-pointer hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 group flex justify-between items-start">
              <div>
                <div className="text-3xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {stats.totalUsers}
                </div>
                <div className="text-sm text-gray-400 mt-1">Total Users</div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </div>

            <div className="bg-surface border border-white/10 rounded-2xl p-6 hover:scale-105 transition-transform duration-300 cursor-pointer hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 group flex justify-between items-start">
              <div>
                <div className="text-3xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {stats.totalProjects}
                </div>
                <div className="text-sm text-gray-400 mt-1">Total Projects</div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <FolderKanban className="w-5 h-5 text-primary" />
              </div>
            </div>

            <div className="bg-surface border border-white/10 rounded-2xl p-6 hover:scale-105 transition-transform duration-300 cursor-pointer hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 group flex justify-between items-start">
              <div>
                <div className="text-3xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {stats.totalTasks}
                </div>
                <div className="text-sm text-gray-400 mt-1">Total Tasks</div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <ListChecks className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-surface border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Companies by Plan
              </h2>
              <div className="h-[250px] w-full flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[#a855f7]/15 rounded-full blur-[60px] pointer-events-none scale-75" />
                {companiesData.length === 0 ? (
                  <p className="text-sm text-gray-500">No companies found</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#110c22', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}
                        itemStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="bg-surface border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Companies Status
              </h2>
              <div className="h-[250px] w-full flex items-center justify-center">
                {companiesData.length === 0 ? (
                  <p className="text-sm text-gray-500">No companies found</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ backgroundColor: '#110c22', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {barData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
