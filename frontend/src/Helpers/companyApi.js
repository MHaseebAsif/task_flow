import api from "./axiosInterceptor";

export const getDashboard = () => api.get("/dashboard");
