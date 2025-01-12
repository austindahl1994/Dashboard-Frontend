import { createContext, useState, useEffect } from "react";
import { login, logout, checkSession } from "./authApi";
import { PropTypes } from "prop-types"
import { useNavigate } from "react-router-dom"
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [redirectPath, setRedirectPath] = useState('/dashboard') //remove home file
  const [user, setUser] = useState({});
  const navigate = useNavigate()
  
  useEffect(() => {
    authCheck()
  }, [])
  
  const authLogin = (email, password) => {
    try {
      const userData = await login(email, password);
      console.log(`${userData.user_id}, ${userData.username} ${userData.email}, ${userData.role}`);
      setIsAuthenticated(true)
      setUser(user)
      navigate(redirectPath, { replace: true })
    } catch (error) {
      console.error(`Error: ${error}`)
      throw error
    }
  };

  const authLogout = async () => {
    try {
      const response = await logout();
      console.log(response)
    } catch (error) {
      console.error(`Error: ${error}`)
    } finally {
      setIsAuthenticated(false)
      setUser({})
      navigate('/login')
    }
  };
  //if authcheck is valid, navigate to the redirect URL?
  //What is authcheck doing for us here, too late for my sleepy brain
  //What steps are needed for 
  const authCheck = async () => {
    try {
      const response = await checkSession() //checks if tokens are valid, gets username and password?
      console.log(response.message)
      authLogin(response.user)
    } catch (error) { //if error, must not be valid, make sure to logout and 
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
