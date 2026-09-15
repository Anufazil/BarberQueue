import api from "@/services/api";

export const callNextCustomer = async (barberId) => {

  const { data } = await api.patch(
    `/queue/${barberId}/next`
  );

  return data;
};

export const finishCurrentCustomer = async ({ barberId, queueId }) => {
  const { data } = await api.patch(
    `/queue/${barberId}/finish`, { queueId }
  );

  return data;
};

export const skipCustomer = async (queueId) => {
  const { data } = await api.patch(
    `/queue/skip/${queueId}`
  );

  return data;
};

export const cancelCustomer = async (queueId) => {
  const { data } = await api.patch(
    `/queue/cancel/${queueId}`
  );

  return data;
};