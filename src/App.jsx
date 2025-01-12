import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { AuthContext } from "./main-components/AuthContext";
import ProtectedRoutes from "./main-components/ProtectedRoutes"
import Dashboard from "./main-components/Dashboard";
import Login from "./main-components/Login";
import Home from "./main-components/Home"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoutes>
                <Dashboard />
              </ProtectedRoutes>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
