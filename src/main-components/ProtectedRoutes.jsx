import { useContext, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import PropTypes from "prop-types";
import { checkSession } from "../api";

const ProtectedRoutes = ({ children }) => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(AuthContext);
  const isCheckingRef = useRef(false);
  const hasChecked = useRef(false)
  const navigate = useNavigate();
  const location = useLocation().pathname

  useEffect(() => {
    if (hasChecked.current) return
    hasChecked.current = true
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;
      const authCheck = async () => {
        try {
          const response = await checkSession();
          if (response?.data.message === "Authenticated") {
            //console.log("User is authenticated");
            setIsAuthenticated(true);
            setUser(response.user); 
            //console.log(`Current user location: ${location}`)
            navigate(location || "/dashboard", { replace: true });
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
    }, [navigate, setIsAuthenticated, setUser, location]);

  return <>{children}</>;
};

ProtectedRoutes.propTypes = {
  children: PropTypes.node,
};

export default ProtectedRoutes;
