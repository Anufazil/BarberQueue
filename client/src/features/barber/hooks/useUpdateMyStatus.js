import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateMyStatus } from "../api/barberApi";

export const useUpdateMyStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyStatus,

    onSuccess: () => {
      ['admin-queue','admin-statistics','dashboard','customer-home','barber-dashboard'].forEach(key => queryClient.invalidateQueries({ queryKey: [key] }));
      toast.success("Status updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["barber-dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["barbers"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Unable to update status."
      );
    },
  });
};