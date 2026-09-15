import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { getBarberDashboard } from "../api/barberApi";

export const useBarberDashboard = () => {
  const { isAuthenticated, loading } = useAuth();

  return useQuery({
    queryKey: ["barber-dashboard"],
    queryFn: getBarberDashboard,

    enabled: isAuthenticated && !loading,

    staleTime: 0,
    refetchInterval: 15000,
  });
};