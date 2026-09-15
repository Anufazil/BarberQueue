import { useQuery } from "@tanstack/react-query";
import { getQueueStatus } from "../api/customerApi";

export const useQueueStatus = (tokenNumber) => {
  return useQuery({
    queryKey: ["queue-status", tokenNumber],

    queryFn: () => getQueueStatus(tokenNumber),

    enabled: !!tokenNumber,

    refetchInterval: 10000,
  });
};