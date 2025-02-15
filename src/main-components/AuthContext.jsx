import { createContext, useState, useEffect, useRef } from "react";
import { login, logout, checkSession } from "./authApi";
import { PropTypes } from "prop-types";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isCheckingRef = useRef(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const authLogin = async (email, password) => {
    try {
      const userData = await login(email, password);
      console.log(
        `${userData.user_id}, ${userData.username} ${userData.email}, ${userData.role}`
      );
      setIsAuthenticated(true);
      setUser(userData);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error(`Error: ${error}`);
      throw error;
    }
  };

  const authLogout = async () => {
    try {
      await logout(); // Backend should clear session properly
      setIsAuthenticated(false);
      setUser({});
      navigate("/login");
    } catch (error) {
      console.error(`Logout Error: ${error}`);
    }
  };

  useEffect(() => {
    const authCheck = async () => {
      if (isCheckingRef.current) return;
      isCheckingRef.current = true;

      try {
        const response = await checkSession();
        if (response?.message === "Authenticated") {
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
  }, [navigate]); // This effect runs when `navigate` changes

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        authLogin,
        authLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext, AuthProvider };
