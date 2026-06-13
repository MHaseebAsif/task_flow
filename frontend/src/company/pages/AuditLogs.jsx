import { useState, useEffect, useMemo } from "react";
import { getAuditLogs, getAllUsers } from "../../Helpers/companyApi";
import DataTable from "../../Component/DataTable";
import toast from "react-hot-toast";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [logsResponse, usersResponse] = await Promise.all([
          getAuditLogs(),
          getAllUsers()
        ]);
        
        const usersMap = {};
        usersResponse.data.forEach(user => {
          usersMap[user.id] = user.full_name || user.name;
        });
        
        setUsers(usersMap);
        setLogs(logsResponse.data);
      } catch (error) {
        toast.error(error.response?.data?.detail || "Failed to load audit logs");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = useMemo(() => [
    {
      accessorKey: "action",
      header: () => <div className="text-center w-full">Action</div>,
      cell: (info) => <div className="text-center"><span className="font-medium text-white capitalize">{info.getValue()?.replace("_", " ")}</span></div>
    },
    {
      id: "entity",
      accessorFn: (row) => `${row.entity || ""} ${row.entity_id ? `(#${row.entity_id.substring(0, 8)})` : ""}`.trim(),
      header: () => <div className="text-center w-full">Entity</div>,
      cell: (info) => <div className="text-center"><span className="text-gray-400 capitalize">{info.getValue()}</span></div>
    },
    {
      id: "user",
      accessorFn: (row) => row.user_id ? (users[row.user_id] || row.user_id) : "System",
      header: () => <div className="text-center w-full">User</div>,
      cell: (info) => <div className="text-center">{info.getValue()}</div>
    },
    {
      accessorKey: "created_at",
      header: () => <div className="text-center w-full">Date</div>,
      cell: (info) => <div className="text-center"><span className="text-gray-400">{new Date(info.getValue()).toLocaleString()}</span></div>
    }
  ], [users]);

  return (
    <div className="space-y-8">
      <DataTable 
        columns={columns} 
        data={logs} 
        loading={isLoading} 
        emptyMessage="No activity yet" 
      />
    </div>
  );
};

export default AuditLogs;
