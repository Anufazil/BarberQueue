import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateBarberStatus } from "../api/barberApi";

export const useUpdateBarberStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBarberStatus,

    onSuccess: () => {
      ['admin-queue','admin-statistics','dashboard','customer-home','barber-dashboard'].forEach(key => queryClient.invalidateQueries({ queryKey: [key] }));
      toast.success("Barber status updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["barbers"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Unable to update barber status."
      );
    },
  });
};