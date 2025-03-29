import { createContext, useState } from "react";
import { PropTypes } from "prop-types";
import { useNavigate } from "react-router-dom";
import { login, logout } from "../api";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const authLogin = async (email, password) => {
    try {
      const userData = await login(email, password);
      // console.log(
      //   `${userData.data.user_id}, ${userData.data.username} ${userData.data.email}, ${userData.data.role}`
      // );
      setIsAuthenticated(true);
      setUser(userData);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.log(`Error logging in`)
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

  return (
    <AuthContext.Provider
      value={{
        setIsAuthenticated,
        isAuthenticated,
        setUser,
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
