import { createContext, useState, useEffect } from "react";
import { login, logout, checkSession } from "./authApi";
import { PropTypes } from "prop-types"
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

  const authLogout = () => {
    setIsAuthenticated(false)
    setUser({})
  };

  const authCheck = async () => {
    try {
      const response = await checkSession()
      console.log(response.message)
      authLogin(response.user)
    } catch (error) {
      console.error(`Error: ${error}`)
      authLogout()
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, authLogin, authLogout, redirectPath, setRedirectPath }}>
      {children}
    </AuthContext.Provider>
  );
};

const AuthProvider.propTypes = {
  chilred: PropTypes.node.required
}

export {AuthContext, AuthProvider};
