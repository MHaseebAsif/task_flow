import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { getAllCompanies } from "../../Helpers/adminApi";
import DataTable from "../../Component/DataTable";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await getAllCompanies();
        setCompanies(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const columns = useMemo(() => [
    {
      accessorKey: "name",
      header: "Company Name",
      cell: (info) => <span className="font-medium text-white">{info.getValue()}</span>
    },
    {
      accessorKey: "subscription_plan",
      header: "Plan",
      cell: (info) => {
        const plan = info.getValue();
        return (
          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wider ${
            plan === "enterprise" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
            plan === "pro" ? "bg-primary/10 text-primary border border-primary/20" :
            "bg-white/5 text-gray-400 border border-white/10"
          }`}>
            {plan}
          </span>
        );
      }
    },
    {
      accessorKey: "user_count",
      header: "Users",
    },
    {
      accessorKey: "project_count",
      header: "Projects",
    },
    {
      accessorKey: "task_count",
      header: "Tasks",
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: (info) => {
        const isActive = info.getValue();
        return (
          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium tracking-wider ${
            isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
          }`}>
            {isActive ? "Active" : "Blocked"}
          </span>
        );
      }
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <Link to={`/admin/companies/${row.original.id}`} className="text-primary hover:text-primary/80 font-medium transition-colors">
            View
          </Link>
        </div>
      )
    }
  ], []);

  return (
    <div className="space-y-8">
      <DataTable 
        columns={columns} 
        data={companies} 
        loading={isLoading} 
        emptyMessage="No companies found" 
      />
    </div>
  );
};

export default Companies;
