import api from "./axiosInterceptor";

export const getAdminDashboard = () => api.get("/admin/dashboard");
export const getAllCompanies = () => api.get("/admin/companies");
export const getCompanyDetails = (id) => api.get(`/admin/companies/${id}`);
export const updateCompanyStatus = (id, is_active) => api.patch(`/admin/companies/${id}/status`, { is_active });
export const updateCompanySubscription = (id, subscription_plan) => api.patch(`/admin/companies/${id}/subscription`, { subscription_plan });
