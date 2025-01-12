import { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from './AuthContext'
import PropTypes from 'prop-types'

const ProtectedRoutes = ({ children }) => {
  const { isAuthenticated, setRedirection } = useContext(AuthContext)
  const location = useLocation()
  
  if (!isAuthenticated) {
    setRedirectPath(location.pathname)
    return <Navigate to='/login' replace />
  }
  
  return (
    <>
      {children}
    </>
  )
}

ProtectedRoutes.propTypes = {
  children: PropTypes.node
}

export default ProtectedRoutes
