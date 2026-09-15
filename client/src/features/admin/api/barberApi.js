import api from "@/lib/axios";

export const getBarbers = async () => {
  const { data } = await api.get("/barbers");
  return data;
};

export const createBarber = async (payload) => {
  const { data } = await api.post("/barbers", payload);
  return data;
};

export const updateBarber = async ({ id, payload }) => {
  const { data } = await api.put(`/barbers/${id}`, payload);
  return data;
};

export const updateBarberStatus = async ({ id, status }) => {
  const { data } = await api.patch(
    `/barbers/${id}/status`,
    { status }
  );

  return data;
};

export const deleteBarber = async (id) => {
  const { data } = await api.delete(`/barbers/${id}`);
  return data;
};

export const permanentlyDeleteBarber = async (id) => {
  const { data } = await api.delete(`/barbers/${id}/permanent`);
  return data;
};

export const reactivateBarber = async (id) => {
  const { data } = await api.patch(`/barbers/${id}/reactivate`);
  return data;
};