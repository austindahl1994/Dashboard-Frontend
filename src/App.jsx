import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { AuthContext } from "./main-components/AuthContext";
import ProtectedRoutes from "./main-components/ProtectedRoutes"
import Dashboard from "./main-components/Dashboard";
import Login from "./main-components/Login";
import Home from "./main-components/Home"

/*
// routes.js
import WeatherWidget from './components/WeatherWidget';
import TodoWidget from './components/TodoWidget';
import Dashboard from './components/Dashboard';

export const allWidgets = {
  dashboard: { path: '/dashboard', component: Dashboard }, //only used for its route? or always have it
  weather: { path: '/weather', component: WeatherWidget },
  todo: { path: '/todo', component: TodoWidget },
};

*/

//Use and iterate ROUTES in protected routes
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          {/* map through allWidgets, each surrounded by ProtectedRoutes */}
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
