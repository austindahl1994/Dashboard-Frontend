import { createContext, useState, useEffect } from "react";
import { login, logout, checkSession } from "./authApi";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const handleLogin = async (email, password) => {
    try {
      const userData = await login(email, password);
      if (userData) {
        console.log(
          `${userData.user_id}, ${userData.username} ${userData.email}, ${userData.role}`
        );
        setIsAuthenticated(true);
        setUser(userData);
      }
    } catch (error) {
      console.error(`Error: ${error}`);
      setIsAuthenticated(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await logout();
      console.log(response);
      setIsAuthenticated(false);
    } catch (error) {
      console.error(`Error: ${error}`);
      setIsAuthenticated(false);
    }
  };

  const checkForSession = async () => {
    try {
      const response = await checkSession()
      console.log(response.data.message)
    } catch (error) {
      console.error(`Error: ${error}`)
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, handleLogin, handleLogout, checkForSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthContext, AuthProvider};
