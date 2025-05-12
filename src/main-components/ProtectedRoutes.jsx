// import { useContext } from "react";
// import { AuthContext } from "./AuthContext";
import PropTypes from "prop-types";
import { Spinner } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoutes = ({ children }) => {
  const { user, isError, isLoading } = useAuth();
  if (isLoading) return <p></p>;

  if (isError || !user) return <Navigate to="/login" />;

  if (isLoading) {
    //console.log(`Loading...`)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }
  return <>{children}</>;
};

ProtectedRoutes.propTypes = {
  children: PropTypes.node,
};

export default ProtectedRoutes;
