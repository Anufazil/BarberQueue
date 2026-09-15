import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { cancelQueue } from "../api/customerApi";

export const useCancelQueue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (queueId) => cancelQueue(queueId),

    onSuccess: () => {
      toast.success("Queue cancelled successfully.");

      queryClient.invalidateQueries({
        queryKey: ["queue-status"],
      });

      queryClient.invalidateQueries({
        queryKey: ["customer-home"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ?? "Unable to cancel queue."
      );
    },
  });
};