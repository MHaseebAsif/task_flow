import { useState, useEffect } from "react";
import { FolderKanban, ListChecks, CheckCircle2, Users, Inbox, Activity } from "lucide-react";
import { getDashboard, getAuditLogs } from "../../Helpers/companyApi";
import { getTasks } from "../../Helpers/taskApi";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    teamMembers: 0,
  });
  const [taskData, setTaskData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, tasksRes, auditRes] = await Promise.all([
          getDashboard(),
          getTasks(),
          getAuditLogs()
        ]);
        
        const data = dashRes.data;
        setStats({
          totalProjects: data.projects || 0,
          totalTasks: data.tasks || 0,
          completedTasks: data.completed_tasks || 0,
          teamMembers: data.users || 0,
        });
        
        setTaskData(tasksRes.data || []);
        setActivityData((auditRes.data || []).slice(0, 5));
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
    const months = Math.floor(days / 30);
    return `${months} month${months !== 1 ? 's' : ''} ago`;
  };

  const statusCounts = taskData.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, { todo: 0, in_progress: 0, done: 0 });

  const pieData = [
    { name: 'To Do', value: statusCounts.todo, color: '#a855f7' },
    { name: 'In Progress', value: statusCounts.in_progress, color: '#6366f1' },
    { name: 'Done', value: statusCounts.done, color: '#10b981' },
  ].filter(d => d.value > 0);

  const priorityCounts = taskData.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, { low: 0, medium: 0, high: 0 });

  const barData = [
    { name: 'Low', count: priorityCounts.low },
    { name: 'Medium', count: priorityCounts.medium },
    { name: 'High', count: priorityCounts.high },
  ];

  return (
    <div className="space-y-8">
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
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <ListChecks className="w-5 h-5 text-gray-300" />
              </div>
            </div>

            <div className="bg-surface border border-white/10 rounded-2xl p-6 hover:scale-105 transition-transform duration-300 cursor-pointer hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 group flex justify-between items-start">
              <div>
                <div className="text-3xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {stats.completedTasks}
                </div>
                <div className="text-sm text-gray-400 mt-1">Completed Tasks</div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
            </div>

            <div className="bg-surface border border-white/10 rounded-2xl p-6 hover:scale-105 transition-transform duration-300 cursor-pointer hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 group flex justify-between items-start">
              <div>
                <div className="text-3xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {stats.teamMembers}
                </div>
                <div className="text-sm text-gray-400 mt-1">Team Members</div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <Users className="w-5 h-5 text-gray-300" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-surface border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Tasks by Status
              </h2>
              <div className="h-[250px] w-full flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[#a855f7]/15 rounded-full blur-[60px] pointer-events-none scale-75" />
                {taskData.length === 0 ? (
                  <p className="text-sm text-gray-500">No tasks found</p>
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
                Tasks by Priority
              </h2>
              <div className="h-[250px] w-full flex items-center justify-center">
                {taskData.length === 0 ? (
                  <p className="text-sm text-gray-500">No tasks found</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ backgroundColor: '#110c22', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}
                      />
                      <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          <div className="bg-surface border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Recent Activity
            </h2>
            {activityData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Inbox className="w-12 h-12 text-white/10" />
                <p className="text-sm text-gray-500">No recent activity yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activityData.map((activity, index) => (
                  <div key={activity.id || index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <Activity className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 truncate">
                        {activity.entity_type} • {activity.user?.name || "System"}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 whitespace-nowrap">
                      {timeAgo(activity.created_at)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
