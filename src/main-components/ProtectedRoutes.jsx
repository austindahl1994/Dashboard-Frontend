import { useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import PropTypes from "prop-types";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const ProtectedRoutes = ({ children }) => {
  const { getUser } = useContext(AuthContext);
  const { data: user, isError, isLoading } = getUser;
  const navigate = useNavigate();
  const queryClient = useQueryClient()

  useEffect(() => {
    if (isError) {
      console.log(`There was an error validating the user`);
      queryClient.removeQueries(["User"]);
      navigate("/login");
    }
  }, [isError, user, navigate, queryClient]);

  // useEffect(() => {
  //   console.log("user:", user);
  //   console.log("isError:", isError);
  //   console.log("isLoading:", isLoading);
  // }, [user, isError, isLoading]);

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
