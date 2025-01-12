import { createContext, useState, useEffect } from "react";
import { login, logout, checkSession } from "./authApi";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [redirectPath, setRedirectPath] = useState('/')
  const [user, setUser] = useState({});

  useEffect(() => {
    authCheck()
  }, [])
  
  const authLogin = (user) => {
    setIsAuthenticated(true)
    setUser(user)
  };

  const authLogout = async () => {
    setIsAuthenticated(false)
    setUser({})
  };

  const authCheck = async () => {
    try {
      const response = await checkSession()
      console.log(response.message)
      setIsAuthenticated(true)
      setUser(response.user)
    } catch (error) {
      console.error(`Error: ${error}`)
      setIsAuthenticated(false)
      setUser({})
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, authLogin, authLogout, redirectPath, setRedirectPath }}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthContext, AuthProvider};
