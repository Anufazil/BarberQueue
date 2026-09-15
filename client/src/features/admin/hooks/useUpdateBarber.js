import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateBarber } from "../api/barberApi";

export const useUpdateBarber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBarber,

    onSuccess: () => {
      ['admin-queue','admin-statistics','dashboard','customer-home','barber-dashboard'].forEach(key => queryClient.invalidateQueries({ queryKey: [key] }));
      toast.success("Barber updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["barbers"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Unable to update barber."
      );
    },
  });
};