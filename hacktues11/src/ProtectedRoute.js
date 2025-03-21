import { Navigate, Outlet } from "react-router";
import { useAuth } from "./AuthContext";

const getUser = () => {
  return localStorage.getItem("privileges"); // Example user: { role: "admin" }
};

const ProtectedRoute = ({ allowedRoles, children }) => {
  const privileges = getUser();

  if (!privileges) {
    return <Navigate to="/login" />;
  }

  return allowedRoles.includes(privileges) ? children : <Navigate to="/unauthorized" />;
};

export default ProtectedRoute;