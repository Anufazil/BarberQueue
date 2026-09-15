import { useQuery } from "@tanstack/react-query";
import { getBarbers } from "../api/barberApi";

export const useBarbers = () => {
  return useQuery({
    queryKey: ["barbers"],
    queryFn: getBarbers,
    staleTime: 1000 * 60,
  });
};