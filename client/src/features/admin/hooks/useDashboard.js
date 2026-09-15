import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../api/adminApi";

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardStats,
    staleTime: 0,
    refetchInterval: 15000,
  });
};