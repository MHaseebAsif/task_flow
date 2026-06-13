import { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Users, FolderKanban, ListChecks, ChevronDown } from "lucide-react";
import { getCompanyDetails, updateCompanyStatus, updateCompanySubscription } from "../../Helpers/adminApi";
import toast from "react-hot-toast";
import DataTable from "../../Component/DataTable";

const CompanyDetails = () => {
  const { id } = useParams();

  const [company, setCompany] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlanDropdownOpen, setIsPlanDropdownOpen] = useState(false);

  const fetchDetails = async () => {
    try {
      const response = await getCompanyDetails(id);
      setCompany(response.data);
      if (response.data.users) {
        setTeamMembers(response.data.users);
      }
    } catch (error) {
      toast.error("Failed to load company details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const toggleStatus = async () => {
    try {
      await updateCompanyStatus(id, !company.is_active);
      toast.success(company.is_active ? "Company blocked successfully" : "Company unblocked successfully");
      fetchDetails();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const updatePlan = async (newPlan) => {
    try {
      await updateCompanySubscription(id, newPlan);
      toast.success("Subscription plan updated");
      fetchDetails();
    } catch (error) {
      toast.error("Failed to update subscription");
    } finally {
      setIsPlanDropdownOpen(false);
    }
  };

  const columns = useMemo(() => [
    {
      id: "name",
      accessorFn: (row) => row.full_name || row.name,
      header: "Name",
      cell: (info) => <span className="font-medium text-white">{info.getValue()}</span>
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (info) => <span className="text-gray-400">{info.getValue()}</span>
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: (info) => (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wider bg-white/5 text-gray-300 border border-white/10">
          {info.getValue()}
        </span>
      )
    }
  ], []);

  if (isLoading) {
    return <div className="text-center py-12 text-gray-400 text-sm animate-pulse">Loading company details...</div>;
  }

  if (!company) {
    return <div className="text-center py-12 text-red-500 text-sm">Company not found</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <Link to="/admin/companies" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to companies
      </Link>

      <div className="bg-surface border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-start justify-between gap-6 shadow-xl">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium uppercase tracking-wider ${
              company.subscription_plan === "enterprise" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
              company.subscription_plan === "pro" ? "bg-primary/10 text-primary border border-primary/20" :
              "bg-white/5 text-gray-400 border border-white/10"
            }`}>
              {company.subscription_plan}
            </span>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium tracking-wider ${
              company.is_active ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
            }`}>
              {company.is_active ? "Active" : "Blocked"}
            </span>
            <span className="text-sm text-gray-400">Created {new Date(company.created_at).toLocaleDateString()}</span>
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
              company.is_active 
                ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20" 
                : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20"
            }`}
          >
            {company.is_active ? "Block Company" : "Unblock Company"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-surface border border-white/10 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4">
            <Users className="w-5 h-5 text-gray-300" />
          </div>
          <div className="text-3xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {company.user_count || 0}
          </div>
          <div className="text-sm text-gray-400 mt-1">Users</div>
        </div>

        <div className="bg-surface border border-white/10 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4">
            <FolderKanban className="w-5 h-5 text-gray-300" />
          </div>
          <div className="text-3xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {company.project_count || 0}
          </div>
          <div className="text-sm text-gray-400 mt-1">Projects</div>
        </div>

        <div className="bg-surface border border-white/10 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4">
            <ListChecks className="w-5 h-5 text-gray-300" />
          </div>
          <div className="text-3xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {company.task_count || 0}
          </div>
          <div className="text-sm text-gray-400 mt-1">Tasks</div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Team Members
        </h2>
        <DataTable 
          columns={columns} 
          data={teamMembers} 
          loading={isLoading} 
          emptyMessage="No team members found" 
        />
      </div>
    </div>
  );
};

export default CompanyDetails;
