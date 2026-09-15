import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const RoleGuard = ({ allowedRoles }) => {
  const { user } = useAuth();


  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role?.toUpperCase();

  const hasAccess = allowedRoles.some(
    (role) => role.toUpperCase() === userRole
  );

  if (!hasAccess) {

    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleGuard;