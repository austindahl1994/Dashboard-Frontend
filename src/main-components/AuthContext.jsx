import { createContext, useState, useEffect, useCallback } from "react";
import { login, logout, checkSession } from "./authApi";
import { PropTypes } from "prop-types";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logging, setLogging] = useState(false)
  const [redirectPath, setRedirectPath] = useState("/dashboard");
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
      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error(`Error: ${error}`);
      throw error;
    }
  };

  const authLogout = useCallback(async () => {
    setLogging(true);
    try {
      await logout(); // Backend should clear session properly
      setIsAuthenticated(false);
      setUser({});
      navigate("/login");

      // ✅ Double-check session is gone
      setTimeout(async () => {
        try {
          const response = await checkSession();
          if (response.user) {
            console.warn("Logout failed, user still exists:", response.user);
          } else {
            console.log("Logout successful, no user detected.");
          }
        } catch (error) {
          console.log("Session check confirmed logout.");
        }
      }, 500); // Slight delay to ensure backend processes request
    } catch (error) {
      console.error(`Logout Error: ${error}`);
    } finally {
      setLogging(false);
    }
  }, [navigate]);

  useEffect(() => {
    const authCheck = async () => {
      try {
        const response = await checkSession();
        if (response.user) {
          setUser(response.user);
          setIsAuthenticated(true);
        } else {
          console.log("No user response so logging out");
          setIsAuthenticated(false);
          setUser({});
        }
      } catch (error) {
        console.error(`Error: ${error}`);
        setIsAuthenticated(false);
        setUser({});
      }
    };

    if (!logging && !isAuthenticated) {
      authCheck();
    }
  }, [navigate, redirectPath, logging, isAuthenticated]);


  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        authLogin,
        authLogout,
        redirectPath,
        setRedirectPath,
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
