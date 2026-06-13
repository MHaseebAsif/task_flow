import { useState, useEffect } from "react";
import { getAuditLogs } from "../../Helpers/companyApi";
import toast from "react-hot-toast";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await getAuditLogs();
        setLogs(response.data);
      } catch (error) {
        toast.error(error.response?.data?.detail || "Failed to load audit logs");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Audit Logs
        </h1>
        <p className="text-sm text-gray-400">
          Monitor company-wide activity
        </p>
      </div>

      <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-xl min-h-[300px]">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-12 text-gray-400 text-sm animate-pulse">Loading audit logs...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">No activity yet</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/5 text-gray-400 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium">Action</th>
                  <th className="px-6 py-4 font-medium">Entity</th>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-medium text-white capitalize">{log.action.replace("_", " ")}</td>
                    <td className="px-6 py-4 text-gray-400 capitalize">{log.entity_type} {log.entity_id ? `(#${log.entity_id})` : ""}</td>
                    <td className="px-6 py-4">{log.user?.full_name || log.user?.name || "System"}</td>
                    <td className="px-6 py-4 text-gray-400">{new Date(log.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
