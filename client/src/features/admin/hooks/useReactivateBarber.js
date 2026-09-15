import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { reactivateBarber } from "../api/barberApi";

export const useReactivateBarber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reactivateBarber,

    onSuccess: () => {
      toast.success("Barber reactivated successfully.");

      queryClient.invalidateQueries({
        queryKey: ["barbers"],
        });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ??
          "Unable to reactivate barber."
      );
    },
  });
};