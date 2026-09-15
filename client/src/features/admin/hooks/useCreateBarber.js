import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { createBarber } from "../api/barberApi";

export const useCreateBarber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBarber,

    onSuccess: () => {
      ['admin-queue','admin-statistics','dashboard','customer-home','barber-dashboard'].forEach(key => queryClient.invalidateQueries({ queryKey: [key] }));
      toast.success("Barber created successfully");

      queryClient.invalidateQueries({
        queryKey: ["barbers"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Unable to create barber"
      );
    },
  });
};