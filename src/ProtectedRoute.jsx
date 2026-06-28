import { Navigate } from "react-router-dom";
import { UserAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { session, loading } = UserAuth();

  if (loading) {
    return; 
  }

  if (!session) {
    //redirect to signin if not authenticated
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;