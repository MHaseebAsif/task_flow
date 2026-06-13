import { useState, useEffect } from "react";
import { getMyCompany } from "../../Helpers/companyApi";
import { useAuth } from "../../context/AuthContext";
import { BASE_URL } from "../../Helpers/constant";
import { Building2, ShieldCheck, Check, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const Settings = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      if (!user?.company_id && !user?.company?.id) {
        setIsLoading(false);
        return;
      }
      
      const companyId = user?.company_id || user?.company?.id;
      
      try {
        const response = await getMyCompany(companyId);
        setCompany(response.data);
      } catch (error) {
        toast.error("Failed to load company details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompany();
  }, [user]);

  if (isLoading) {
    return <div className="text-center py-12 text-gray-400 text-sm animate-pulse">Loading settings...</div>;
  }

  if (!company) {
    return <div className="text-center py-12 text-red-500 text-sm">Failed to load company</div>;
  }

  const getPlanDetails = (plan) => {
    switch (plan) {
      case "free":
        return { projects: 2, users: 5 };
      case "pro":
        return { projects: 20, users: 50 };
      case "enterprise":
        return { projects: "Unlimited", users: "Unlimited" };
      default:
        return { projects: 0, users: 0 };
    }
  };

  const planDetails = getPlanDetails(company.subscription_plan);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-surface border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          <Building2 className="w-5 h-5 text-primary" />
          Company Information
        </h2>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-xl bg-background border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
            {company.logo_url ? (
              <img src={`${BASE_URL}${company.logo_url}`} alt={company.name} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-8 h-8 text-gray-500" />
            )}
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{company.name}</h3>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium uppercase tracking-wider ${
              company.subscription_plan === "enterprise" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
              company.subscription_plan === "pro" ? "bg-primary/10 text-primary border border-primary/20" :
              "bg-white/5 text-gray-400 border border-white/10"
            }`}>
              {company.subscription_plan} Plan
            </span>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-white/10 rounded-2xl p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <ShieldCheck className="w-5 h-5 text-primary" />
            Subscription Plan
          </h2>
          <span className="text-xs text-gray-400 flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-lg border border-white/5">
            <AlertCircle className="w-3.5 h-3.5 text-primary" />
            Managed by platform administrators
          </span>
        </div>
        
        <div className="bg-background rounded-xl p-6 border border-white/5">
          <div className="mb-4">
            <div className="text-xl font-medium text-white capitalize">{company.subscription_plan}</div>
            <p className="text-sm text-gray-400 mt-1">Current plan limits</p>
          </div>
          
          <div className="space-y-3 mt-6">
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <Check className="w-4 h-4 text-emerald-500" />
              <span><strong className="text-white">{planDetails.projects}</strong> active projects</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <Check className="w-4 h-4 text-emerald-500" />
              <span><strong className="text-white">{planDetails.users}</strong> team members</span>
            </div>
            {company.subscription_plan === "enterprise" && (
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Priority 24/7 support</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
