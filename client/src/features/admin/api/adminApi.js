import api from "@/lib/axios";

export const getDashboardStats = async () => {
  const { data } = await api.get("/admin/dashboard");
  return data;
};