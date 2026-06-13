import api from "./axiosInterceptor";

export const signup = (formData) =>
  api.post("/auth/signup", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const login = (data) => api.post("/auth/login", data);

export const getCurrentUser = () => api.get("/users/me");
