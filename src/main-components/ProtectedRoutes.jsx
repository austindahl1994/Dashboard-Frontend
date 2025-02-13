import { useContext, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import PropTypes from "prop-types";

const ProtectedRoutes = ({ children }) => {
  const { isAuthenticated, setRedirectPath } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setRedirectPath(location.pathname);
    }
  }, [isAuthenticated, location, setRedirectPath]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

ProtectedRoutes.propTypes = {
  children: PropTypes.node,
};

export default ProtectedRoutes;
