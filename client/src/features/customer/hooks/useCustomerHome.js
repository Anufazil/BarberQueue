import { useQuery } from "@tanstack/react-query";
import { getCustomerHome } from "../api/customerApi";

export const useCustomerHome = () => {
  return useQuery({
    queryKey: ["customer-home"],
    queryFn: getCustomerHome,
    refetchInterval: 15000,
    staleTime: 0,
  });
};