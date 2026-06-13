import api from "./axiosInterceptor";

export const getDashboard = () => api.get("/dashboard");
export const getAuditLogs = () => api.get("/audit-logs");
export const inviteUser = (data) => api.post("/users/invite", data);
export const getAllUsers = () => api.get("/users");
export const getMyCompany = (id) => api.get(`/companies/${id}`);
