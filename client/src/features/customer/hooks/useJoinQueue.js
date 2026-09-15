import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { joinQueue } from "../api/customerApi";

export const useJoinQueue = () => {
  return useMutation({
    mutationFn: joinQueue,

    onSuccess: (response) => {
      toast.success(
        `Token #${response.data.queue.tokenNumber} generated successfully`
      );
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ??
          "Unable to join queue."
      );
    },
  });
};