import { useState, useEffect, useMemo } from "react";
import { getAuditLogs } from "../../Helpers/companyApi";
import DataTable from "../../Component/DataTable";
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

  const columns = useMemo(() => [
    {
      accessorKey: "action",
      header: "Action",
      cell: (info) => <span className="font-medium text-white capitalize">{info.getValue()?.replace("_", " ")}</span>
    },
    {
      id: "entity",
      accessorFn: (row) => `${row.entity_type} ${row.entity_id ? `(#${row.entity_id})` : ""}`,
      header: "Entity",
      cell: (info) => <span className="text-gray-400 capitalize">{info.getValue()}</span>
    },
    {
      id: "user",
      accessorFn: (row) => row.user?.full_name || row.user?.name || "System",
      header: "User",
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: (info) => <span className="text-gray-400">{new Date(info.getValue()).toLocaleString()}</span>
    }
  ], []);

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
