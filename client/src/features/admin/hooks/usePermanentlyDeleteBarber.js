import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { permanentlyDeleteBarber } from "../api/barberApi";

export const usePermanentlyDeleteBarber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: permanentlyDeleteBarber,

    onSuccess: () => {
      toast.success("Barber permanently deleted.");

      queryClient.invalidateQueries({
        queryKey: ["barbers"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ??
          "Unable to permanently delete barber."
      );
    },
  });
};