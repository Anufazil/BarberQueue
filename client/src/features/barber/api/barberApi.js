import api from "@/lib/axios";

export const getBarberDashboard = async () => {
  const { data } = await api.get("/barbers/dashboard");
  return data.data;
};

export const updateMyStatus = async ({ barberId, status }) => {
  const { data } = await api.patch(
    `/barbers/${barberId}/status`,
    { status }
  );

  return data;
};