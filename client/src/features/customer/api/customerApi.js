import api from "@/lib/axios";

export const getCustomerHome = async () => {
  const { data } = await api.get("/customer/home");
  return data;
};

export const joinQueue = async (payload) => {
  const { data } = await api.post("/queue/join", payload);
  return data;
};

export const getQueueStatus = async (token) => {
  const { data } = await api.get(`/queue/status/${token}`);
  return data;
};

export const cancelQueue = async (queueId) => {
  const { data } = await api.patch(
    '/queue/public/cancel', { accessToken: queueId }
  );

  return data;
};