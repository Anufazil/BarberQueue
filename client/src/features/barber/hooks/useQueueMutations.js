import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  callNextCustomer,
  finishCurrentCustomer,
  skipCustomer,
  cancelCustomer,
} from "../api/queueApi";

export const useCallNextCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: callNextCustomer,

    onSuccess: (data) => {
      ['admin-queue','admin-statistics','dashboard','customer-home','barber-dashboard'].forEach(key => queryClient.invalidateQueries({ queryKey: [key] }));
      toast.success(
        data?.message || "Next customer called successfully."
      );

      queryClient.invalidateQueries({
        queryKey: ["barber-dashboard"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to call next customer."
      );
    },
  });
};

export const useFinishCurrentCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: finishCurrentCustomer,

    onSuccess: (data) => {
      ['admin-queue','admin-statistics','dashboard','customer-home','barber-dashboard'].forEach(key => queryClient.invalidateQueries({ queryKey: [key] }));
      toast.success(
        data?.message || "Customer completed successfully."
      );

      queryClient.invalidateQueries({
        queryKey: ["barber-dashboard"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to finish customer."
      );
    },
  });
};

export const useSkipCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: skipCustomer,

    onSuccess: (data) => {
      ['admin-queue','admin-statistics','dashboard','customer-home','barber-dashboard'].forEach(key => queryClient.invalidateQueries({ queryKey: [key] }));
      toast.success(
        data?.message || "Customer skipped successfully."
      );

      queryClient.invalidateQueries({
        queryKey: ["barber-dashboard"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to skip customer."
      );
    },
  });
};

export const useCancelCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelCustomer,

    onSuccess: (data) => {
      ['admin-queue','admin-statistics','dashboard','customer-home','barber-dashboard'].forEach(key => queryClient.invalidateQueries({ queryKey: [key] }));
      toast.success(
        data?.message || "Customer cancelled successfully."
      );

      queryClient.invalidateQueries({
        queryKey: ["barber-dashboard"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to cancel customer."
      );
    },
  });
};