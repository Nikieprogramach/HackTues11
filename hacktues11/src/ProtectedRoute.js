import { Navigate, Outlet } from "react-router";
import { useAuth } from "./AuthContext";

const getUser = () => {
  return JSON.parse(localStorage.getItem("user")); // Example user: { role: "admin" }
};

const ProtectedRoute = ({ allowedRoles, children }) => {
  const user = getUser();
  console.log("user:", user)
  if (!user) {
    return <Navigate to="/login" />;
  }
  console.log("1");
  console.log(allowedRoles.includes(user.privileges));
  return allowedRoles.includes(user.privileges) ? children : <Navigate to="/unauthorized" />;
};

export default ProtectedRoute;