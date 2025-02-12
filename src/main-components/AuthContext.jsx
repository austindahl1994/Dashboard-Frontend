import { createContext, useState, useEffect, useCallback } from "react";
import { login, logout, checkSession } from "./authApi";
import { PropTypes } from "prop-types";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/dashboard"); //remove home file
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
    try {
      const response = await logout();
      console.log(response);
    } catch (error) {
      console.error(`Error: ${error}`);
    } finally {
      setIsAuthenticated(false);
      setUser({});
      navigate("/login");
    }
  }, [navigate]);

  const authCheck = useCallback(async () => {
    try {
      const response = await checkSession();
      console.log(response.message);
      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        navigate(redirectPath, { replace: true });
      } else {
        authLogout();
      }
    } catch (error) {
      console.error(`Error: ${error}`);
      authLogout();
    }
  }, [redirectPath, navigate, authLogout]);

  useEffect(() => {
    authCheck();
  }, [authCheck]);

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
