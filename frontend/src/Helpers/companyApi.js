import api from "./axiosInterceptor";

export const getDashboard = () => api.get("/dashboard");
export const getAuditLogs = () => api.get("/audit-logs");
export const inviteUser = (data) => api.post("/users/invite", data);
export const getAllUsers = () => api.get("/users");
export const updateUser = (id, data) => api.patch(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);
