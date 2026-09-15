import api from "@/lib/axios";

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const registerAdmin = async (adminData) => {
  const response = await api.post("/auth/register-admin", adminData);
  return response.data;
};