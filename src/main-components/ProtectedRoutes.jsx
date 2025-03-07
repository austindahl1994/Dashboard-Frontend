import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import PropTypes from "prop-types";
import { checkSession } from "../api";

const ProtectedRoutes = ({ children }) => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(AuthContext);
  const isCheckingRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
      const authCheck = async () => {
        if (isCheckingRef.current) return;
        isCheckingRef.current = true;
  
        try {
          const response = await checkSession();
          if (response?.data.message === "Authenticated") {
            console.log("User is authenticated");
            setIsAuthenticated(true);
            setUser(response.user); 
            navigate("/dashboard", { replace: true });
          } else {
            throw new Error("Invalid session");
          }
        } catch (e) {
          console.log(e.message);
          setIsAuthenticated(false);
          setUser({});
          navigate("/login", { replace: true });
        } finally {
          isCheckingRef.current = false;
        }
      };
  
      authCheck();
    }, [navigate, setIsAuthenticated, setUser]);

  return <>{children}</>;
};

ProtectedRoutes.propTypes = {
  children: PropTypes.node,
};

export default ProtectedRoutes;
