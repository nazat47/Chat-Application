import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const UserProtected = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  return !isAuthenticated ? <Navigate to="/login" replace /> : children;
};
