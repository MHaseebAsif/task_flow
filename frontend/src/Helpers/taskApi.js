import api from "./axiosInterceptor";

export const getTasks = (params) => api.get("/tasks", { params });
export const createTask = (data) => api.post("/tasks", data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const assignTask = (id, user_id) => api.post(`/tasks/${id}/assign`, { user_id });
export const updateTaskStatus = (id, status) => api.patch(`/tasks/${id}/status`, { status });
