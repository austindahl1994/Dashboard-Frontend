import { useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import PropTypes from "prop-types";
import { Spinner } from "react-bootstrap";

const ProtectedRoutes = ({ children }) => {
  const { checkSession, isCheckingSession } = useContext(AuthContext);
  
  useEffect(() => {
    checkSession()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  if (isCheckingSession) {
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
